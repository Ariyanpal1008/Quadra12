import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FREE_TIER_GEMINI_MODELS,
  SequentialGeminiFailover,
  buildDeterministicSelfCheckResponse,
  classifyGeminiError,
  isFreeTierGeminiModel,
  parseServerGeminiKeys,
} from './geminiFailover';

test('parseServerGeminiKeys reads only server-side GEMINI_API_KEYS / GEMINI_API_KEY and ignores VITE_GEMINI_API_KEYS', () => {
  assert.deepEqual(
    parseServerGeminiKeys({VITE_GEMINI_API_KEYS: 'client1,client2'}),
    [],
  );

  assert.deepEqual(
    parseServerGeminiKeys({
      GEMINI_API_KEYS: 'k1, k2, k2, k3, k4, k5, k6',
      VITE_GEMINI_API_KEYS: 'should_be_ignored',
    }),
    ['k1', 'k2', 'k3', 'k4', 'k5'],
  );

  assert.deepEqual(parseServerGeminiKeys({GEMINI_API_KEY: 'single_key'}), [
    'single_key',
  ]);
});

test('FREE_TIER_GEMINI_MODELS enforces free-tier models only', () => {
  assert.equal(isFreeTierGeminiModel('gemini-3.1-flash-lite'), true);
  assert.equal(isFreeTierGeminiModel('gemini-4-hydrogen'), true);
  assert.equal(isFreeTierGeminiModel('gemini-4-neon'), false);
  assert.equal(isFreeTierGeminiModel('gemini-4-carbon'), false);
  assert.equal(isFreeTierGeminiModel('gemini-4-argon'), false);
  assert.equal(FREE_TIER_GEMINI_MODELS.length, 2);
});

test('Sequential failover walks Project 1 -> 2 -> 3 on 503 outage and recovers back to Project 1 after cooldown', async () => {
  let clock = 1_000_000;
  const failover = new SequentialGeminiFailover(() => clock);
  const keys = ['p1', 'p2', 'p3', 'p4', 'p5'];

  const firstAttemptOrder: number[] = [];
  const res1 = await failover.executeSequential(keys, async ({projectNumber}) => {
    firstAttemptOrder.push(projectNumber);
    if (projectNumber <= 2) {
      const err = new Error('503 UNAVAILABLE') as Error & {status?: number};
      err.status = 503;
      throw err;
    }
    return {projectNumber};
  });

  assert.equal(res1.ok, true);
  if (res1.ok) {
    assert.equal(res1.projectNumber, 3);
  }
  assert.deepEqual(firstAttemptOrder, [1, 2, 3]);

  // While Projects 1 and 2 are in service-unavailable backoff, healthy Project 3 serves next call
  const secondAttemptOrder: number[] = [];
  const res2 = await failover.executeSequential(keys, async ({projectNumber}) => {
    secondAttemptOrder.push(projectNumber);
    return {projectNumber};
  });
  assert.equal(res2.ok, true);
  assert.deepEqual(secondAttemptOrder, [3]);

  // After 30s cooldown expires, normal evaluation recovers back to Project 1
  clock += 31_000;
  const thirdAttemptOrder: number[] = [];
  const res3 = await failover.executeSequential(keys, async ({projectNumber}) => {
    thirdAttemptOrder.push(projectNumber);
    return {projectNumber};
  });
  assert.equal(res3.ok, true);
  assert.deepEqual(thirdAttemptOrder, [1]);
});

test('Sequential failover tries all 5 projects on temporary outage then activates Self-Check fallback', async () => {
  const clock = 2_000_000;
  const failover = new SequentialGeminiFailover(() => clock);
  const keys = ['p1', 'p2', 'p3', 'p4', 'p5'];

  const res = await failover.executeSequential(keys, async () => {
    const err = new Error('503 Service Unavailable') as Error & {status?: number};
    err.status = 503;
    throw err;
  });

  assert.equal(res.ok, false);
  if (!res.ok) {
    assert.deepEqual(res.attemptedProjects, [1, 2, 3, 4, 5]);
    assert.equal(res.quotaExhausted, false);
    assert.ok(res.retryAfterSeconds >= 30);
  }

  const status = failover.getPublicStatus(5);
  assert.equal(status.activeMode, 'self-check');
  assert.equal(status.availableProjects, 0);
});

