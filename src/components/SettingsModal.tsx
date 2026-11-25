import {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import jsQR from 'jsqr';
import {
  AlertTriangle,
  Atom,
  Box,
  Calendar,
  Check,
  Cloud,
  CloudDownload,
  CloudUpload,
  Copy,
  Dna,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Info,
  Magnet,
  Moon,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  ScanQrCode,
  Settings,
  Share2,
  ShieldAlert,
  Sigma,
  Smartphone,
  Sun,
  Trash2,
  Trophy,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {APPLE_SPRING} from './FluidPrimitives';
import {
  STORAGE_CUSTOM_BOARD_DATE_KEY,
  SyncableWorkspaceState,
  buildOfflineBackupPayload,
  buildSyncShareUrl,
  formatSyncCodeDisplay,
  generateRandomSixDigitCode,
  generateSyncQrDataUrl,
  getAutoSyncEnabled,
  getLastSyncedIso,
  getOrCreateLocalSyncCode,
  isValidSixDigitCode,
  parseOfflineBackupPayload,
  pullSyncSession,
  pushSyncSession,
  saveLocalSyncCode,
  setAutoSyncEnabled,
} from '../utils/cloudSync';
import {
  playAchievementChime,
  playCheckSound,
  playExamCompletionChime,
  playOmrBubbleSound,
  playThemeSwitchSound,
} from '../utils/soundEffects';
import {SUBJECTS, SubjectId} from '../data/pcmbData';
import {saveBlobToDevice} from '../utils/pdfExporter';
import {ThreeSceneId} from './ThreeLabModal';
import {PWAInstallButton} from './PWAInstallButton';
import {EmbedPlayerMode} from './YouTubeSyncPlayer';
import {
  APP_VERSION,
  GITHUB_RELEASES_PAGE_URL,
  GITHUB_REPO_URL,
  getInstalledAppInfo,
} from '../constants/version';
import {
  ReleaseUpdateInfo,
  UpdateCheckOutcome,
  checkLatestGitHubRelease,
  formatBytes,
  hasNativeApkUpdater,
  openNativeInstallPermissionSettings,
  pollNativeApkDownload,
  startNativeApkDownload,
  triggerNativeApkInstall,
} from '../utils/appUpdater';

export type SettingsTab =
  | 'sync'
  | 'audio'
  | 'studio3d'
  | 'exam'
  | 'player'
  | 'privacy'
  | 'about';

const STORAGE_URGENCY_DAYS_KEY = 'pcmb_desk_urgency_days_v1';
const STORAGE_SHOW_PACE_KEY = 'pcmb_desk_show_pace_v1';
const STORAGE_EMBED_MODE_KEY = 'pcmb_desk_embed_mode_v1';
const STORAGE_AUTO_ADVANCE_KEY = 'pcmb_desk_auto_advance_v1';
const LOCAL_QUOTA_BYTES = 5 * 1024 * 1024; // 5 MB standard browser localStorage quota

interface SettingsModalProps {
  isOpen: boolean;
  initialTab?: SettingsTab;
  initialReleaseInfo?: ReleaseUpdateInfo | null;
  theme: 'light' | 'dark';
  isMuted: boolean;
  workspaceState: SyncableWorkspaceState;
  onClose: () => void;
  onToggleTheme: (nextTheme: 'light' | 'dark') => void;
  onToggleMute: () => void;
  onApplySyncedState: (nextState: SyncableWorkspaceState) => void;
  onResetSubject: (subjectId: SubjectId) => void;
  onResetAllData: () => void;
  onOpenThreeLab: (sceneId: ThreeSceneId) => void;
  onOpenTerms: () => void;
}

function measureLocalStorageQuota(): {
  formattedUsed: string;
  formattedQuota: string;
  percentUsed: number;
} {
  try {
    let totalBytes = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('pcmb_desk_')) {
        const v = window.localStorage.getItem(k) || '';
        totalBytes += (k.length + v.length) * 2;
      }
    }
    const kb = totalBytes / 1024;
    const formattedUsed =
      kb >= 1024
        ? `${(kb / 1024).toFixed(2)} MB`
        : `${Math.max(1, Math.round(kb))} KB`;
    const percentUsed = Math.min(
      100,
      Math.max(0.4, (totalBytes / LOCAL_QUOTA_BYTES) * 100),
    );
    return {
      formattedUsed,
      formattedQuota: '5 MB',
      percentUsed: Number(percentUsed.toFixed(1)),
    };
  } catch {
    return {formattedUsed: '—', formattedQuota: '5 MB', percentUsed: 0};
  }
}

