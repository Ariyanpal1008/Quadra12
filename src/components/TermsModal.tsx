import {useEffect} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ShieldCheck, X} from 'lucide-react';
import {APPLE_SPRING} from './FluidPrimitives';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({isOpen, onClose}: TermsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={onClose}
            className="fixed inset-0 bg-[#1E1B18]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
            initial={{opacity: 0, scale: 0.95, y: 16}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 12}}
            transition={APPLE_SPRING}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between shrink-0 bg-[#F5F2EB] dark:bg-[#24201C]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-[#A64B33]/30 dark:border-[#D4785E]/30 bg-[#F7EBE7] dark:bg-[#2F1D19] text-[#A64B33] dark:text-[#D4785E] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="terms-modal-title"
                    className="text-base sm:text-lg font-bold text-[#1E1B18] dark:text-[#F5F2EB]"
                    style={{fontFamily: 'var(--font-display)'}}
                  >
                    Terms &amp; Conditions (Copyright, Privacy &amp; AI Fair Use)
                  </h2>
                  <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                    Quadra 12 · Class 12 CBSE PCMB Study Workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Terms & Conditions"
                className="p-2 rounded-lg text-[#787066] dark:text-[#9C9387] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#DDD6C7]/30 dark:hover:bg-[#332E28]/50 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
              <div className="p-4 sm:p-5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB]/60 dark:bg-[#24201C]/60 space-y-2">
                <p className="font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                  Official Terms of Use, Privacy Policy &amp; Copyright Notice
                </p>
                <p>
                  Please review our terms of use, fair use guidelines, dual-storage privacy practices, and AI grading disclaimers governing Quadra 12.
                </p>
              </div>

              <ol className="space-y-4 list-decimal pl-5">
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Acceptance &amp; Non-Commercial Use:</strong> Quadra 12 is a free, non-commercial educational study workspace designed for Class 12 CBSE PCMB students. By browsing, practicing, or utilizing this website, you agree to use all study resources, chapter trackers, and 3-hour examination hall simulations strictly for personal academic preparation and not for unauthorized commercial resale, scraping, or redistribution.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Copyright-Safe Original Papers &amp; Intellectual Property:</strong> All Examination Hall practice papers, case-study scenarios, modified numerical values, step-by-step marking schemes, and vector study diagrams are 100% original copyright-safe content created exclusively for Quadra 12. Embedded 12th Hackers YouTube lecture playlists belong to their respective educators and creators; Quadra 12 organizes them strictly for student revision convenience.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Dual Storage Privacy Policy (Text Drafts &amp; Photos):</strong> To protect your privacy and stay within browser storage limits:
                  <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs">
                    <li>Typed text answers are stored locally in browser <code className="font-mono">localStorage</code> under <code className="font-mono">sectionBE_text_draft</code>.</li>
                    <li>Handwritten and diagram answer photos taken via camera or gallery are compressed client-side (max width 1024px, JPEG quality 0.7) and stored strictly in browser <code className="font-mono">IndexedDB</code> under <code className="font-mono">SectionBE_PhotoStorage</code> (never in <code className="font-mono">localStorage</code>).</li>
                    <li>Both draft text and attached photos are wiped completely and automatically from your browser storage immediately after you click <strong>Submit Test</strong>, AI grading succeeds, and the Final Results Screen renders.</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">AI Board Examiner Disclaimer:</strong> Sections B to E subjective evaluation is performed by <code className="font-mono">gemini-3.8-flash</code> acting as an automated practice board examiner. AI feedback, step-by-step scoring, and model answers are provided for study guidance and self-assessment only and do not constitute official CBSE board marks or certified evaluation.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Copyright Claims &amp; Takedown Procedure:</strong> We respect intellectual property rights. If you believe any content or link on Quadra 12 infringes your copyright or if you wish to request a correction, please email <span className="font-mono text-[#1E1B18] dark:text-[#F5F2EB]">ariyanpal090@gmail.com</span> with: (a) identification of the copyrighted work, (b) the exact section on Quadra 12, and (c) your contact details. Valid inquiries are addressed promptly.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Disclaimer of Warranties &amp; Limitation of Liability:</strong> Study schedules, countdown timers, AI-graded subjective scores, and OMR answer keys are provided &ldquo;as is&rdquo; without warranty of uninterrupted uptime or absolute error-free accuracy. Students should always verify official circulars and examination schedules on <span className="font-mono">cbse.gov.in</span>.
                </li>
              </ol>

              <div className="pt-5 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                  Terms &amp; Conditions · Privacy &amp; AI Fair Use Policy
                </span>
                <span className="font-mono text-[#575048] dark:text-[#CBC3B6]">
                  © 2026 Quadra 12 · <span className="font-semibold text-[#A64B33] dark:text-[#D4785E]">Creator: AriYan Pal (Keśava Dāsa)</span>
                </span>
              </div>
            </div>

            {/* Footer action */}
            <div className="px-6 py-3.5 border-t border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 transition-opacity"
              >
                Got it, Close Terms
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
