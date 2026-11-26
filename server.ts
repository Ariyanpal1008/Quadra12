import 'dotenv/config';
import http from 'http';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {GoogleGenAI, Type} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

interface GradeQuestionPayload {
  questionId: string;
  questionNumber: number;
  section: string;
  questionType: string;
  marks: number;
  chapterTag: string;
  prompt: string;
  orPrompt?: string;
  caseContext?: string;
  studentText: string;
  photos: Array<{
    mimeType: string;
    base64Data: string;
  }>;
  markingKey: {
    exactModelAnswer: string;
    stepMarks: Array<{label: string; marks: number}>;
    finalAnswerValue?: string;
    examinerCheckpoints: string[];
  };
}

interface GradeRequestBody {
  subjectId: 'physics' | 'chemistry' | 'biology' | 'maths';
  subjectName: string;
  subjectCode: string;
  questions: GradeQuestionPayload[];
}

function getSubjectRubric(subjectId: string): string {
  switch (subjectId) {
    case 'physics':
      return 'Physics (Code 042): Strictly verify correct formula statement, algebraic derivation steps, ray/circuit diagram neatness and labels, sign conventions, numerical substitution, and mandatory SI units in the final answer.';
    case 'chemistry':
      return 'Chemistry (Code 043): Strictly verify balanced chemical/ionic equations, IUPAC names, exact reagents & reaction conditions, curved-arrow organic mechanisms/structures, CFT/VBT terminology, and units in physical chemistry numericals.';
    case 'biology':
      return 'Biology (Code 044): Strictly verify point-wise NCERT scientific keywords, enzyme/gene/hormone names, Mendelian cross ratios/Punnett layouts, and accuracy + labeling of uploaded biological diagrams.';
    case 'maths':
      return 'Mathematics (Code 041): Strictly award step-by-step marks for formulas, theorems, properties, substitution/integration limits, and intermediate steps even if a minor final arithmetic slip occurs; deduct partial marks accurately per the marking key.';
    default:
      return 'Strictly evaluate against the provided Class 12 CBSE marking scheme checkpoints.';
  }
}

