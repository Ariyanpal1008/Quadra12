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

  const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const appUrlOrigin = (() => {
    const raw = (process.env.APP_URL || '').trim();
    if (!raw) return '';
    try {
      return new URL(raw).origin;
    } catch {
      return '';
    }
  })();

  const allowedOrigins = new Set<string>([
    'https://localhost',
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'capacitor://localhost',
    'https://ariyanpal1008.github.io',
    ...(appUrlOrigin ? [appUrlOrigin] : []),
    ...extraOrigins,
  ]);

  app.use('/api', (req, res, next) => {
    const originHeader =
      typeof req.headers.origin === 'string'
        ? req.headers.origin.trim().replace(/\/$/, '')
        : '';

    if (originHeader && allowedOrigins.has(originHeader)) {
      res.setHeader('Access-Control-Allow-Origin', originHeader);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (req.method === 'OPTIONS') {
      res.status(originHeader && !allowedOrigins.has(originHeader) ? 403 : 204).end();
      return;
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ok: true, service: 'quadra12-grading-proxy'});
  });

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
You are a strict, uncompromising Class 12 PCMB Examiner inside the Quadra 12 Examination Hall evaluating a batch of subjective answers across Sections B, C, D, and E (for 33-question PCB or 38-question Mathematics sample papers). For every submitted question, you are given the Question Number, Question Text, Max Marks, the Official Marking Scheme extracted from Quadra 12's Marking Scheme PDF, and the student's answer photo and/or typed response.

RULE 1: STRICT IMAGE & TEXT GATEKEEPER ("red" / 0 MARKS) — ZERO GUESSING
- Invalid Objects: Carefully inspect every image. If a photo shows decorative patterns, textures, wallpaper, cloth prints, fabric, bedsheet, clothes, floor, wall, desk, ceiling, phone screen, hand, face, random object, meme, or anything other than a genuine handwritten/typed Class 12 PCMB answer sheet, IMMEDIATELY set that question's status to "red", marks_awarded to 0, and feedback to: "Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer."
- Hazy / Unreadable Handwriting: If a photo is blurry, hazy, dark, cut off, blank, or the equations/text cannot be read with 100% certainty, DO NOT guess or hallucinate what the student meant. Treat hazy text as unreadable, set status to "red", marks_awarded to 0, and feedback to: "Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer."
- Gibberish / Nonsense / Irrelevant Text: If the student's typed text is random keystrokes (like "Hhybxgz", "asdf", "qwerty"), meaningless filler words, copied question text, or unrelated nonsense, IMMEDIATELY set status to "red", marks_awarded to 0, and feedback to: "Submission Disqualified (0 Marks): Response was gibberish, irrelevant, or did not show a valid written answer."
- Wrong Core Concept: If the student's formula, step-by-step proof, chemical equation, or biological concept contradicts the provided Marking Scheme PDF, set status to "red" and award 0 marks—even if they wrote paragraphs or copied the question.

RULE 2: STRICT STEP-MARKING AGAINST THE MARKING SCHEME PDF ("yellow" vs "green")
- "yellow" (Partial Marks): Award partial step marks ONLY when the photo/text is 100% legible AND the student has accurately completed at least one explicit value point / step shown in the provided Marking Scheme PDF (e.g., exact formula + substitution, valid integration/differentiation step, balanced equation, or labeled diagram) while missing later steps or the final answer. Never give "yellow" for random keywords, gibberish, or vague guesses.
- "green" (Full Marks): Award full marks ONLY when the photo/text is 100% legible AND every step, value point, final numerical/conceptual answer, and SI unit (where applicable) matches the provided Marking Scheme PDF completely.