export function SettingsModal({
  isOpen,
  initialTab = 'sync',
  initialReleaseInfo = null,
  theme,
  isMuted,
  workspaceState,
  onClose,
  onToggleTheme,
  onToggleMute,
  onApplySyncedState,
  onResetSubject,
  onResetAllData,
  onOpenThreeLab,
  onOpenTerms,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [syncCode, setSyncCode] = useState<string>(() => getOrCreateLocalSyncCode());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [pairCodeInput, setPairCodeInput] = useState<string>('');
  const [autoSync, setAutoSync] = useState<boolean>(() => getAutoSyncEnabled());
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() =>
    getLastSyncedIso(),
  );
  const [syncStatus, setSyncStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({type: 'idle', message: ''});
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Exam & Urgency preferences
  const [customDateDraft, setCustomDateDraft] = useState<string>(
    workspaceState.customBoardDate || '2027-02-16',
  );
  const [urgencyDays, setUrgencyDays] = useState<number>(() => {
    try {
      const val = Number(window.localStorage.getItem(STORAGE_URGENCY_DAYS_KEY));
      return [15, 30, 60, 90].includes(val) ? val : 30;
    } catch {
      return 30;
    }
  });
  const [showPaceHint, setShowPaceHint] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(STORAGE_SHOW_PACE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  // Player & Video preferences
  const [embedMode, setEmbedMode] = useState<EmbedPlayerMode>(() => {
    try {
      const val = window.localStorage.getItem(STORAGE_EMBED_MODE_KEY);
      if (val === 'standard' || val === 'pure' || val === 'nocookie') return val;
    } catch {
      // Ignore
    }
    return 'standard';
  });
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(STORAGE_AUTO_ADVANCE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  // Data reset & double confirmation popup state
  const [resetSubjectConfirm, setResetSubjectConfirm] = useState<SubjectId | null>(
    null,
  );
  const [masterResetStep, setMasterResetStep] = useState<0 | 1 | 2>(0);
  const [masterResetAckChecked, setMasterResetAckChecked] = useState(false);

  // Share & App Update check state
  const installedAppInfo = getInstalledAppInfo();
  const [updateCheckState, setUpdateCheckState] = useState<
    | {status: 'idle'}
    | {status: 'checking'}
    | UpdateCheckOutcome
  >(() =>
    initialReleaseInfo
      ? {
          status: initialReleaseInfo.hasUpdate ? 'update-available' : 'up-to-date',
          info: initialReleaseInfo,
        }
      : {status: 'idle'},
  );
  const [apkDownloadState, setApkDownloadState] = useState<{
    phase: 'idle' | 'downloading' | 'downloaded' | 'needs-permission' | 'error';
    progress: number;
    bytesDownloaded: number;
    totalBytes: number;
    downloadId: number | null;
    error?: string;
  }>({
    phase: 'idle',
    progress: 0,
    bytesDownloaded: 0,
    totalBytes: 0,
    downloadId: null,
  });
  const downloadPollTimerRef = useRef<number | null>(null);

  const clearDownloadPollTimer = useCallback(() => {
    if (downloadPollTimerRef.current !== null) {
      window.clearInterval(downloadPollTimerRef.current);
      downloadPollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (initialReleaseInfo) {
      setUpdateCheckState({
        status: initialReleaseInfo.hasUpdate ? 'update-available' : 'up-to-date',
        info: initialReleaseInfo,
      });
    }
  }, [initialReleaseInfo]);

  useEffect(() => {
    return () => {
      clearDownloadPollTimer();
    };
  }, [clearDownloadPollTimer]);

  const handleShareApp = async () => {
    const shareData = {
      title: 'Quadra 12 — Class 12 CBSE PCMB Workspace',
      text: 'Check out Quadra 12: free Class 12 CBSE PCMB syllabus tracker, sample papers, A4 PDFs, and 12th Hackers lectures!',
      url: 'https://ariyanpal1008.github.io/Quadra12/',
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback
      }
    }
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
    window.open(waUrl, '_blank');
  };

  const handleCheckUpdates = async () => {
    playOmrBubbleSound();
    setUpdateCheckState({status: 'checking'});
    const outcome = await checkLatestGitHubRelease();
    setUpdateCheckState(outcome);
    if (outcome.status === 'update-available') {
      playAchievementChime();
    } else if (outcome.status === 'up-to-date') {
      playCheckSound(true);
    }
  };

  const handleDownloadSignedApk = (info: ReleaseUpdateInfo) => {
    if (!info.apkAsset) {
      window.open(info.releasePageUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setApkDownloadState({
        phase: 'error',
        progress: 0,
        bytesDownloaded: 0,
        totalBytes: info.apkAsset.sizeBytes,
        downloadId: null,
        error: 'Internet connection unavailable. Connect to Wi-Fi or mobile data and try again.',
      });
      return;
    }

    playOmrBubbleSound();

    if (hasNativeApkUpdater()) {
      clearDownloadPollTimer();
      const started = startNativeApkDownload(
        info.apkAsset.downloadUrl,
        info.apkAsset.name,
      );
      if (!started.ok) {
        setApkDownloadState({
          phase: 'error',
          progress: 0,
          bytesDownloaded: 0,
          totalBytes: info.apkAsset.sizeBytes,
          downloadId: null,
          error: started.error,
        });
        return;
      }

      const activeId = started.downloadId;
      setApkDownloadState({
        phase: 'downloading',
        progress: 2,
        bytesDownloaded: 0,
        totalBytes: info.apkAsset.sizeBytes,
        downloadId: activeId,
      });

      downloadPollTimerRef.current = window.setInterval(() => {
        const snapshot = pollNativeApkDownload(activeId);
        if (snapshot.status === 'successful') {
          clearDownloadPollTimer();
          playCheckSound(true);
          setApkDownloadState({
            phase: 'downloaded',
            progress: 100,
            bytesDownloaded: snapshot.totalBytes || info.apkAsset!.sizeBytes,
            totalBytes: snapshot.totalBytes || info.apkAsset!.sizeBytes,
            downloadId: activeId,
          });
        } else if (snapshot.status === 'failed') {
          clearDownloadPollTimer();
          setApkDownloadState({
            phase: 'error',
            progress: 0,
            bytesDownloaded: snapshot.bytesDownloaded,
            totalBytes: snapshot.totalBytes || info.apkAsset!.sizeBytes,
            downloadId: null,
            error:
              snapshot.error ||
              'APK download failed. Check your connection and try again.',
          });
        } else {
          setApkDownloadState({
            phase: 'downloading',
            progress: Math.max(2, snapshot.progress),
            bytesDownloaded: snapshot.bytesDownloaded,
            totalBytes: snapshot.totalBytes || info.apkAsset!.sizeBytes,
            downloadId: activeId,
          });
        }
      }, 400);
      return;
    }

    // Browser / PWA fallback: trigger direct download from GitHub Release asset URL
    const anchor = document.createElement('a');
    anchor.href = info.apkAsset.downloadUrl;
    anchor.download = info.apkAsset.name;
    anchor.rel = 'noopener noreferrer';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleInstallDownloadedApk = () => {
    if (!apkDownloadState.downloadId) return;
    playOmrBubbleSound();
    const res = triggerNativeApkInstall(apkDownloadState.downloadId);
    if (res === 'NEEDS_PERMISSION') {
      setApkDownloadState((prev) => ({
        ...prev,
        phase: 'needs-permission',
        error:
          "Allow 'Install unknown apps' for Quadra 12 in Android Settings, then return and tap Install Update.",
      }));
    } else if (typeof res === 'string' && res.startsWith('ERROR:')) {
      setApkDownloadState((prev) => ({
        ...prev,
        phase: 'error',
        error: res.slice(6).trim() || 'Could not launch Android installer.',
      }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scanRafRef = useRef<number | null>(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  const stopQrScanner = useCallback(() => {
    if (scanRafRef.current !== null) {
      window.cancelAnimationFrame(scanRafRef.current);
      scanRafRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScannerOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen || activeTab !== 'sync') {
      stopQrScanner();
      setScannerError(null);
    }
  }, [isOpen, activeTab, stopQrScanner]);

  useEffect(() => {
    return () => {
      stopQrScanner();
    };
  }, [stopQrScanner]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCustomDateDraft(workspaceState.customBoardDate || '2027-02-16');
      setResetSubjectConfirm(null);
      setMasterResetStep(0);
      setMasterResetAckChecked(false);
      setSyncStatus({type: 'idle', message: ''});
      setAutoSync(getAutoSyncEnabled());
      try {
        const storedUrgency = Number(
          window.localStorage.getItem(STORAGE_URGENCY_DAYS_KEY),
        );
        setUrgencyDays(
          [15, 30, 60, 90].includes(storedUrgency) ? storedUrgency : 30,
        );
        setShowPaceHint(
          window.localStorage.getItem(STORAGE_SHOW_PACE_KEY) !== 'false',
        );
        const storedMode = window.localStorage.getItem(STORAGE_EMBED_MODE_KEY);
        if (
          storedMode === 'standard' ||
          storedMode === 'pure' ||
          storedMode === 'nocookie'
        ) {
          setEmbedMode(storedMode);
        } else {
          setEmbedMode('standard');
        }
        setAutoAdvance(
          window.localStorage.getItem(STORAGE_AUTO_ADVANCE_KEY) !== 'false',
        );
      } catch {
        // Ignore
      }
    }
  }, [isOpen, initialTab, workspaceState.customBoardDate]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (scannerOpen) {
          stopQrScanner();
        } else if (masterResetStep > 0) {
          setMasterResetStep(0);
          setMasterResetAckChecked(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, masterResetStep, onClose]);

  useEffect(() => {
    if (!isOpen || !isValidSixDigitCode(syncCode)) return;
    let cancelled = false;
    generateSyncQrDataUrl(syncCode, theme === 'dark')
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, syncCode, theme]);

  const handlePushToCloud = async () => {
    playOmrBubbleSound();
    setSyncStatus({type: 'loading', message: 'Saving study snapshot to cloud...'});
    try {
      const updatedIso = await pushSyncSession(syncCode, workspaceState);
      setLastSyncedAt(updatedIso);
      setSyncStatus({
        type: 'success',
        message: `Synced to Cloud under code ${formatSyncCodeDisplay(syncCode)}.`,
      });
      playCheckSound(true);
    } catch {
      setSyncStatus({
        type: 'error',
        message: 'Could not reach Cloud Sync right now. Check connection and try again.',
      });
    }
  };

  const handlePullFromCode = useCallback(
    async (explicitCode?: string) => {
      const clean = (explicitCode ?? pairCodeInput).replace(/\D/g, '');
      if (!isValidSixDigitCode(clean)) {
        setSyncStatus({
          type: 'error',
          message: 'Please enter a valid 6-digit sync code (e.g. 482917).',
        });
        return;
      }
      playOmrBubbleSound();
      setSyncStatus({type: 'loading', message: `Searching cloud for ${clean}...`});
      try {
        const pulled = await pullSyncSession(clean);
        if (!pulled) {
          setSyncStatus({
            type: 'error',
            message: `No cloud snapshot found for code ${formatSyncCodeDisplay(clean)}. Push from your first device first.`,
          });
          return;
        }
        saveLocalSyncCode(clean);
        setSyncCode(clean);
        setPairCodeInput('');
        setLastSyncedAt(pulled.updatedAtIso);
        onApplySyncedState(pulled.state);
        playAchievementChime();
        setSyncStatus({
          type: 'success',
          message: `Device paired! Loaded study progress from code ${formatSyncCodeDisplay(clean)}.`,
        });
      } catch {
        setSyncStatus({
          type: 'error',
          message: 'Cloud sync fetch failed. Please check internet connection.',
        });
      }
    },
    [onApplySyncedState, pairCodeInput],
  );

  const extractSixDigitCodeFromQr = (rawText: string): string | null => {
    const trimmed = rawText.trim();
    if (isValidSixDigitCode(trimmed)) return trimmed;
    const paramMatch = trimmed.match(/[?&]sync=(\d{6})(?:&|#|$)/i);
    if (paramMatch?.[1]) return paramMatch[1];
    try {
      const url = new URL(trimmed);
      const q = url.searchParams.get('sync')?.trim() || '';
      if (isValidSixDigitCode(q)) return q;
    } catch {
      // Not a URL
    }
    return null;
  };

  const handleOpenQrScanner = async () => {
    playOmrBubbleSound();
    if (scannerOpen) {
      stopQrScanner();
      return;
    }
    setScannerError(null);
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setScannerError(
        'Camera is unavailable on this browser or device. Please type the 6-digit code instead.',
      );
      return;
    }

    if (window.QuadraAndroid?.ensureCameraPermission) {
      const granted = window.QuadraAndroid.ensureCameraPermission();
      if (!granted) {
        setScannerError(
          'Please tap Allow on the Android Camera permission prompt, then tap Scan QR again.',
        );
        return;
      }
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {facingMode: {ideal: 'environment'}},
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      mediaStreamRef.current = stream;
      setScannerOpen(true);

      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play().catch(() => {
          // Autoplay handled silently via playsInline + muted
        });

        let lastSampleTs = 0;
        const scanTick = (ts: number) => {
          if (!mediaStreamRef.current) return;
          if (
            video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA &&
            video.videoWidth > 0 &&
            ts - lastSampleTs > 130
          ) {
            lastSampleTs = ts;
            const canvas = scanCanvasRef.current;
            if (canvas) {
              const w = Math.min(video.videoWidth, 640);
              const h = Math.round((video.videoHeight / video.videoWidth) * w);
              if (canvas.width !== w) canvas.width = w;
              if (canvas.height !== h) canvas.height = h;
              const ctx = canvas.getContext('2d', {willReadFrequently: true});
              if (ctx) {
                ctx.drawImage(video, 0, 0, w, h);
                const imgData = ctx.getImageData(0, 0, w, h);
                const decoded = jsQR(imgData.data, w, h, {
                  inversionAttempts: 'dontInvert',
                });
                if (decoded?.data) {
                  const foundCode = extractSixDigitCodeFromQr(decoded.data);
                  if (foundCode) {
                    stopQrScanner();
                    setPairCodeInput(foundCode);
                    void handlePullFromCode(foundCode);
                    return;
                  }
                }
              }
            }
          }
          scanRafRef.current = window.requestAnimationFrame(scanTick);
        };

        scanRafRef.current = window.requestAnimationFrame(scanTick);
      });
    } catch (err) {
      stopQrScanner();
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setScannerError(
          'Camera permission was declined. Enter the 6-digit code manually or allow camera access when prompted.',
        );
      } else {
        setScannerError(
          'Could not access a camera on this device. Please type the 6-digit code instead.',
        );
      }
    }
  };

  const handleRegenerateCode = () => {
    playThemeSwitchSound(theme === 'dark');
    const next = generateRandomSixDigitCode();
    saveLocalSyncCode(next);
    setSyncCode(next);
    setSyncStatus({
      type: 'idle',
      message: 'New 6-digit code generated. Click Push to Cloud to upload your progress.',
    });
  };

  const handleToggleAutoSync = () => {
    const next = !autoSync;
    playCheckSound(next);
    setAutoSync(next);
    setAutoSyncEnabled(next);
    if (next) {
      void handlePushToCloud();
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(syncCode);
      setCopiedCode(true);
      playOmrBubbleSound();
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(buildSyncShareUrl(syncCode));
      setCopiedUrl(true);
      playOmrBubbleSound();
      setTimeout(() => setCopiedUrl(false), 1800);
    } catch {
      // Ignore
    }
  };

  const handleDownloadBackup = async () => {
    playCheckSound(true);
    const json = buildOfflineBackupPayload(workspaceState);
    const blob = new Blob([json], {type: 'application/json'});
    const filename = `quadra12-backup-${new Date().toISOString().slice(0, 10)}.json`;
    try {
      const res = await saveBlobToDevice(blob, filename, 'application/json');
      setSyncStatus({
        type: 'success',
        message: `Offline backup saved to ${res.savedTo}`,
      });
    } catch (err) {
      setSyncStatus({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Could not save backup file. Allow storage permission and retry.',
      });
    }
  };

  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const parsed = parseOfflineBackupPayload(text);
      if (!parsed) {
        setSyncStatus({
          type: 'error',
          message: 'Invalid Quadra 12 backup file.',
        });
        return;
      }
      onApplySyncedState(parsed);
      playAchievementChime();
      setSyncStatus({
        type: 'success',
        message: 'Offline .json backup restored cleanly!',
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const saveBoardCountdownDate = (val: string | null) => {
    playCheckSound(true);
    try {
      if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        window.localStorage.setItem(STORAGE_CUSTOM_BOARD_DATE_KEY, val);
      } else {
        window.localStorage.removeItem(STORAGE_CUSTOM_BOARD_DATE_KEY);
      }
      window.dispatchEvent(new Event('pcmb-board-date-updated'));
    } catch {
      // Ignore
    }
  };

  const updateUrgencyDays = (days: number) => {
    playOmrBubbleSound();
    setUrgencyDays(days);
    try {
      window.localStorage.setItem(STORAGE_URGENCY_DAYS_KEY, String(days));
      window.dispatchEvent(new Event('pcmb-board-date-updated'));
    } catch {
      // Ignore
    }
  };

  const toggleShowPaceHint = () => {
    const next = !showPaceHint;
    playCheckSound(next);
    setShowPaceHint(next);
    try {
      window.localStorage.setItem(STORAGE_SHOW_PACE_KEY, String(next));
      window.dispatchEvent(new Event('pcmb-board-date-updated'));
    } catch {
      // Ignore
    }
  };

  const updateEmbedMode = (mode: EmbedPlayerMode) => {
    playOmrBubbleSound();
    setEmbedMode(mode);
    try {
      window.localStorage.setItem(STORAGE_EMBED_MODE_KEY, mode);
      window.dispatchEvent(new Event('pcmb-player-prefs-updated'));
    } catch {
      // Ignore
    }
  };

  const toggleAutoAdvancePref = () => {
    const next = !autoAdvance;
    playCheckSound(next);
    setAutoAdvance(next);
    try {
      window.localStorage.setItem(STORAGE_AUTO_ADVANCE_KEY, String(next));
      window.dispatchEvent(new Event('pcmb-player-prefs-updated'));
    } catch {
      // Ignore
    }
  };

  const isDark = theme === 'dark';
  const quotaInfo = measureLocalStorageQuota();

  const categories: {id: SettingsTab; label: string; icon: typeof Cloud}[] = [
    {id: 'sync', label: 'Cloud Sync', icon: Cloud},
    {id: 'audio', label: 'Audio & Tactile', icon: Volume2},
    {id: 'studio3d', label: '3D Studio', icon: Box},
    {id: 'exam', label: 'Exam & Urgency', icon: Calendar},
    {id: 'player', label: 'Player & Video', icon: PlayCircle},
    {id: 'privacy', label: 'Privacy & Reset', icon: ShieldAlert},
    {id: 'about', label: 'About & Links', icon: Info},
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={onClose}
            className="fixed inset-0 bg-[#161412]/75 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Sheet */}
          <motion.div
            initial={{opacity: 0, y: 18, scale: 0.975}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 12, scale: 0.98}}
            transition={APPLE_SPRING}
            className="relative z-10 w-full max-w-[960px] max-h-[90vh] flex flex-col overflow-hidden rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB] shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#ECE6D9] dark:bg-[#2C2722] flex items-center justify-center text-[#A64B33] dark:text-[#D4785E]">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="settings-modal-title"
                      className="text-base sm:text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                    >
                      Settings
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#ECE6D9] dark:bg-[#2C2722] text-[10px] font-mono text-[#787066] dark:text-[#9C9387]">
                      v{installedAppInfo.versionName}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Settings"
                className="p-2 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Horizontal Category Bar */}
            <div className="md:hidden px-4 py-2.5 border-b border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/70 dark:bg-[#1E1B18]/70 flex items-center gap-2 overflow-x-auto shrink-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playOmrBubbleSound();
                      setActiveTab(cat.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] border-[#1E1B18] dark:border-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                        : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Two-Pane Body */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Desktop Left Settings Rail */}
              <aside className="hidden md:flex w-56 shrink-0 flex-col gap-1 p-3 border-r border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/70 dark:bg-[#1E1B18]/70 overflow-y-auto">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const active = activeTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        playOmrBubbleSound();
                        setActiveTab(cat.id);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                        active
                          ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                          : 'text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9]/70 dark:hover:bg-[#24201C]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active
                            ? ''
                            : cat.id === 'privacy'
                              ? 'text-[#B33A2B] dark:text-[#F09986]'
                              : 'text-[#A64B33] dark:text-[#D4785E]'
                        }`}
                      />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </aside>

              {/* Right Content Pane */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
                {/* 1. CLOUD SYNC */}
                {activeTab === 'sync' && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DDD6C7] dark:border-[#332E28]">
                        <div>
                          <p className="text-xs font-mono tracking-wider uppercase text-[#A64B33] dark:text-[#D4785E]">
                            Account-Less Cloud Sync
                          </p>
                          <h3 className="mt-0.5 text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            6-Digit Code &amp; Scannable QR Pairing
                          </h3>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={autoSync}
                          onClick={handleToggleAutoSync}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            autoSync
                              ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] dark:border-[#7AB88F] text-[#23422F] dark:text-[#B6DFC3]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              autoSync ? 'text-[#3D6B4F] dark:text-[#7AB88F]' : ''
                            }`}
                          />
                          <span>Auto-Sync: {autoSync ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        <div className="lg:col-span-7 space-y-4">
                          <div>
                            <label className="text-xs font-medium text-[#787066] dark:text-[#9C9387]">
                              Your 6-Digit Sync Code (Laptop / Desktop)
                            </label>
                            <div className="mt-2 flex flex-wrap items-center gap-2.5">
                              <div className="px-4 py-2.5 rounded-xl bg-[#ECE6D9] dark:bg-[#24201C] border border-[#DDD6C7] dark:border-[#332E28] font-mono text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#1E1B18] dark:text-[#F5F2EB] select-all">
                                {formatSyncCodeDisplay(syncCode)}
                              </div>

                              <button
                                type="button"
                                onClick={handleCopyCode}
                                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33] transition-colors"
                              >
                                {copiedCode ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#3D6B4F]" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Code</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={handleRegenerateCode}
                                title="Generate a fresh 6-digit sync code"
                                className="inline-flex items-center gap-1 px-2.5 py-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs text-[#787066] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={handlePushToCloud}
                              disabled={syncStatus.type === 'loading'}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                            >
                              <CloudUpload className="w-4 h-4" />
                              <span>Push Progress to Cloud</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleCopyShareUrl}
                              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33] transition-colors"
                            >
                              {copiedUrl ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#3D6B4F]" />
                                  <span>Link Copied</span>
                                </>
                              ) : (
                                <>
                                  <Smartphone className="w-3.5 h-3.5" />
                                  <span>Copy Sync Link</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
                            {lastSyncedAt
                              ? `Last synced: ${new Date(lastSyncedAt).toLocaleString()}`
                              : 'Not yet pushed to cloud on this device.'}
                          </p>
                        </div>

                        {/* Scannable QR Code */}
                        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]">
                          {qrDataUrl ? (
                            <div className="p-2.5 rounded-xl bg-white border border-[#DDD6C7] shadow-xs">
                              <img
                                src={qrDataUrl}
                                alt={`QR Code for Quadra 12 sync ${syncCode}`}
                                className="w-36 h-36 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-36 h-36 rounded-xl bg-[#ECE6D9] dark:bg-[#24201C] flex items-center justify-center text-xs text-[#787066]">
                              Generating QR…
                            </div>
                          )}
                          <p className="mt-2.5 text-center text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                            Scan with Mobile Camera
                          </p>
                          <p className="mt-0.5 text-center text-[11px] text-[#787066] dark:text-[#9C9387]">
                            Opens &amp; syncs automatically
                          </p>
                        </div>
                      </div>

                      {syncStatus.message && (
                        <div
                          className={`mt-4 px-3.5 py-2.5 rounded-lg border text-xs ${
                            syncStatus.type === 'error'
                              ? 'bg-[#FDF0ED] dark:bg-[#2D1A17] border-[#D98270] text-[#9E3223] dark:text-[#F29F8F]'
                              : syncStatus.type === 'success'
                                ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] text-[#23422F] dark:text-[#B6DFC3]'
                                : 'bg-[#ECE6D9] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          {syncStatus.message}
                        </div>
                      )}
                    </div>

                    {/* Manual 6-digit Pairing */}
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Pair This Device With a 6-Digit Code
                      </h4>
                      <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                        Enter the 6-digit code from another device (for laptops without a
                        camera) to pull its saved progress here.
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={pairCodeInput}
                            onChange={(e) =>
                              setPairCodeInput(
                                e.target.value.replace(/\D/g, '').slice(0, 6),
                              )
                            }
                            placeholder="Enter 6-digit code"
                            aria-label="Enter 6-digit sync code"
                            className="w-44 sm:w-48 px-3.5 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] font-mono text-sm tracking-[0.18em] text-[#1E1B18] dark:text-[#F5F2EB] focus:outline-2 focus:outline-[#A64B33]"
                          />
                          <button
                            type="button"
                            onClick={() => void handleOpenQrScanner()}
                            aria-label={
                              scannerOpen
                                ? 'Close QR Camera Scanner'
                                : 'Scan QR Code with Camera'
                            }
                            title={
                              scannerOpen
                                ? 'Close QR Camera Scanner'
                                : 'Scan QR Code with Camera'
                            }
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors shrink-0 ${
                              scannerOpen
                                ? 'bg-[#A64B33] border-[#A64B33] text-white'
                                : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:border-[#A64B33] hover:text-[#A64B33] dark:hover:text-[#D4785E]'
                            }`}
                          >
                            <ScanQrCode className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handlePullFromCode()}
                          disabled={syncStatus.type === 'loading'}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A64B33] hover:bg-[#8E3D27] text-[#FAF8F3] text-xs font-medium transition-colors"
                        >
                          <CloudDownload className="w-4 h-4" />
                          <span>Pair &amp; Load Progress</span>
                        </button>
                      </div>

                      {scannerError && (
                        <p className="text-xs text-[#9E3223] dark:text-[#F29F8F] bg-[#FDF0ED] dark:bg-[#2D1A17] border border-[#D98270] rounded-lg px-3 py-2">
                          {scannerError}
                        </p>
                      )}

                      {scannerOpen && (
                        <div className="mt-2 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#161412] p-3 space-y-2.5 max-w-sm">
                          <div className="flex items-center justify-between text-xs text-[#F5F2EB]">
                            <span className="font-medium">
                              Point camera at Quadra 12 QR Code
                            </span>
                            <button
                              type="button"
                              onClick={stopQrScanner}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#24201C] text-[11px] text-[#CBC3B6] hover:text-white"
                            >
                              <X className="w-3 h-3" />
                              <span>Stop</span>
                            </button>
                          </div>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black">
                            <video
                              ref={videoRef}
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                            />
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-6 border-2 border-[#D4785E]/80 rounded-lg"
                            />
                          </div>
                          <canvas ref={scanCanvasRef} className="hidden" />
                        </div>
                      )}
                    </div>

                    {/* Offline File Backup */}
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Offline Backup File (.json)
                        </h4>
                        <p className="mt-0.5 text-xs text-[#787066] dark:text-[#9C9387]">
                          Save or restore a local backup file anytime without internet.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDownloadBackup}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export JSON</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json,application/json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Restore JSON</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AUDIO & TACTILE FEEDBACK */}
                {activeTab === 'audio' && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            Audio &amp; Tactile Feedbacks
                          </h3>
                          <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                            Subtle native Web Audio micro-interactions (40–300ms, zero external files).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onToggleMute}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                            !isMuted
                              ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] text-[#23422F] dark:text-[#B6DFC3]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#787066]'
                          }`}
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="w-4 h-4" />
                              <span>Muted</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span>Enabled</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#332E28]">
                        <p className="text-xs font-medium text-[#575048] dark:text-[#CBC3B6] mb-2.5">
                          Test Tactile Sound Effects:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => playCheckSound(true)}
                            className="px-3 py-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                          >
                            Check Pop
                          </button>
                          <button
                            type="button"
                            onClick={() => playCheckSound(false)}
                            className="px-3 py-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                          >
                            Undo Tick
                          </button>
                          <button
                            type="button"
                            onClick={() => playThemeSwitchSound(!isDark)}
                            className="px-3 py-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                          >
                            Switch Click
                          </button>
                          <button
                            type="button"
                            onClick={() => playOmrBubbleSound()}
                            className="px-3 py-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                          >
                            OMR Bubble Tap
                          </button>
                          <button
                            type="button"
                            onClick={() => playAchievementChime()}
                            className="px-3 py-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                          >
                            Achievement Chime
                          </button>
                          <button
                            type="button"
                            onClick={() => playExamCompletionChime()}
                            className="px-3 py-1.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                          >
                            Exam Bell
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Appearance */}
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Workspace Appearance
                        </h4>
                        <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                          Warm Parchment Light vs Studio Charcoal Dark.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playThemeSwitchSound(false);
                            onToggleTheme('light');
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium ${
                            !isDark
                              ? 'bg-[#1E1B18] border-[#1E1B18] text-[#F5F2EB]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" />
                          <span>Light</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playThemeSwitchSound(true);
                            onToggleTheme('dark');
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium ${
                            isDark
                              ? 'bg-[#F5F2EB] border-[#F5F2EB] text-[#1E1B18]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                          <span>Dark</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 3D STUDIO */}
                {activeTab === 'studio3d' && (
                  <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#A64B33] dark:text-[#D4785E]">
                        Three.js Interactive WebGL Lab
                      </p>
                      <h3 className="mt-0.5 text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                        Interactive 3D NCERT Models &amp; Trophy
                      </h3>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                        Launch studio-lit 3D WebGL assemblies with orbit, zoom, camera presets,
                        and an Explode Model slider.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: 'physics' as ThreeSceneId,
                          title: 'Physics 3D · Galvanometer',
                          desc: 'Horseshoe magnet, soft-iron core & copper coil assembly',
                          icon: Magnet,
                        },
                        {
                          id: 'chemistry' as ThreeSceneId,
                          title: 'Chemistry 3D · [ML₆] Complex',
                          desc: 'Octahedral coordination geometry & d-orbital lobes',
                          icon: Atom,
                        },
                        {
                          id: 'biology' as ThreeSceneId,
                          title: 'Biology 3D · DNA Helix',
                          desc: 'Sugar-phosphate backbones & complementary base rungs',
                          icon: Dna,
                        },
                        {
                          id: 'maths' as ThreeSceneId,
                          title: 'Maths 3D · a × b & Double Cone',
                          desc: 'Orthogonal cross product & conic section geometry',
                          icon: Sigma,
                        },
                        {
                          id: 'trophy' as ThreeSceneId,
                          title: 'Grandmaster 3D Trophy',
                          desc: 'Quadra 12 metallic achievement medallion on pedestal',
                          icon: Trophy,
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              playCheckSound(true);
                              onClose();
                              onOpenThreeLab(item.id);
                            }}
                            className="flex items-start gap-3 p-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] hover:border-[#A64B33] dark:hover:border-[#D4785E] text-left transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#ECE6D9] dark:bg-[#2C2722] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                                {item.title}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[#787066] dark:text-[#9C9387] leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. EXAM COUNTDOWN & URGENCY */}
                {activeTab === 'exam' && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" />
                        <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Board Exam Countdown Target Date
                        </h3>
                      </div>
                      <p className="text-xs text-[#575048] dark:text-[#CBC3B6]">
                        Set a custom pre-board or CBSE exam target date, or restore Official
                        CBSE Feb 16 (10:30 AM IST with annual auto-rollover).
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <input
                          type="date"
                          value={customDateDraft}
                          onChange={(e) => setCustomDateDraft(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] text-xs font-mono text-[#1E1B18] dark:text-[#F5F2EB]"
                        />
                        <button
                          type="button"
                          onClick={() => saveBoardCountdownDate(customDateDraft)}
                          className="px-3.5 py-2 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-medium"
                        >
                          Apply Custom Date
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomDateDraft('2027-02-16');
                            saveBoardCountdownDate(null);
                          }}
                          className="px-3 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium hover:border-[#A64B33]"
                        >
                          Reset to Official Feb 16
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Urgency Alert Window
                        </h4>
                        <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                          Switches the Countdown Clock tiles and dial to crimson alert mode when
                          days remaining drop below this threshold.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[15, 30, 60, 90].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => updateUrgencyDays(d)}
                              className={`px-3.5 py-2 rounded-lg border text-xs font-mono transition-colors ${
                                urgencyDays === d
                                  ? 'bg-[#B33A2B] border-[#B33A2B] text-white'
                                  : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:border-[#A64B33]'
                              }`}
                            >
                              {d} Days Before
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            Show Daily Chapter Pace Summary
                          </p>
                          <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
                            Displays remaining chapter pace beside the live watch dial.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={showPaceHint}
                          onClick={toggleShowPaceHint}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                            showPaceHint
                              ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] text-[#23422F] dark:text-[#B6DFC3]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          {showPaceHint ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. PLAYER & VIDEO PREFERENCE */}
                {activeTab === 'player' && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-4">
                      <div>
                        <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          12th Hackers Default YouTube Player
                        </h3>
                        <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                          Choose which embed engine opens by default across 12th Hackers lecture modals.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: 'standard' as EmbedPlayerMode,
                            title: 'Standard Sync',
                            desc: 'Auto-completes & syncs with Subject Tracker',
                          },
                          {
                            id: 'pure' as EmbedPlayerMode,
                            title: 'Pure Embed',
                            desc: 'Lightweight embed if JS API is blocked',
                          },
                          {
                            id: 'nocookie' as EmbedPlayerMode,
                            title: 'Privacy No-Cookie',
                            desc: 'Streams via youtube-nocookie.com',
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateEmbedMode(opt.id)}
                            className={`p-3.5 rounded-xl border text-left transition-colors ${
                              embedMode === opt.id
                                ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] border-[#1E1B18] dark:border-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]'
                                : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33]'
                            }`}
                          >
                            <p className="text-xs font-semibold">{opt.title}</p>
                            <p
                              className={`mt-1 text-[11px] leading-snug ${
                                embedMode === opt.id
                                  ? 'opacity-80'
                                  : 'text-[#787066] dark:text-[#9C9387]'
                              }`}
                            >
                              {opt.desc}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            Auto-Advance to Next Lecture
                          </p>
                          <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
                            Automatically queue the next one-shot chapter when the current video finishes.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={autoAdvance}
                          onClick={toggleAutoAdvancePref}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                            autoAdvance
                              ? 'bg-[#E8F0EA] dark:bg-[#1C2E22] border-[#3D6B4F] text-[#23422F] dark:text-[#B6DFC3]'
                              : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6]'
                          }`}
                        >
                          {autoAdvance ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. DATA RESET & PRIVACY SETTINGS */}
                {activeTab === 'privacy' && (
                  <div className="space-y-5">
                    {/* Storage Quota Meter */}
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" />
                          <h3 className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            Local Storage Quota Meter
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-md border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-mono text-[#1E1B18] dark:text-[#F5F2EB]">
                          {quotaInfo.formattedUsed} / {quotaInfo.formattedQuota} used (
                          {quotaInfo.percentUsed}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#ECE6D9] dark:bg-[#24201C] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#A64B33] dark:bg-[#D4785E] transition-all duration-300"
                          style={{width: `${Math.max(2, quotaInfo.percentUsed)}%`}}
                        />
                      </div>
                      <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                        All study checklists, scores, lectures, and theme settings live locally
                        in your browser—zero mandatory accounts or third-party tracking.
                      </p>
                    </div>

                    {/* Reset Single Subject */}
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          Reset Single Subject
                        </h4>
                        <p className="text-xs text-[#787066] dark:text-[#9C9387]">
                          Reset only Physics, Chemistry, Biology, or Mathematics without affecting
                          other subjects.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SUBJECTS.map((sub) => {
                          const isConfirming = resetSubjectConfirm === sub.id;
                          return (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412]"
                            >
                              <span className="text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB]">
                                {sub.name} ({sub.code})
                              </span>
                              {isConfirming ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onResetSubject(sub.id);
                                      setResetSubjectConfirm(null);
                                    }}
                                    className="px-2 py-1 rounded bg-[#B33A2B] text-white text-[11px] font-medium"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setResetSubjectConfirm(null)}
                                    className="px-2 py-1 rounded border border-[#DDD6C7] dark:border-[#332E28] text-[11px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    playOmrBubbleSound();
                                    setResetSubjectConfirm(sub.id);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#DDD6C7] dark:border-[#332E28] text-[11px] text-[#787066] hover:text-[#B33A2B] hover:border-[#B33A2B] transition-colors"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Reset Only</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Master Reset (Danger Zone) */}
                    <div className="rounded-xl border border-[#D98270]/70 bg-[#FDF0ED]/70 dark:bg-[#2D1A17]/65 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-wider text-[#B33A2B] dark:text-[#F29F8F]">
                          Master Reset (Danger Zone)
                        </p>
                        <h4 className="mt-0.5 text-sm font-semibold text-[#9E3223] dark:text-[#F29F8F]">
                          Clear All Local Progress
                        </h4>
                        <p className="text-xs text-[#7A3528] dark:text-[#D99B8E]">
                          Erases all chapters, checkpoints, watched lectures, sample paper scores,
                          and badges with double confirmation so nothing is lost by accident.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playOmrBubbleSound();
                          setMasterResetAckChecked(false);
                          setMasterResetStep(1);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#D98270] text-[#9E3223] dark:text-[#F29F8F] bg-[#FAF8F3] dark:bg-[#1E1B18] text-xs font-semibold shrink-0 hover:bg-[#B33A2B] hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All Progress</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. ABOUT & LINKS */}
                {activeTab === 'about' && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-[11px] font-mono font-semibold">
                              Version {installedAppInfo.versionName}
                            </span>
                            {installedAppInfo.versionCode !== null && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECE6D9] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] text-[10px] font-mono">
                                Android Build #{installedAppInfo.versionCode}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            Quadra 12 — Class 12 CBSE PCMB Workspace
                          </h3>
                          <p className="mt-1 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                            © 2026 Quadra 12 · Creator:{' '}
                            <strong className="text-[#A64B33] dark:text-[#D4785E]">
                              Ariyan Pal (Keśava Dāsa)
                            </strong>{' '}
                            · <span className="font-mono">ariyanpal090@gmail.com</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#DDD6C7] dark:border-[#332E28] flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            playOmrBubbleSound();
                            onClose();
                            onOpenTerms();
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#486581]/50 bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-mono font-medium text-[#486581] dark:text-[#829AB1] hover:border-[#486581] transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Terms &amp; Conditions · 2026</span>
                        </button>

                        <a
                          href={GITHUB_REPO_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={`${import.meta.env.BASE_URL}assets/aistudio/Octicons-mark-github_12794390.svg`}
                            alt="GitHub"
                            className="w-4 h-4 invert dark:invert-0 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span>Official GitHub Repository</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>
                      </div>
                    </div>

                    {/* Install App (PWA) & In-App Signed Android APK Updater */}
                    <div className="rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                          App Updates &amp; Install (Offline PWA + Signed Android APK)
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] text-[10px] font-mono font-semibold">
                          100% Free ($0)
                        </span>
                      </div>
                      <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                        Install Quadra 12 straight onto your Home Screen (Android, iPhone/iPad, Windows, Mac) or check GitHub Releases for the permanently signed Android <code className="font-mono">.apk</code> release.
                      </p>

                      {/* Version Comparison Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] px-3 py-2 flex items-center justify-between">
                          <span className="text-[#787066] dark:text-[#9C9387]">Installed Version</span>
                          <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            v{installedAppInfo.versionName}
                            {installedAppInfo.versionCode !== null
                              ? ` (#${installedAppInfo.versionCode})`
                              : ` (${APP_VERSION})`}
                          </span>
                        </div>
                        <div className="rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#161412] px-3 py-2 flex items-center justify-between">
                          <span className="text-[#787066] dark:text-[#9C9387]">Latest GitHub Release</span>
                          <span className="font-mono font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">
                            {updateCheckState.status === 'checking'
                              ? 'Checking…'
                              : updateCheckState.status === 'update-available' ||
                                  updateCheckState.status === 'up-to-date'
                                ? `v${updateCheckState.info.latestVersion}`
                                : 'Tap Check Below'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <PWAInstallButton variant="card" />
                        <button
                          type="button"
                          onClick={() => void handleShareApp()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E]" />
                          <span>Share with Classmates</span>
                        </button>
                        <button
                          type="button"
                          disabled={updateCheckState.status === 'checking'}
                          onClick={() => void handleCheckUpdates()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 text-[#3D6B4F] dark:text-[#7AB88F] ${
                              updateCheckState.status === 'checking' ? 'animate-spin' : ''
                            }`}
                          />
                          <span>
                            {updateCheckState.status === 'checking'
                              ? 'Checking GitHub Releases…'
                              : 'Check for App Updates'}
                          </span>
                        </button>
                        <a
                          href={`${GITHUB_REPO_URL}/actions/workflows/android-release.yml`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] transition-colors"
                        >
                          <span>GitHub Android Release CI</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                        </a>
                      </div>

                      {/* Update Available Panel */}
                      {updateCheckState.status === 'update-available' && (
                        <div className="p-4 rounded-xl border border-[#3D6B4F] dark:border-[#7AB88F] bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                                Update Available · {updateCheckState.info.tagName}
                              </p>
                              <h5 className="text-sm font-semibold mt-0.5">
                                {updateCheckState.info.releaseTitle}
                              </h5>
                              {updateCheckState.info.publishedAt && (
                                <p className="text-[11px] opacity-80 font-mono mt-0.5">
                                  Published {new Date(updateCheckState.info.publishedAt).toLocaleDateString()}
                                  {updateCheckState.info.apkAsset?.sizeBytes
                                    ? ` · APK Size: ${formatBytes(updateCheckState.info.apkAsset.sizeBytes)}`
                                    : ''}
                                </p>
                              )}
                            </div>
                            <a
                              href={updateCheckState.info.releasePageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono underline underline-offset-2 opacity-90 hover:opacity-100"
                            >
                              <span>Release Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {updateCheckState.info.releaseNotes && (
                            <div className="rounded-lg border border-[#B8D0BF] dark:border-[#2F4D39] bg-[#FAF8F3]/85 dark:bg-[#161412]/70 p-3 text-[#1E1B18] dark:text-[#F5F2EB] text-xs max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                              {updateCheckState.info.releaseNotes}
                            </div>
                          )}

                          {/* Download Progress Bar (Native Android DownloadManager) */}
                          {apkDownloadState.phase === 'downloading' && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span>Downloading signed APK…</span>
                                <span>
                                  {apkDownloadState.progress}%
                                  {apkDownloadState.totalBytes > 0
                                    ? ` (${formatBytes(apkDownloadState.bytesDownloaded)} / ${formatBytes(apkDownloadState.totalBytes)})`
                                    : ''}
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-[#B8D0BF] dark:bg-[#2F4D39] overflow-hidden">
                                <div
                                  className="h-full bg-[#23422F] dark:bg-[#7AB88F] transition-all duration-300"
                                  style={{width: `${apkDownloadState.progress}%`}}
                                />
                              </div>
                            </div>
                          )}

                          {/* Download / Install Error */}
                          {(apkDownloadState.phase === 'error' ||
                            apkDownloadState.phase === 'needs-permission') &&
                            apkDownloadState.error && (
                              <div className="p-2.5 rounded-lg border border-[#D98270] bg-[#FDF0ED] dark:bg-[#2D1A17] text-[#9E3223] dark:text-[#F29F8F] text-xs space-y-2">
                                <p>{apkDownloadState.error}</p>
                                {apkDownloadState.phase === 'needs-permission' && (
                                  <button
                                    type="button"
                                    onClick={openNativeInstallPermissionSettings}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#9E3223] text-white text-xs font-semibold hover:opacity-90"
                                  >
                                    <span>Open Android Install Permission Settings</span>
                                  </button>
                                )}
                              </div>
                            )}

                          <div className="flex flex-wrap items-center gap-2.5">
                            {apkDownloadState.phase === 'downloaded' ||
                            apkDownloadState.phase === 'needs-permission' ? (
                              <button
                                type="button"
                                onClick={handleInstallDownloadedApk}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-semibold hover:opacity-95"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Install Update (System Confirmation)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={apkDownloadState.phase === 'downloading'}
                                onClick={() => handleDownloadSignedApk(updateCheckState.info)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-semibold hover:opacity-95 disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>
                                  {apkDownloadState.phase === 'downloading'
                                    ? 'Downloading Signed APK…'
                                    : updateCheckState.info.apkAsset
                                      ? `Download Signed APK (${formatBytes(updateCheckState.info.apkAsset.sizeBytes)})`
                                      : 'Open GitHub Release'}
                                </span>
                              </button>
                            )}

                            {updateCheckState.info.apkAsset && (
                              <a
                                href={updateCheckState.info.apkAsset.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#3D6B4F]/50 dark:border-[#7AB88F]/50 text-xs font-medium hover:opacity-85"
                              >
                                <span>Direct Browser Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <p className="text-[11px] opacity-90 leading-relaxed">
                            Android security requires granting install permission for unknown apps and tapping confirm on the Android system installer prompt—silent background updates are not permitted on Android.
                          </p>
                        </div>
                      )}

                      {/* Up to Date Panel */}
                      {updateCheckState.status === 'up-to-date' && (
                        <div className="p-3.5 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#ECE6D9] dark:bg-[#24201C] text-[#1E1B18] dark:text-[#F5F2EB] text-xs space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold">
                              You are up to date (Installed v{updateCheckState.info.installed.versionName} · Latest GitHub Release {updateCheckState.info.tagName})
                            </p>
                            <a
                              href={updateCheckState.info.releasePageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#A64B33] dark:text-[#D4785E] hover:underline"
                            >
                              <span>View Release</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          {updateCheckState.info.releaseNotes && (
                            <details className="text-[11px] text-[#575048] dark:text-[#CBC3B6]">
                              <summary className="cursor-pointer font-medium hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]">
                                Show {updateCheckState.info.tagName} Release Notes
                              </summary>
                              <div className="mt-2 rounded border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-2.5 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                                {updateCheckState.info.releaseNotes}
                              </div>
                            </details>
                          )}
                        </div>
                      )}

                      {/* Offline / Error Panel */}
                      {(updateCheckState.status === 'offline' ||
                        updateCheckState.status === 'error') && (
                        <div className="p-3.5 rounded-lg border border-[#D98270] bg-[#FDF0ED] dark:bg-[#2D1A17] text-[#9E3223] dark:text-[#F29F8F] text-xs space-y-2">
                          <p className="font-medium">{updateCheckState.message}</p>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => void handleCheckUpdates()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#9E3223] text-white text-xs font-semibold hover:opacity-90"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Retry Check</span>
                            </button>
                            <a
                              href={GITHUB_RELEASES_PAGE_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs underline underline-offset-2"
                            >
                              <span>Open GitHub Releases</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Double Confirmation Master Reset Pop-up Overlay */}
            <AnimatePresence>
              {masterResetStep > 0 && (
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
                  onClick={() => {
                    setMasterResetStep(0);
                    setMasterResetAckChecked(false);
                  }}
                >
                  <motion.div
                    initial={{opacity: 0, scale: 0.95, y: 8}}
                    animate={{opacity: 1, scale: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.95, y: 8}}
                    transition={APPLE_SPRING}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md rounded-xl border border-[#D98270] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 sm:p-6 shadow-2xl space-y-4"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="master-reset-dialog-title"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FDF0ED] dark:bg-[#2D1A17] text-[#B33A2B] dark:text-[#F29F8F] flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-wider text-[#B33A2B] dark:text-[#F29F8F]">
                          Confirmation {masterResetStep} of 2 · Danger Zone
                        </p>
                        <h3
                          id="master-reset-dialog-title"
                          className="mt-0.5 text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
                        >
                          {masterResetStep === 1
                            ? 'Clear All Local Study Progress?'
                            : 'Final Confirmation — Permanent Erase'}
                        </h3>
                      </div>
                    </div>

                    {masterResetStep === 1 ? (
                      <>
                        <p className="text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed">
                          This will permanently erase all 50 chapters, 4-stage checkpoints,
                          watched lectures, Examination Hall best scores, and Achievement seals
                          saved on this device. (Recommended: Export JSON or Push to Cloud
                          first.)
                        </p>
                        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setMasterResetStep(0)}
                            className="px-3.5 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-xs font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playOmrBubbleSound();
                              setMasterResetStep(2);
                            }}
                            className="px-4 py-2 rounded-lg bg-[#B33A2B] text-white text-xs font-semibold hover:bg-[#992F22]"
                          >
                            Continue to Final Check →
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="flex items-start gap-2.5 p-3 rounded-lg border border-[#D98270]/60 bg-[#FDF0ED]/70 dark:bg-[#2D1A17]/70 text-xs text-[#7A3528] dark:text-[#F29F8F] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={masterResetAckChecked}
                            onChange={(e) => setMasterResetAckChecked(e.target.checked)}
                            className="mt-0.5 accent-[#B33A2B]"
                          />
                          <span>
                            I confirm I want to permanently clear all local Quadra 12 study
                            data on this browser.
                          </span>
                        </label>
                        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMasterResetStep(0);
                              setMasterResetAckChecked(false);
                            }}
                            className="px-3.5 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] text-xs font-medium"
                          >
                            Keep My Data
                          </button>
                          <button
                            type="button"
                            disabled={!masterResetAckChecked}
                            onClick={() => {
                              onResetAllData();
                              setAutoSync(false);
                              setCustomDateDraft('2027-02-16');
                              setUrgencyDays(30);
                              setShowPaceHint(true);
                              setEmbedMode('standard');
                              setAutoAdvance(true);
                              setMasterResetStep(0);
                              setMasterResetAckChecked(false);
                            }}
                            className="px-4 py-2 rounded-lg bg-[#B33A2B] text-white text-xs font-semibold disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#992F22]"
                          >
                            Yes, Erase All Local Data
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