async function createServer() {
  const app = express();
  app.use(express.json({limit: '25mb'}));

  app.post('/api/exam/grade', async (req, res) => {
    try {
      const apiKeysStr =
        process.env.VITE_GEMINI_API_KEYS ||
        process.env.GEMINI_API_KEYS ||
        process.env.GEMINI_API_KEY ||
        '';
      const apiKeys = apiKeysStr
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      if (apiKeys.length === 0) {
        res.status(503).json({
          error:
            'GEMINI_API_KEYS or GEMINI_API_KEY is not configured. Configure it in the Secrets panel or .env file to run AI subjective grading.',
        });
        return;
      }

      const body = req.body as GradeRequestBody | undefined;
      if (
        !body ||
        !body.subjectId ||
        !Array.isArray(body.questions) ||
        body.questions.length === 0
      ) {
        res.status(400).json({error: 'Invalid exam grading request payload.'});
        return;
      }

      const systemInstruction = `
You are a strict, uncompromising Class 12 PCMB Examiner inside the Quadra 12 Examination Hall evaluating a batch of subjective answers across Sections B, C, D, and E (for 33-question PCB or 38-question Mathematics sample papers). For every submitted question, you are given the Question Number, Question Text, Max Marks, the Official Marking Scheme extracted from Quadra 12's Marking Scheme PDF, and the student's answer photo.

RULE 1: STRICT IMAGE GATEKEEPER ("red" / 0 MARKS) — ZERO GUESSING
- Invalid Objects: If a photo shows a phone screen, hand, face, wall, desk, or anything other than a handwritten/typed PCMB answer, immediately set that question's status to "red" and marks_awarded to 0.
- Hazy / Unreadable Handwriting: If a photo is blurry, hazy, dark, cut off, or the equations/text cannot be read with 100% certainty, DO NOT guess or hallucinate what the student meant. Treat hazy text as unreadable, set status to "red", and award 0 marks.
- Wrong Core Concept: If the student's formula, step-by-step proof, chemical equation, or biological concept contradicts the provided Marking Scheme PDF, set status to "red" and award 0 marks—even if they wrote paragraphs or copied the question.

RULE 2: STRICT STEP-MARKING AGAINST THE MARKING SCHEME PDF ("yellow" vs "green")
- "yellow" (Partial Marks): Award partial step marks ONLY when the photo is 100% legible AND the student has accurately completed at least one explicit value point / step shown in the provided Marking Scheme PDF (e.g., exact formula + substitution, valid integration/differentiation step, balanced equation, or labeled diagram) while missing later steps or the final answer. Never give "yellow" for random keywords or vague guesses.
- "green" (Full Marks): Award full marks ONLY when the photo is 100% legible AND every step, value point, final numerical/conceptual answer, and SI unit (where applicable) matches the provided Marking Scheme PDF completely.

Return ONLY valid JSON containing an array of graded results matching Quadra 12's grading schema, setting each question's palette color strictly to "grey", "red", "yellow", or "green".
`.trim();

      const parts: Array<
        | {text: string}
        | {inlineData: {mimeType: string; data: string}}
      > = [];

      const structuredManifest = body.questions.map((q) => ({
        questionId: q.questionId,
        questionNumber: q.questionNumber,
        section: q.section,
        questionType: q.questionType,
        max_marks: q.marks,
        chapterTag: q.chapterTag,
        prompt: q.prompt,
        internalChoiceOR: q.orPrompt ?? null,
        caseContext: q.caseContext ?? null,
        studentTypedAnswer: q.studentText.trim() || null,
        attachedPhotoCount: Array.isArray(q.photos) ? q.photos.length : 0,
        markingKey: q.markingKey,
      }));

      parts.push({
        text:
          `Grade Sections B to E for ${body.subjectName} (${body.subjectCode}).\n` +
          `Below is the complete structured exam bundle (questions, marking keys, and typed answers):\n` +
          JSON.stringify(structuredManifest, null, 2),
      });

      for (const q of body.questions) {
        if (!Array.isArray(q.photos) || q.photos.length === 0) continue;
        q.photos.forEach((photo, idx) => {
          if (photo?.base64Data && typeof photo.base64Data === 'string') {
            parts.push({
              text: `Attached Photo ${idx + 1} of ${q.photos.length} for questionId="${q.questionId}" (${q.section}, ${q.questionType}):`,
            });
            parts.push({
              inlineData: {
                mimeType: photo.mimeType || 'image/jpeg',
                data: photo.base64Data,
              },
            });
          }
        });
      }

      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-3.8-flash',
        'gemini-2.5-pro',
        'gemini-1.5-flash',
      ];

      const startIndex = Math.floor(Math.random() * apiKeys.length);
      let response: any = null;
      let lastError: any = null;

      for (let i = 0; i < apiKeys.length; i++) {
        const keyIdx = (startIndex + i) % apiKeys.length;
        const currentKey = apiKeys[keyIdx];
        const ai = new GoogleGenAI({
          apiKey: currentKey,
          httpOptions: {headers: {'User-Agent': 'aistudio-build'}},
        });

        for (const modelName of candidateModels) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents: {parts},
              config: {
                temperature: 0.0,
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    questionGrades: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          questionId: {type: Type.STRING},
                          status: {type: Type.STRING},
                          marks_awarded: {type: Type.NUMBER},
                          max_marks: {type: Type.NUMBER},
                          feedback: {type: Type.STRING},
                          exact_model_answer: {type: Type.STRING},
                        },
                        required: [
                          'questionId',
                          'status',
                          'marks_awarded',
                          'max_marks',
                          'feedback',
                          'exact_model_answer',
                        ],
                      },
                    },
                    examSummary: {
                      type: Type.OBJECT,
                      properties: {
                        weakTopics: {
                          type: Type.ARRAY,
                          items: {type: Type.STRING},
                        },
                        improvementTips: {
                          type: Type.ARRAY,
                          items: {type: Type.STRING},
                        },
                        examinerRemarks: {type: Type.STRING},
                      },
                      required: ['weakTopics', 'improvementTips', 'examinerRemarks'],
                    },
                  },
                  required: ['questionGrades', 'examSummary'],
                },
              },
            });
            if (response && response.text) {
              break;
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`Key idx ${keyIdx} on model ${modelName} failed:`, err?.message || err);
          }
        }
        if (response && response.text) {
          break;
        }
      }

      if (!response || !response.text) {
        const errMsg = lastError instanceof Error ? lastError.message : 'High demand on Gemini AI examiners';
        res.status(503).json({
          error: `AI Examiner models are temporarily busy (${errMsg}). Your answers and photos are safely preserved — please click Retry Submission.`,
        });
        return;
      }

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({
          error: 'Empty grading response received from Gemini examiner.',
        });
        return;
      }

      const parsed = JSON.parse(rawText) as {
        questionGrades?: Array<{
          questionId: string;
          marks_awarded: number;
          max_marks: number;
          feedback: string;
          exact_model_answer: string;
        }>;
        examSummary?: {
          weakTopics?: string[];
          improvementTips?: string[];
          examinerRemarks?: string;
        };
      };

      const gradeMap = new Map<
        string,
        {
          questionId: string;
          marks_awarded: number;
          max_marks: number;
          feedback: string;
          exact_model_answer: string;
        }
      >();
      for (const item of parsed.questionGrades ?? []) {
        if (item?.questionId) {
          gradeMap.set(item.questionId, item);
        }
      }

      // Normalize and enforce exact bounds + unattempted zero safeguard
      const normalizedGrades = body.questions.map((q) => {
        const hasAttempt =
          q.studentText.trim().length > 0 || (q.photos && q.photos.length > 0);
        const aiGrade = gradeMap.get(q.questionId);
        const rawAwarded =
          hasAttempt && aiGrade && Number.isFinite(aiGrade.marks_awarded)
            ? aiGrade.marks_awarded
            : 0;
        const clampedAwarded = Math.round(
          Math.max(0, Math.min(q.marks, rawAwarded)) * 2,
        ) / 2;

        return {
          questionId: q.questionId,
          marks_awarded: clampedAwarded,
          max_marks: q.marks,
          feedback: !hasAttempt
            ? 'Unattempted question (0 marks awarded). Review the step-by-step model answer below.'
            : aiGrade?.feedback?.trim() ||
              'Evaluated against the subject marking scheme checkpoints.',
          exact_model_answer:
            aiGrade?.exact_model_answer?.trim() || q.markingKey.exactModelAnswer,
        };
      });

      const examSummary = {
        weakTopics:
          Array.isArray(parsed.examSummary?.weakTopics) &&
          parsed.examSummary.weakTopics.length > 0
            ? parsed.examSummary.weakTopics
            : ['Review unattempted and partial-credit chapters carefully'],
        improvementTips:
          Array.isArray(parsed.examSummary?.improvementTips) &&
          parsed.examSummary.improvementTips.length > 0
            ? parsed.examSummary.improvementTips
            : [
                'Always write core formulas, balanced equations, and SI units clearly before substitution.',
              ],
        examinerRemarks:
          parsed.examSummary?.examinerRemarks?.trim() ||
          'Complete subjective evaluation anchored to the Quadra 12 marking scheme.',
      };

      res.json({
        questionGrades: normalizedGrades,
        examSummary,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unexpected server error while grading.';
      res.status(500).json({error: msg});
    }
  });

  // Ensure API 404s return JSON instead of falling through to Vite HTML
  app.use('/api/*', (_req, res) => {
    res.status(404).json({error: 'API endpoint not found.'});
  });

  const httpServer = http.createServer(app);

  if (!IS_PROD) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : {server: httpServer},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Quadra 12 server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start Quadra 12 server:', err);
  process.exit(1);
});