test('Respects 429 RESOURCE_EXHAUSTED retry window without rotating across projects to circumvent quotas', async () => {
  let clock = 5_000_000;
  const failover = new SequentialGeminiFailover(() => clock);
  const keys = ['p1', 'p2', 'p3', 'p4', 'p5'];

  const quotaCalls: number[] = [];
  const resQuota = await failover.executeSequential(keys, async ({projectNumber}) => {
    quotaCalls.push(projectNumber);
    const err = new Error('429 RESOURCE_EXHAUSTED retryDelay: "42s"') as Error & {
      status?: number;
    };
    err.status = 429;
    throw err;
  });

  assert.equal(resQuota.ok, false);
  if (!resQuota.ok) {
    assert.equal(resQuota.quotaExhausted, true);
    assert.equal(resQuota.retryAfterSeconds, 42);
    assert.deepEqual(quotaCalls, [1]);
  }

  // Subsequent request during the 42s retry window makes 0 upstream calls
  const duringCooldownCalls: number[] = [];
  const resCooldown = await failover.executeSequential(keys, async ({projectNumber}) => {
    duringCooldownCalls.push(projectNumber);
    return {projectNumber};
  });
  assert.equal(resCooldown.ok, false);
  assert.deepEqual(duringCooldownCalls, []);

  // Once 42s passes, quota window resets and Project 1 resumes
  clock += 43_000;
  const recoveredCalls: number[] = [];
  const resRecovered = await failover.executeSequential(keys, async ({projectNumber}) => {
    recoveredCalls.push(projectNumber);
    return {projectNumber};
  });
  assert.equal(resRecovered.ok, true);
  assert.deepEqual(recoveredCalls, [1]);
});

test('classifyGeminiError redacts API keys from error logs/messages', () => {
  const classified = classifyGeminiError(
    new Error('Upstream failed at https://example.test?key=AIzaSySecretTestKey123456'),
  );
  assert.equal(classified.summary.includes('AIzaSySecretTestKey'), false);
});

test('buildDeterministicSelfCheckResponse performs deterministic validation and discloses AI unavailability', () => {
  const result = buildDeterministicSelfCheckResponse({
    questions: [
      {
        questionId: 'q1',
        questionNumber: 17,
        marks: 2,
        chapterTag: 'Ray Optics',
        studentText: '',
        photos: [],
        markingKey: {
          exactModelAnswer: 'Model Answer 1',
          stepMarks: [],
          examinerCheckpoints: [],
        },
      },
      {
        questionId: 'q2',
        questionNumber: 18,
        marks: 2,
        chapterTag: 'Electrostatics',
        studentText: 'Hhybxgz',
        photos: [],
        markingKey: {
          exactModelAnswer: 'Model Answer 2',
          stepMarks: [],
          examinerCheckpoints: [],
        },
      },
      {
        questionId: 'q3',
        questionNumber: 19,
        marks: 2,
        chapterTag: 'Current Electricity',
        studentText: 'By Ohm law V = IR so R = 5 ohm',
        photos: [],
        markingKey: {
          exactModelAnswer: 'Using V = IR, R = 5 ohm',
          stepMarks: [
            {label: 'Formula V = IR and substitution', marks: 1},
            {label: 'Final value 5 ohm', marks: 1},
          ],
          finalAnswerValue: '5 ohm',
          examinerCheckpoints: ['Formula V = IR'],
        },
      },
    ],
    unavailableReason: 'All 5 Gemini projects temporarily busy.',
    quotaExhausted: true,
    retryAfterSeconds: 42,
  });

  assert.equal(result.isSelfCheckMode, true);
  assert.equal(result.geminiUnavailable, true);
  assert.equal(result.questionGrades[0].status, 'grey');
  assert.equal(result.questionGrades[1].status, 'red');
  assert.equal(result.questionGrades[1].disqualified, true);
  assert.equal(result.questionGrades[2].status, 'grey');
  assert.ok(result.questionGrades[2].feedback.includes('No AI evaluation was performed'));
  assert.ok(result.questionGrades[2].feedback.includes('5 ohm'));
  assert.ok(result.examSummary.examinerRemarks.includes('Gemini AI Evaluation Unavailable'));
});
