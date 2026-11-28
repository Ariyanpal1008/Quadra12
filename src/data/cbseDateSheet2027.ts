export interface CbseBoardExamEntry {
  id: string;
  subject: string;
  code: string;
  displayDayDate: string;
  timeWindowLabel: string;
  dateIso: string;
  startIso: string;
  endIso: string;
  startMs: number;
  endMs: number;
  isMainPcmb: boolean;
}

export type ExamScheduleStatus = 'upcoming' | 'today' | 'completed';

export interface EvaluatedCbseExam extends CbseBoardExamEntry {
  status: ExamScheduleStatus;
  daysLeft: number;
  isInProgress: boolean;
  isNextUp: boolean;
}

export interface Cbse2027ScheduleState {
  exams: EvaluatedCbseExam[];
  activeExam: EvaluatedCbseExam | null;
  completedCount: number;
  allCompleted: boolean;
  isExpired: boolean;
}

export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const CBSE_2027_DATE_SHEET: CbseBoardExamEntry[] = [
  {
    id: 'cbse-2027-physics',
    subject: 'Physics',
    code: '042',
    displayDayDate: 'Tue, 16 Feb 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-02-16',
    startIso: '2027-02-16T10:30:00+05:30',
    endIso: '2027-02-16T13:30:00+05:30',
    startMs: Date.parse('2027-02-16T10:30:00+05:30'),
    endMs: Date.parse('2027-02-16T13:30:00+05:30'),
    isMainPcmb: true,
  },
  {
    id: 'cbse-2027-physical-education',
    subject: 'Physical Education',
    code: '048',
    displayDayDate: 'Thu, 18 Feb 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-02-18',
    startIso: '2027-02-18T10:30:00+05:30',
    endIso: '2027-02-18T13:30:00+05:30',
    startMs: Date.parse('2027-02-18T10:30:00+05:30'),
    endMs: Date.parse('2027-02-18T13:30:00+05:30'),
    isMainPcmb: false,
  },
  {
    id: 'cbse-2027-fine-arts',
    subject: 'Fine Arts — Painting, Graphics, Sculpture, Applied Art',
    code: '049 / 050 / 051 / 052',
    displayDayDate: 'Wed, 24 Feb 2027',
    timeWindowLabel: '10:30 AM – 12:30 PM IST',
    dateIso: '2027-02-24',
    startIso: '2027-02-24T10:30:00+05:30',
    endIso: '2027-02-24T12:30:00+05:30',
    startMs: Date.parse('2027-02-24T10:30:00+05:30'),
    endMs: Date.parse('2027-02-24T12:30:00+05:30'),
    isMainPcmb: false,
  },
  {
    id: 'cbse-2027-chemistry',
    subject: 'Chemistry',
    code: '043',
    displayDayDate: 'Sat, 27 Feb 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-02-27',
    startIso: '2027-02-27T10:30:00+05:30',
    endIso: '2027-02-27T13:30:00+05:30',
    startMs: Date.parse('2027-02-27T10:30:00+05:30'),
    endMs: Date.parse('2027-02-27T13:30:00+05:30'),
    isMainPcmb: true,
  },
  {
    id: 'cbse-2027-mathematics',
    subject: 'Mathematics / Applied Mathematics',
    code: '041 / 241',
    displayDayDate: 'Tue, 9 Mar 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-03-09',
    startIso: '2027-03-09T10:30:00+05:30',
    endIso: '2027-03-09T13:30:00+05:30',
    startMs: Date.parse('2027-03-09T10:30:00+05:30'),
    endMs: Date.parse('2027-03-09T13:30:00+05:30'),
    isMainPcmb: true,
  },
  {
    id: 'cbse-2027-biology',
    subject: 'Biology',
    code: '044',
    displayDayDate: 'Thu, 25 Mar 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-03-25',
    startIso: '2027-03-25T10:30:00+05:30',
    endIso: '2027-03-25T13:30:00+05:30',
    startMs: Date.parse('2027-03-25T10:30:00+05:30'),
    endMs: Date.parse('2027-03-25T13:30:00+05:30'),
    isMainPcmb: true,
  },
  {
    id: 'cbse-2027-computer-science',
    subject: 'Computer Science',
    code: '083',
    displayDayDate: 'Wed, 31 Mar 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-03-31',
    startIso: '2027-03-31T10:30:00+05:30',
    endIso: '2027-03-31T13:30:00+05:30',
    startMs: Date.parse('2027-03-31T10:30:00+05:30'),
    endMs: Date.parse('2027-03-31T13:30:00+05:30'),
    isMainPcmb: false,
  },
  {
    id: 'cbse-2027-web-application',
    subject: 'Web Application',
    code: '803',
    displayDayDate: 'Fri, 9 Apr 2027',
    timeWindowLabel: '10:30 AM – 01:30 PM IST',
    dateIso: '2027-04-09',
    startIso: '2027-04-09T10:30:00+05:30',
    endIso: '2027-04-09T13:30:00+05:30',
    startMs: Date.parse('2027-04-09T10:30:00+05:30'),
    endMs: Date.parse('2027-04-09T13:30:00+05:30'),
    isMainPcmb: false,
  },
];

export const FINAL_CBSE_2027_EXAM_END_MS =
  CBSE_2027_DATE_SHEET[CBSE_2027_DATE_SHEET.length - 1].endMs;

export function getIstDateKey(ms: number): string {
  const shifted = new Date(ms + IST_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shifted.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDayUtcMs(dateIso: string): number {
  const [y, m, d] = dateIso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function evaluateCbse2027Schedule(nowMs: number): Cbse2027ScheduleState {
  const todayIstIso = getIstDateKey(nowMs);
  const todayDayMs = parseIsoDayUtcMs(todayIstIso);
  let assignedNext = false;

  const exams: EvaluatedCbseExam[] = CBSE_2027_DATE_SHEET.map((entry) => {
    const isCompleted = nowMs >= entry.endMs;
    const isExamToday = !isCompleted && todayIstIso === entry.dateIso;
    const isInProgress = !isCompleted && nowMs >= entry.startMs;

    const examDayMs = parseIsoDayUtcMs(entry.dateIso);
    const calendarDaysDiff = Math.max(
      0,
      Math.round((examDayMs - todayDayMs) / 86400000),
    );

    const status: ExamScheduleStatus = isCompleted
      ? 'completed'
      : isExamToday
        ? 'today'
        : 'upcoming';

    let isNextUp = false;
    if (!isCompleted && !assignedNext) {
      isNextUp = true;
      assignedNext = true;
    }

    return {
      ...entry,
      status,
      daysLeft: calendarDaysDiff,
      isInProgress,
      isNextUp,
    };
  });

  const activeExam = exams.find((exam) => exam.isNextUp) ?? null;
  const completedCount = exams.filter((exam) => exam.status === 'completed').length;
  const allCompleted = completedCount === exams.length;
  const isExpired = nowMs >= FINAL_CBSE_2027_EXAM_END_MS;

  return {
    exams,
    activeExam,
    completedCount,
    allCompleted,
    isExpired,
  };
}