Return ONLY valid JSON containing an array of graded results matching Quadra 12's grading schema, setting each question's palette color strictly to "grey", "red", "yellow", or "green".
`.trim();

      function isGibberishText(text: string): boolean {
        const trimmed = text.trim();
        if (!trimmed) return false;

        // Catch symbol/punctuation spam like +_**(*&"&&"& or ??? or ***
        if (/[_*&"$#@!~`\\|]{3,}|[+*_(&"]{4,}|([!@#$%^&*_+=~`|\\?])\1{2,}/.test(trimmed)) {
          return true;
        }

        // Split on spaces & punctuation to inspect letter tokens regardless of attached symbols
        const tokens = trimmed
          .split(/[\s,=+*/()[\]{}_&^%$#@!~`"';:<>|\\?-]+/)
          .filter(Boolean);

        const lower = trimmed.toLowerCase();
        const trivialFillers = new Set([
          'hi', 'hello', 'hey', 'ok', 'okay', 'idk', 'na', 'nil', 'none', 'nothing',
          'null', 'test', 'testing', 'abc', 'xyz', 'asdf', 'qwer', 'qwerty', 'zxcv',
          'pass', 'skip', 'lol', 'bro', 'sir', 'mam', 'please', 'sorry', 'check',
        ]);
        if (
          tokens.length === 1 &&
          (trivialFillers.has(lower) ||
            (/^[a-zA-Z]+$/.test(trimmed) &&
              trimmed.length <= 4 &&
              !/^(yes|no|dna|rna|atp|adp|emf|ohm|amp|mol|ph|cft|vbt|sn1|sn2|hiv|pcr)$/i.test(
                trimmed,
              )))
        ) {
          return true;
        }
        if (/^(.)\1{2,}$/i.test(lower)) return true;

        // Check individual alpha tokens for vowel-less keyboard mash (e.g. Hhybxgz, kfkfjf)
        const alphaTokens = tokens.filter((t) => /^[a-zA-Z]+$/.test(t));
        let weirdWords = 0;
        let shortConsonantFragments = 0;
        for (const w of alphaTokens) {
          if (w.length >= 5 && !/[aeiou]/i.test(w)) {
            weirdWords++;
          } else if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w)) {
            weirdWords++;
          } else if (w.length >= 4 && /^(asdf|qwer|zxcv|hjkl|uiop|hhyb|kfkf)/i.test(w)) {
            weirdWords++;
          } else if (w.length <= 2 && !/[aeiou]/i.test(w)) {
            shortConsonantFragments++;
          }
        }
        if (weirdWords > 0 && weirdWords >= Math.ceil(alphaTokens.length / 2)) {
          return true;
        }
        // Catch strings like "Fx,f,f,fk,kfkfjf..." where most fragments are meaningless consonant clusters
        if (
          alphaTokens.length >= 3 &&
          shortConsonantFragments + weirdWords >= Math.ceil(alphaTokens.length * 0.7) &&
          !/=/.test(trimmed)
        ) {
          return true;
        }
        return false;
      }

      // Dynamically collect ONLY valid attempted questions for 1-call batch grading
      const attemptedQuestions = body.questions.filter((q) => {
        const hasText = q.studentText.trim().length > 0;
        const hasPhotos = Array.isArray(q.photos) && q.photos.length > 0;
        if (!hasText && !hasPhotos) return false;
        if (!hasPhotos && isGibberishText(q.studentText)) return false;
        return true;
      });

      const gradeMap = new Map<
        string,
        {
          questionId: string;
          status?: string;
          marks_awarded: number;
          max_marks: number;
          feedback: string;
          exact_model_answer: string;
        }
      >();
      let parsedSummary: {
        weakTopics?: string[];
        improvementTips?: string[];
        examinerRemarks?: string;
      } | undefined;

      if (attemptedQuestions.length > 0) {
        const parts: Array<
          | {text: string}
          | {inlineData: {mimeType: string; data: string}}
        > = [];

        const structuredManifest = attemptedQuestions.map((q) => ({
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
            `Grade the attempted Sections B to E questions for ${body.subjectName} (${body.subjectCode}).\n` +
            `${getSubjectRubric(body.subjectId)}\n` +
            `Below is the structured exam bundle (questions, marking scheme steps, and student answers):\n` +
            JSON.stringify(structuredManifest, null, 2),
        });

        for (const q of attemptedQuestions) {
          if (!Array.isArray(q.photos) || q.photos.length === 0) continue;
          q.photos.forEach((photo, idx) => {
            if (photo?.base64Data && typeof photo.base64Data === 'string') {
              parts.push({
                text: `Attached Photo ${idx + 1} of ${q.photos.length} for questionId="${q.questionId}" (Q${q.questionNumber}, ${q.section}, ${q.questionType}):`,
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
          'gemini-3.1-flash-lite',
          'gemini-3.8-flash',
          'gemini-4-hydrogen',
        ];

        const startIndex = Math.floor(Math.random() * apiKeys.length);
        let response: any = null;
        let lastError: any = null;

        for (const modelName of candidateModels) {
          for (let i = 0; i < apiKeys.length; i++) {
            const keyIdx = (startIndex + i) % apiKeys.length;
            const currentKey = apiKeys[keyIdx];
            const ai = new GoogleGenAI({
              apiKey: currentKey,
              httpOptions: {headers: {'User-Agent': 'aistudio-build'}},
            });

            try {
              const configObj: any = {
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
              };

              if (modelName !== 'gemini-4-hydrogen') {
                configObj.temperature = 0.0;
              }

              response = await Promise.race([
                ai.models.generateContent({
                  model: modelName,
                  contents: {parts},
                  config: configObj,
                }),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Gemini request timed out')), 10000),
                ),
              ]);
              if (response && response.text) {
                break;
              }
            } catch (err: any) {
              lastError = err;
              console.warn(`Model ${modelName} / key idx ${keyIdx} failed:`, err?.message || err);
            }
          }
          if (response && response.text) {
            break;
          }
        }

        if (!response || !response.text) {
          const errMsg = lastError instanceof Error ? lastError.message : 'High demand on Gemini AI examiners';
          res.status(503).json({
            rateLimited: true,
            error: `AI Examiner models are temporarily busy (${errMsg}).`,
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
            status?: string;
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

        for (const item of parsed.questionGrades ?? []) {
          if (item?.questionId) {
            gradeMap.set(item.questionId, item);
          }
        }
        parsedSummary = parsed.examSummary;
      }

      // Normalize and enforce exact bounds + unattempted zero + gibberish safeguard
      const normalizedGrades = body.questions.map((q) => {
        const hasText = q.studentText.trim().length > 0;
        const hasPhotos = Array.isArray(q.photos) && q.photos.length > 0;
        const hasAttempt = hasText || hasPhotos;

        if (!hasAttempt) {
          return {
            questionId: q.questionId,
            status: 'grey',
            marks_awarded: 0,
            max_marks: q.marks,
            feedback: 'Unattempted question (0 marks awarded). Review the step-by-step model answer below.',
            exact_model_answer: q.markingKey.exactModelAnswer,
          };
        }

        if (!hasPhotos && isGibberishText(q.studentText)) {
          return {
            questionId: q.questionId,
            status: 'red',
            marks_awarded: 0,
            max_marks: q.marks,
            feedback: 'Submission Disqualified (0 Marks): Response was gibberish, irrelevant, or did not show a valid written answer.',
            exact_model_answer: q.markingKey.exactModelAnswer,
          };
        }

        const aiGrade = gradeMap.get(q.questionId);
        const rawAwarded =
          aiGrade && Number.isFinite(aiGrade.marks_awarded)
            ? aiGrade.marks_awarded
            : 0;
        const clampedAwarded = Math.round(
          Math.max(0, Math.min(q.marks, rawAwarded)) * 2,
        ) / 2;

        const computedStatus =
          clampedAwarded >= q.marks ? 'green' : clampedAwarded > 0 ? 'yellow' : 'red';

        return {
          questionId: q.questionId,
          status: computedStatus,
          marks_awarded: clampedAwarded,
          max_marks: q.marks,
          feedback:
            aiGrade?.feedback?.trim() ||
            (clampedAwarded === 0 && hasPhotos
              ? 'Submission Disqualified (0 Marks): Photo was hazy/unreadable or did not show a valid written answer.'
              : 'Evaluated strictly against the official CBSE marking scheme PDF checkpoints.'),
          exact_model_answer:
            aiGrade?.exact_model_answer?.trim() || q.markingKey.exactModelAnswer,
        };
      });

      const examSummary = {
        weakTopics:
          Array.isArray(parsedSummary?.weakTopics) &&
          parsedSummary.weakTopics.length > 0
            ? parsedSummary.weakTopics
            : ['Review unattempted and disqualified chapters carefully'],
        improvementTips:
          Array.isArray(parsedSummary?.improvementTips) &&
          parsedSummary.improvementTips.length > 0
            ? parsedSummary.improvementTips
            : [
                'Always write core formulas, balanced equations, and SI units clearly before substitution.',
              ],
        examinerRemarks:
          parsedSummary?.examinerRemarks?.trim() ||
          'Complete subjective evaluation anchored strictly to the Quadra 12 Marking Scheme PDF.',
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
