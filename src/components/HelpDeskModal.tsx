import {FormEvent, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {User, onAuthStateChanged} from 'firebase/auth';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  HelpCircle,
  Inbox,
  LogIn,
  LogOut,
  Mail,
  MessageSquarePlus,
  PlaySquare,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import {
  CREATOR_ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  handleFirestoreError,
  signInWithGoogle,
  signOutUser,
} from '../firebase';
import {APPLE_SPRING} from './FluidPrimitives';
import {InteractiveTourTab} from './InteractiveTourTab';

export type HelpDeskTab = 'guide' | 'tour' | 'about' | 'suggest' | 'inbox';
export type NavSection = 'overview' | 'subjects' | 'exam' | 'hackers';

interface HelpDeskModalProps {
  isOpen: boolean;
  initialTab: HelpDeskTab;
  onClose: () => void;
  onNavigateSection: (section: NavSection) => void;
}

type RequestCategory = 'addition' | 'change' | 'syllabus_fix' | 'bug_report';
type TargetSection = 'general' | 'overview' | 'subjects' | 'exam' | 'hackers';
type RequestStatus = 'new' | 'planned' | 'added';

interface ChangeRequestItem {
  id: string;
  authorUid: string;
  authorName: string;
  category: RequestCategory;
  targetSection: TargetSection;
  title: string;
  details: string;
  status: RequestStatus;
  creatorNote: string;
  createdAtMs: number;
}

const CATEGORY_LABELS: Record<RequestCategory, string> = {
  addition: 'Add New Feature / Content',
  change: 'Change Existing Design / Flow',
  syllabus_fix: 'Syllabus / Chapter Correction',
  bug_report: 'Report an Issue',
};

const SECTION_LABELS: Record<TargetSection, string> = {
  general: 'Full Website (General)',
  overview: 'Overview Tab',
  subjects: 'Subject Tracker Tab',
  exam: 'Examination Hall Tab',
  hackers: '12th Hackers Tab',
};

const STATUS_STYLES: Record<RequestStatus, {label: string; cls: string}> = {
  new: {
    label: 'Submitted',
    cls: 'bg-[#ECE6D9] dark:bg-[#2A2520] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#3A332C]',
  },
  planned: {
    label: 'Planned',
    cls: 'bg-[#F5E8E2] dark:bg-[#33211B] text-[#A64B33] dark:text-[#E59882] border-[#E0B9AC] dark:border-[#5C3328]',
  },
  added: {
    label: 'Added / Updated',
    cls: 'bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] border-[#B8D0BF] dark:border-[#2F4D39]',
  },
};

const GUIDE_SECTIONS: {
  id: NavSection;
  title: string;
  tagline: string;
  description: string;
  howToUse: string[];
  icon: typeof Compass;
}[] = [
  {
    id: 'overview',
    title: 'Overview',
    tagline: 'Your Class 12 PCMB Master Dashboard',
    description:
      'Shows your combined progress across all 50 chapters (200 total checkpoints across Lecture, Practice, NCERT, and PYQ), plus quick cards for each subject.',
    howToUse: [
      'Check the Overall Syllabus Mastery bar to see how much of Class 12 PCMB is complete.',
      'Click any of the 4 boxes inside Physics, Chemistry, Biology, or Mathematics cards to review subject-level progress.',
      'Use quick links to jump straight into a Subject, Exam Hall paper, or 12th Hackers playlist.',
    ],
    icon: Compass,
  },
  {
    id: 'subjects',
    title: 'Subject Tracker',
    tagline: '50 Chapters × 4 Checkpoints + 4 Study Libraries',
    description:
      'Contains every NCERT Class 12 chapter across Physics (14), Chemistry (10), Biology (13), and Mathematics (13), paired with Study Libraries, curated resources, SVG diagrams, and chapter practice questions.',
    howToUse: [
      'Each chapter has 4 checkpoints (Lecture, Practice, NCERT, PYQ) plus an explicit per-student study status (Not Started, In Progress, Reviewed, Completed).',
      'Use the 4 Subject Banner toggles at the top of a subject to mark an entire stage across all chapters in one click.',
      'Open any chapter Study Library & Diagrams drawer right inside the tracker to study notes, formulas, SVG diagrams, and verified practice questions.',
    ],
    icon: BookOpen,
  },
  {
    id: 'exam',
    title: 'Examination Hall',
    tagline: 'Verified OMR Papers, 720-Q Practice Mode, 2026–27 Archive & Local A4 PDFs',
    description:
      'Attempt 8 published OMR Mock Papers (180+ verified questions per subject in Practice Mode), review 2026–27 SQP Archive papers, enforce human-approved paper governance, and download Practice Sheet & Marking Scheme A4 PDFs locally.',
    howToUse: [
      'Launch a published Competitive (+4/−1) or Board Sprint (+1/0) OMR paper, or switch to Practice Mode (720 verified questions across PCMB) for instant explanations and chapter study-sheet links.',
      'Your answers autosave per Student Profile in localStorage without affecting another profile or legacy v2.6.2 progress.',
      'Even on 0-mark or unanswered attempts, submitting unlocks the full Question Breakdown, Marking Scheme, Practice Sheet snapshot, Study Library deep-links, Diagrams, and both local A4 PDFs.',
      'Inspect Paper Governance & Review Rules inside Exam Hall or switch to the 2026–27 SQP Archive tab for read-only historical CBSE reference papers.',
    ],
    icon: ClipboardCheck,
  },
  {
    id: 'hackers',
    title: '12th Hackers',
    tagline: 'All 50 Official One-Shot Lectures Synced to Tracker',
    description:
      'Browse and watch every chapter lecture from all four 12th Hackers YouTube playlists, auto-synced with the Lecture done box in Subject Tracker.',
    howToUse: [
      'Click Watch Playlist on any subject card to open the full 10–14 lecture playlist queue beside the player.',
      'Or click Watch & Notes on any unit card to inspect High-Yield Board Topics, formulas, and switch chapter videos.',
      'If embedded video stalls in your browser, cycle Player: Standard / Pure Embed / No-Cookie, open Quadra 12 in a full tab, or click Open on YouTube and tap Mark Done & Next when you return.',
    ],
    icon: PlaySquare,
  },
];

function timestampToMs(val: unknown): number {
  if (val instanceof Timestamp) return val.toMillis();
  return Date.now();
}

export function HelpDeskModal({
  isOpen,
  initialTab,
  onClose,
  onNavigateSection,
}: HelpDeskModalProps) {
  const [activeTab, setActiveTab] = useState<HelpDeskTab>(initialTab);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [category, setCategory] = useState<RequestCategory>('addition');
  const [targetSection, setTargetSection] = useState<TargetSection>('general');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [myRequests, setMyRequests] = useState<ChangeRequestItem[]>([]);
  const [allRequests, setAllRequests] = useState<ChangeRequestItem[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isCreatorAdmin = Boolean(
    user?.emailVerified && user.email === CREATOR_ADMIN_EMAIL,
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSubmitMessage(null);
      setAuthError(null);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !user || !user.emailVerified) {
      setMyRequests([]);
      setAllRequests([]);
      return;
    }

    const myQuery = query(
      collection(db, 'changeRequests'),
      where('authorUid', '==', user.uid),
    );
    const unsubMine = onSnapshot(
      myQuery,
      (snap) => {
        const items: ChangeRequestItem[] = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              authorUid: String(data.authorUid || ''),
              authorName: String(data.authorName || 'Student'),
              category: (data.category as RequestCategory) || 'addition',
              targetSection: (data.targetSection as TargetSection) || 'general',
              title: String(data.title || ''),
              details: String(data.details || ''),
              status: (data.status as RequestStatus) || 'new',
              creatorNote: String(data.creatorNote || ''),
              createdAtMs: timestampToMs(data.createdAt),
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setMyRequests(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'changeRequests');
      },
    );

    let unsubAdmin: (() => void) | undefined;
    if (isCreatorAdmin) {
      const adminQuery = query(
        collection(db, 'changeRequests'),
        orderBy('createdAt', 'desc'),
      );
      unsubAdmin = onSnapshot(
        adminQuery,
        (snap) => {
          const items: ChangeRequestItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              authorUid: String(data.authorUid || ''),
              authorName: String(data.authorName || 'Student'),
              category: (data.category as RequestCategory) || 'addition',
              targetSection: (data.targetSection as TargetSection) || 'general',
              title: String(data.title || ''),
              details: String(data.details || ''),
              status: (data.status as RequestStatus) || 'new',
              creatorNote: String(data.creatorNote || ''),
              createdAtMs: timestampToMs(data.createdAt),
            };
          });
          setAllRequests(items);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'changeRequests');
        },
      );
    }

    return () => {
      unsubMine();
      if (unsubAdmin) unsubAdmin();
    };
  }, [isCreatorAdmin, isOpen, user]);

  const handleGoogleSignIn = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Could not complete Google Sign-In. Please allow popups and try again.',
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSubmitRequest = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!user || !user.emailVerified) {
      setSubmitMessage({
        type: 'error',
        text: 'Please sign in with Google first (or use the Email Creator button below) so your suggestion is saved for AriYan Pal (Keśava Dāsa).',
      });
      return;
    }

    const cleanTitle = title.trim().slice(0, 120);
    const cleanDetails = details.trim().slice(0, 1500);
    const cleanAuthorName = (user.displayName || 'Quadra 12 Student')
      .trim()
      .slice(0, 80);

    if (cleanTitle.length < 3) {
      setSubmitMessage({
        type: 'error',
        text: 'Please enter a short summary of at least 3 characters.',
      });
      return;
    }
    if (cleanDetails.length < 5) {
      setSubmitMessage({
        type: 'error',
        text: 'Please describe what should be added or changed (at least 5 characters).',
      });
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'changeRequests'), {
        authorUid: user.uid,
        authorName: cleanAuthorName || 'Quadra 12 Student',
        category,
        targetSection,
        title: cleanTitle,
        details: cleanDetails,
        status: 'new',
        creatorNote: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle('');
      setDetails('');
      setSubmitMessage({
        type: 'success',
        text: 'Suggestion saved! AriYan Pal (Keśava Dāsa) can now review your addition or change request in the Creator Inbox.',
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Could not save to cloud inbox right now. Please check your connection or use Email Creator Directly below.',
      });
      console.error('Failed to save change request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOwnRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'changeRequests', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `changeRequests/${id}`);
    }
  };

  const handleCreatorUpdate = async (
    item: ChangeRequestItem,
    nextStatus: RequestStatus,
  ) => {
    setUpdatingId(item.id);
    const nextNote = (noteDrafts[item.id] ?? item.creatorNote).trim().slice(0, 500);
    try {
      await updateDoc(doc(db, 'changeRequests', item.id), {
        status: nextStatus,
        creatorNote: nextNote,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `changeRequests/${item.id}`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const newInboxCount = allRequests.filter((r) => r.status === 'new').length;
  const mailtoSubject = encodeURIComponent(
    `[Quadra 12 ${CATEGORY_LABELS[category]}] ${title.trim() || 'Suggestion / Change Request'}`,
  );
  const mailtoBody = encodeURIComponent(
    `Section: ${SECTION_LABELS[targetSection]}\nType: ${CATEGORY_LABELS[category]}\n\nSuggestion / Change Details:\n${details.trim() || '(Write your idea here)'}`,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.18}}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161412]/70 dark:bg-black/80 backdrop-blur-xs p-3 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="helpdesk-modal-title"
        >
          <motion.div
            initial={{opacity: 0, y: 20, scale: 0.965}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 12, scale: 0.975}}
            transition={APPLE_SPRING}
            className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div>
                <p className="text-xs font-medium tracking-[0.1em] text-[#A64B33] dark:text-[#D4785E]">
                  Quadra 12 Support · Creator: AriYan Pal (Keśava Dāsa)
                </p>
                <h2
                  id="helpdesk-modal-title"
                  className="mt-0.5 text-lg sm:text-xl font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                >
                  Website Help Desk &amp; Change Requests
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                {user ? (
                  <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] text-xs text-[#575048] dark:text-[#CBC3B6]">
                    <span className="max-w-[96px] sm:max-w-[140px] truncate font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                      {user.displayName || 'Signed In'}
                    </span>
                    <button
                      type="button"
                      onClick={() => void signOutUser()}
                      title="Sign out"
                      className="text-[#A64B33] dark:text-[#D4785E] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Help Desk"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs with Gliding Spring Pill */}
            <div className="px-5 sm:px-7 py-2.5 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]/70 flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  activeTab === 'guide'
                    ? 'text-[#F5F2EB] dark:text-[#1E1B18] border-transparent'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                }`}
              >
                {activeTab === 'guide' && (
                  <motion.span
                    layoutId="helpdesk-active-tab"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB]"
                  />
                )}
                <HelpCircle className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
                <span className="relative z-10">Help Desk</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tour')}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'tour'
                    ? 'text-[#F5F2EB] dark:text-[#1E1B18] border-transparent'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                }`}
              >
                {activeTab === 'tour' && (
                  <motion.span
                    layoutId="helpdesk-active-tab"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB]"
                  />
                )}
                <Compass className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
                <span className="relative z-10">Interactive Tour</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  activeTab === 'about'
                    ? 'text-[#F5F2EB] dark:text-[#1E1B18] border-transparent'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                }`}
              >
                {activeTab === 'about' && (
                  <motion.span
                    layoutId="helpdesk-active-tab"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB]"
                  />
                )}
                <ShieldCheck className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
                <span className="relative z-10">Creator &amp; Disclaimers</span>
              </button>



              <button
                type="button"
                onClick={() => setActiveTab('suggest')}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  activeTab === 'suggest'
                    ? 'text-[#F5F2EB] dark:text-[#1E1B18] border-transparent'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]'
                }`}
              >
                {activeTab === 'suggest' && (
                  <motion.span
                    layoutId="helpdesk-active-tab"
                    transition={APPLE_SPRING}
                    className="absolute inset-0 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB]"
                  />
                )}
                <MessageSquarePlus className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
                <span className="relative z-10">Suggest Addition / Change</span>
              </button>

              {isCreatorAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    activeTab === 'inbox'
                      ? 'text-[#F5F2EB] border-transparent'
                      : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#A64B33] dark:text-[#D4785E] border-[#DDD6C7] dark:border-[#332E28]'
                  }`}
                >
                  {activeTab === 'inbox' && (
                    <motion.span
                      layoutId="helpdesk-active-tab"
                      transition={APPLE_SPRING}
                      className="absolute inset-0 rounded-lg bg-[#A64B33]"
                    />
                  )}
                  <Inbox className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
                  <span className="relative z-10">
                    Creator Inbox ({newInboxCount} new · {allRequests.length} total)
                  </span>
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'guide' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F5F2EB] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28]">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        How Quadra 12 Works
                      </h3>
                      <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                        Every tab in the top navigation covers one part of your Class 12 CBSE PCMB preparation. All study checkboxes, exam best scores, and theme settings save automatically in your browser. You can also install Quadra 12 as a free <strong>Offline PWA App</strong> or download the free <strong>Android .apk</strong> in <strong>Settings → About</strong>.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('tour')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] whitespace-nowrap shrink-0"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" aria-hidden="true" />
                        <span>Interactive Tour</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('suggest')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#A64B33] hover:bg-[#8E3E29] text-[#F5F2EB] whitespace-nowrap shrink-0"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Suggest a Change</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {GUIDE_SECTIONS.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <div
                          key={sec.id}
                          className="p-5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C]/70 flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-[#ECE6D9] dark:bg-[#2C2722] flex items-center justify-center text-[#A64B33] dark:text-[#D4785E] shrink-0">
                                  <Icon className="w-4 h-4" aria-hidden="true" />
                                </div>
                                <div>
                                  <h4 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                    {sec.title}
                                  </h4>
                                  <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                                    {sec.tagline}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                              {sec.description}
                            </p>

                            <ul className="space-y-1.5 text-xs text-[#575048] dark:text-[#CBC3B6]">
                              {sec.howToUse.map((tip) => (
                                <li key={tip} className="flex items-start gap-2">
                                  <span
                                    className="text-[#A64B33] dark:text-[#D4785E] font-semibold"
                                    aria-hidden="true"
                                  >
                                    –
                                  </span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onNavigateSection(sec.id);
                              onClose();
                            }}
                            className="self-start px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors"
                          >
                            Open {sec.title} Tab
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'tour' && (
                <InteractiveTourTab
                  onJumpToSection={(section) => {
                    onNavigateSection(section);
                    onClose();
                  }}
                />
              )}

              {activeTab === 'suggest' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Request Form */}
                  <form
                    onSubmit={handleSubmitRequest}
                    className="lg:col-span-7 space-y-4 p-5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C]"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Propose an Addition or Change
                      </h3>
                      <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6]">
                        Anyone visiting Quadra 12 can submit ideas, corrections, or feature requests directly to AriYan Pal (Keśava Dāsa).
                      </p>
                    </div>

                    {!user ? (
                      <div className="p-3.5 rounded-lg bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                          Sign in with Google to save &amp; track your request in the cloud inbox (or write below and use Email Creator).
                        </div>
                        <button
                          type="button"
                          disabled={authBusy}
                          onClick={() => void handleGoogleSignIn()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                        >
                          <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{authBusy ? 'Signing in...' : 'Sign in with Google'}</span>
                        </button>
                      </div>
                    ) : null}

                    {authError && (
                      <p className="text-xs text-[#B43C2E] dark:text-[#F29B8E]">
                        {authError}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="req-category"
                          className="block text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] mb-1.5"
                        >
                          Request Type
                        </label>
                        <select
                          id="req-category"
                          value={category}
                          onChange={(e) =>
                            setCategory(e.target.value as RequestCategory)
                          }
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB]"
                        >
                          {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="req-section"
                          className="block text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] mb-1.5"
                        >
                          Which Tab / Area?
                        </label>
                        <select
                          id="req-section"
                          value={targetSection}
                          onChange={(e) =>
                            setTargetSection(e.target.value as TargetSection)
                          }
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB]"
                        >
                          {Object.entries(SECTION_LABELS).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="req-title"
                        className="block text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] mb-1.5"
                      >
                        Short Title (3–120 characters)
                      </label>
                      <input
                        id="req-title"
                        type="text"
                        maxLength={120}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Add Physics Formula Sheet PDF or Chapter 6 PYQ Notes"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] placeholder:text-[#968E83]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="req-details"
                        className="block text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] mb-1.5"
                      >
                        What should be added or changed?
                      </label>
                      <textarea
                        id="req-details"
                        rows={4}
                        maxLength={1500}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Describe your suggestion clearly so it can be added or updated on Quadra 12..."
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB] placeholder:text-[#968E83]"
                      />
                      <p className="mt-1 text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387] text-right">
                        {details.length} / 1500
                      </p>
                    </div>

                    {submitMessage && (
                      <div
                        className={`px-3.5 py-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                          submitMessage.type === 'success'
                            ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#B8D0BF] dark:border-[#2F4D39] text-[#23422F] dark:text-[#B6DFC3]'
                            : 'bg-[#F5E8E2] dark:bg-[#33211B] border-[#E0B9AC] dark:border-[#5C3328] text-[#9E3724] dark:text-[#F2B5A7]'
                        }`}
                      >
                        {submitMessage.type === 'success' && (
                          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                        )}
                        <span>{submitMessage.text}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={submitting || !user}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-[#A64B33] hover:bg-[#8E3E29] text-[#F5F2EB] disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {submitting ? 'Saving...' : 'Submit Suggestion'}
                        </span>
                      </button>

                      <a
                        href={`mailto:${CREATOR_ADMIN_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
                      >
                        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Email Creator Directly</span>
                      </a>
                    </div>
                  </form>

                  {/* Right: User's Submitted Requests */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Your Submitted Requests
                      </h3>
                      <span className="text-xs font-mono tabular-nums text-[#787066] dark:text-[#9C9387]">
                        {myRequests.length}
                      </span>
                    </div>

                    {!user ? (
                      <div className="p-5 rounded-xl border border-dashed border-[#DDD6C7] dark:border-[#332E28] text-xs text-[#787066] dark:text-[#9C9387] leading-relaxed">
                        Sign in with Google on the left to submit cloud-synced requests and see status updates (<span className="font-medium">Submitted</span>, <span className="font-medium">Planned</span>, <span className="font-medium">Added</span>) from AriYan Pal (Keśava Dāsa).
                      </div>
                    ) : myRequests.length === 0 ? (
                      <div className="p-5 rounded-xl border border-dashed border-[#DDD6C7] dark:border-[#332E28] text-xs text-[#787066] dark:text-[#9C9387]">
                        You haven&rsquo;t submitted any additions or change requests yet.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {myRequests.map((item) => {
                          const st = STATUS_STYLES[item.status];
                          return (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C]/70 space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                  {item.title}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-medium rounded border shrink-0 ${st.cls}`}
                                >
                                  {st.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
                                {CATEGORY_LABELS[item.category]} ·{' '}
                                {SECTION_LABELS[item.targetSection]}
                              </p>
                              <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                                {item.details}
                              </p>
                              {item.creatorNote && (
                                <div className="px-2.5 py-1.5 rounded bg-[#ECE6D9] dark:bg-[#1E1B18] text-[11px] text-[#1E1B18] dark:text-[#F5F2EB]">
                                  <span className="font-semibold text-[#A64B33] dark:text-[#D4785E]">
                                    Creator note:
                                  </span>{' '}
                                  {item.creatorNote}
                                </div>
                              )}
                              {item.status === 'new' && (
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteOwnRequest(item.id)}
                                  className="inline-flex items-center gap-1 text-[11px] text-[#787066] hover:text-[#B43C2E]"
                                >
                                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                                  <span>Withdraw</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'inbox' && isCreatorAdmin && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Creator Inbox — Community Suggestions &amp; Changes
                      </h3>
                      <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                        Signed in as {CREATOR_ADMIN_EMAIL}. Update statuses or reply with a creator note.
                      </p>
                    </div>
                  </div>

                  {allRequests.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-[#DDD6C7] dark:border-[#332E28] text-center text-xs text-[#787066] dark:text-[#9C9387]">
                      No visitor requests have been submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allRequests.map((item) => {
                        const st = STATUS_STYLES[item.status];
                        const draft = noteDrafts[item.id] ?? item.creatorNote;
                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] space-y-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                    {item.title}
                                  </h4>
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-medium rounded border ${st.cls}`}
                                  >
                                    {st.label}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#787066] dark:text-[#9C9387]">
                                  By {item.authorName} · {CATEGORY_LABELS[item.category]} ·{' '}
                                  {SECTION_LABELS[item.targetSection]}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => void handleDeleteOwnRequest(item.id)}
                                className="inline-flex items-center gap-1 text-[11px] text-[#787066] hover:text-[#B43C2E]"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                              {item.details}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
                              <input
                                type="text"
                                maxLength={500}
                                value={draft}
                                onChange={(e) =>
                                  setNoteDrafts((prev) => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                                placeholder="Optional reply note for the student..."
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#1E1B18] dark:text-[#F5F2EB]"
                              />

                              <div className="flex items-center gap-1.5 shrink-0">
                                {(['new', 'planned', 'added'] as RequestStatus[]).map(
                                  (statusOpt) => (
                                    <button
                                      key={statusOpt}
                                      type="button"
                                      disabled={updatingId === item.id}
                                      onClick={() =>
                                        void handleCreatorUpdate(item, statusOpt)
                                      }
                                      className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
                                        item.status === statusOpt
                                          ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] border-[#1E1B18] dark:border-[#F5F2EB]'
                                          : 'bg-[#FAF8F3] dark:bg-[#1E1B18] text-[#575048] dark:text-[#CBC3B6] border-[#DDD6C7] dark:border-[#332E28] hover:border-[#A64B33]'
                                      }`}
                                    >
                                      {statusOpt === 'new'
                                        ? 'Mark New'
                                        : statusOpt === 'planned'
                                          ? 'Mark Planned'
                                          : 'Mark Added'}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  {/* About the Creator */}
                  <div className="p-6 sm:p-7 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ECE6D9] dark:bg-[#2C2722] flex items-center justify-center text-[#A64B33] dark:text-[#D4785E] shrink-0">
                          <UserCheck className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            About the Creator
                          </h3>
                          <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                            AriYan Pal (Keśava Dāsa) · Invented November 2026
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#787066] dark:text-[#9C9387]">
                        © 2026 Quadra 12
                      </span>
                    </div>

                    <div className="space-y-4 text-sm text-[#1E1B18] dark:text-[#F5F2EB] leading-relaxed">
                      <p className="font-medium">
                        I am a Class 12 student currently preparing for board exams.
                      </p>

                      <ul className="space-y-3 text-[#575048] dark:text-[#CBC3B6]">
                        <li className="flex items-start gap-3">
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-[#A64B33] dark:bg-[#D4785E] shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">
                              The Problem:
                            </strong>{' '}
                            Keeping board exam preparation organized and finding one clean, distraction-free study tracker was a real struggle.
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-[#A64B33] dark:bg-[#D4785E] shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">
                              The Solution:
                            </strong>{' '}
                            I built this app to solve that exact problem for myself and other students facing the same challenge.
                          </span>
                        </li>
                      </ul>

                      {/* Upcoming 2027 App Updates */}
                      <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] space-y-2">
                        <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Upcoming 2027 App Updates
                        </h4>
                        <p className="text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                          Quadra 12 is currently dedicated to core CBSE PCMB revision for the 2026–27 board exams. Optional 5th and 6th subjects (English Core, Computer Science, Physical Education, Fine Arts) along with community-requested features from the Suggestion Box will roll out after boards conclude.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimers */}
                  <div className="p-5 sm:p-6 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#24201C]/70 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck
                        className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E] shrink-0"
                        aria-hidden="true"
                      />
                      <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Disclaimers &amp; Credits
                      </h3>
                    </div>

                    <ul className="space-y-3 text-xs sm:text-sm text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#A64B33] dark:text-[#D4785E] font-semibold" aria-hidden="true">–</span>
                        <span>
                          <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Independent Student Initiative:</strong> Quadra 12 is an educational study tracker and self-practice tool. Always verify official CBSE circulars, exam schedules, and syllabus updates on <span className="font-mono">cbse.gov.in</span>.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#A64B33] dark:text-[#D4785E] font-semibold" aria-hidden="true">–</span>
                        <span>
                          <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Independently Authored Practice Material:</strong> All Class 12 PCMB mock papers, questions, and step-by-step marking schemes on Quadra 12 are independently authored, copyright-safe original materials (including bespoke visual SVG diagrams/graphs and unique numerical values) strictly for personal educational self-assessment. 12th Hackers YouTube lecture playlists belong to their respective educators and creators.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#A64B33] dark:text-[#D4785E] font-semibold" aria-hidden="true">–</span>
                        <span>
                          <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Privacy, Offline Storage &amp; Local A4 PDFs:</strong> All OMR attempts, immutable Practice Sheet snapshots, student profiles, and study statuses stay locally on your device (<code className="font-mono">localStorage</code>) unless you explicitly enable optional 6-digit Cloud Sync. Every Practice Sheet PDF and Marking Scheme PDF is generated offline on your device via <code className="font-mono">jsPDF</code> with zero third-party AI calls.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#A64B33] dark:text-[#D4785E] font-semibold" aria-hidden="true">–</span>
                        <span>
                          <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Deterministic OMR &amp; Governance Disclaimer:</strong> Quadra 12 uses deterministic client-side marking schemes authored and human-reviewed before publication. Submitted results never restrict access to Practice Sheets, Marking Schemes, Study Libraries, or PDFs regardless of score.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}


            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
