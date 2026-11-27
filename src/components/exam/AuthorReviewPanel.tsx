import {CheckCircle2, ShieldCheck} from 'lucide-react';
import {
  BLOCKED_GOVERNANCE_SAMPLES,
  QUESTIONS_BY_ID,
  SCHEMES_BY_ID,
  VERIFIED_MAIN_PAPERS,
} from '../../data/verifiedPapers';
import {canPublishExamPaper} from '../../utils/examEvaluator';

export function AuthorReviewPanel() {
  return (
    <div className="bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-5">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#3D6B4F] dark:text-[#7AB88F]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Verified Paper Audit &amp; Marking-Scheme Standards</span>
        </div>
        <h3 className="mt-1 text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
          Published Examination Hall Papers ({VERIFIED_MAIN_PAPERS.length} Verified)
        </h3>
        <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
          All {VERIFIED_MAIN_PAPERS.length} examination papers available below have passed
          reviewer verification with a complete, human-approved Marking Scheme covering every
          question. Incomplete drafts ({BLOCKED_GOVERNANCE_SAMPLES.length} internal validation
          checks) are kept outside the student hall automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {VERIFIED_MAIN_PAPERS.map((paper) => {
          const scheme = paper.markingSchemeId
            ? SCHEMES_BY_ID[paper.markingSchemeId]
            : null;
          const gate = canPublishExamPaper(paper, scheme, QUESTIONS_BY_ID);
          return (
            <div
              key={paper.id}
              className="p-3.5 rounded-lg border border-[#B8D0BF] dark:border-[#2F4D39] bg-[#E8F0EA]/60 dark:bg-[#1C2E22]/50 text-xs space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#23422F] dark:text-[#B6DFC3]">
                  {paper.title}
                </span>
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#3D6B4F] dark:text-[#7AB88F] shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{gate.allowed ? paper.publicationStatus : 'Pending'}</span>
                </span>
              </div>
              <p className="text-[#315940] dark:text-[#8FC4A1] font-mono">
                Marking Scheme: {paper.markingSchemeId} ({scheme?.approvalStatus}) ·{' '}
                {paper.questionIds.length} verified questions · Reviewer: {paper.approval.reviewedBy}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
