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
                    Terms &amp; Conditions (Copyright &amp; Fair Use)
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
                  Official Terms of Use &amp; Intellectual Property Notice
                </p>
                <p>
                  Please review our terms of use, fair use guidelines, and copyright policies governing Quadra 12.
                </p>
              </div>

              <ol className="space-y-4 list-decimal pl-5">
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Acceptance &amp; Non-Commercial Use:</strong> Quadra 12 is a free, non-commercial educational study workspace designed for Class 12 CBSE PCMB students. By browsing, practicing, or utilizing this website, you agree to use all study resources, chapter trackers, and self-graded exam hall simulations strictly for personal academic preparation and not for unauthorized commercial resale, scraping, or redistribution.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Intellectual Property &amp; Copyright Ownership:</strong> Original Quadra 12 interface design, bespoke SVG study diagrams, syllabus tracking algorithms, countdown clock implementation, and milestone achievement seals remain the exclusive intellectual property of Quadra 12. All third-party educational materials—including official CBSE Sample Question Paper PDFs (© Central Board of Secondary Education) and embedded 12th Hackers YouTube lecture playlists (© respective educators and channels)—remain the sole copyright and property of their respective owners.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">No Official Affiliation:</strong> Quadra 12 is an independent student study utility and is not officially affiliated with, endorsed by, or sponsored by the Central Board of Secondary Education (CBSE) or any external media channel. External links and official YouTube iframe embeds are provided strictly for student convenience and educational reference.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Copyright Claims &amp; Takedown Procedure:</strong> We respect the intellectual property rights of all authors, educational boards, and creators. If you are a copyright owner or authorized agent and believe that any linked PDF, embedded video, diagram, or text on Quadra 12 infringes your copyright or if you wish to request a specific attribution update or removal, please email <span className="font-mono text-[#1E1B18] dark:text-[#F5F2EB]">ariyanpal090@gmail.com</span> with: (a) identification of the copyrighted work, (b) the exact location/section on Quadra 12, and (c) your contact and authorization details. Verified notices are honored promptly.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">User Submissions &amp; Suggestions:</strong> Feedback, feature requests, bug reports, or corrections submitted through the Suggestion Box may be used to improve Quadra 12 without royalty or obligation, and inappropriate submissions are subject to administrative removal.
                </li>
                <li>
                  <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Disclaimer of Warranties &amp; Limitation of Liability:</strong> Study schedules, countdown timers, self-graded OMR answer keys, and syllabus summaries are provided &ldquo;as is&rdquo; without warranty of uninterrupted uptime or absolute error-free accuracy. Quadra 12 is not liable for cleared browser storage, third-party embed availability, or official exam schedule changes; students should always verify official examination announcements on <span className="font-mono">cbse.gov.in</span>.
                </li>
              </ol>

              <div className="pt-5 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                  Terms &amp; Conditions · Copyright &amp; Fair Use Policy
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
