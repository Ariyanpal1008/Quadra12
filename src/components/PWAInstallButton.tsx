import {useState} from 'react';
import {CheckCircle2, Download, Share, Smartphone, WifiOff, X} from 'lucide-react';
import {useOnlineStatus, usePWAInstall} from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'menu' | 'card';
  onInstallSuccess?: () => void;
}

export function PWAInstallButton({
  variant = 'navbar',
  onInstallSuccess,
}: PWAInstallButtonProps) {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showBrowserGuide, setShowBrowserGuide] = useState(false);

  const handleInstallClick = async () => {
    const accepted = await install();
    if (accepted) {
      onInstallSuccess?.();
    }
  };

  const iosGuideModal = showIOSGuide ? (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-pwa-guide-title"
      onClick={() => setShowIOSGuide(false)}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 sm:p-6 shadow-2xl space-y-4 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3D6B4F]/12 text-[#3D6B4F] dark:text-[#7AB88F] flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="ios-pwa-guide-title"
                className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                Install Quadra 12 App
              </h3>
              <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
                iPhone &amp; iPad Safari · 100% Free
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowIOSGuide(false)}
            aria-label="Close install guide"
            className="p-1.5 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ol className="space-y-2.5 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed list-decimal list-inside">
          <li>
            Tap the <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Share</strong>{' '}
            <Share className="inline w-3.5 h-3.5 text-[#A64B33] dark:text-[#D4785E] mx-0.5" />{' '}
            button in Safari&apos;s toolbar.
          </li>
          <li>
            Scroll down and tap{' '}
            <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Add to Home Screen</strong>.
          </li>
          <li>
            Tap <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Add</strong> to launch
            Quadra 12 full-screen with offline support.
          </li>
        </ol>

        <button
          type="button"
          onClick={() => setShowIOSGuide(false)}
          className="w-full py-2 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  ) : null;

  // Hide navbar/menu install button when already installed as standalone app
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#3D6B4F]/40 bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Running in Installed App Mode</span>
        </div>
      );
    }
    return null;
  }

  if (variant === 'menu') {
    if (!isInstallable && !isIOS) return null;
    return (
      <>
        <button
          type="button"
          onClick={() => {
            if (isInstallable) {
              void handleInstallClick();
            } else {
              setShowIOSGuide(true);
            }
          }}
          className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] border border-[#3D6B4F]/35 hover:opacity-90 flex items-center gap-2"
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Install Quadra 12 App (Free)</span>
        </button>
        {iosGuideModal}
      </>
    );
  }

  if (variant === 'card') {
    if (isInstallable) {
      return (
        <button
          type="button"
          onClick={() => void handleInstallClick()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3D6B4F] hover:bg-[#315940] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Install Quadra 12 App (PWA)</span>
        </button>
      );
    }
    if (isIOS) {
      return (
        <>
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3D6B4F] hover:bg-[#315940] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>Install on iPhone / iPad</span>
          </button>
          {iosGuideModal}
        </>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[11px] font-medium text-[#575048] dark:text-[#CBC3B6]">
        <Smartphone className="w-3.5 h-3.5 text-[#3D6B4F] dark:text-[#7AB88F] shrink-0" />
        <span>
          Open live site in Chrome/Edge → tap <strong>Install App</strong> in address bar
        </span>
      </span>
    );
  }

  const browserGuideModal = showBrowserGuide ? (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="browser-pwa-guide-title"
      onClick={() => setShowBrowserGuide(false)}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3] dark:bg-[#1E1B18] p-5 sm:p-6 shadow-2xl space-y-4 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3D6B4F]/12 text-[#3D6B4F] dark:text-[#7AB88F] flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="browser-pwa-guide-title"
                className="text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB]"
              >
                Install Quadra 12 App
              </h3>
              <p className="text-[11px] text-[#787066] dark:text-[#9C9387]">
                Offline PWA &amp; Android APK · 100% Free
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBrowserGuide(false)}
            aria-label="Close install guide"
            className="p-1.5 rounded-lg text-[#575048] dark:text-[#CBC3B6] hover:bg-[#ECE6D9] dark:hover:bg-[#24201C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ol className="space-y-2.5 text-xs text-[#575048] dark:text-[#CBC3B6] leading-relaxed list-decimal list-inside">
          <li>
            If you are viewing inside an in-app browser, tap{' '}
            <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">⋮ → Open in Chrome</strong> (or Edge).
          </li>
          <li>
            Tap <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Install App</strong> or{' '}
            <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Add to Home screen</strong> in your browser menu.
          </li>
          <li>
            Or open <strong className="text-[#1E1B18] dark:text-[#F5F2EB]">Menu → Settings → About</strong> to download the standalone Android APK (v2.5).
          </li>
        </ol>

        <button
          type="button"
          onClick={() => setShowBrowserGuide(false)}
          className="w-full py-2 rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  ) : null;

  // Default: compact navbar trigger (always intact across mobile/in-app browsers unless already installed)
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void handleInstallClick()}
        title="Install Quadra 12 App (Free Offline PWA)"
        aria-label="Install Quadra 12 App"
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg border border-transparent bg-[#3D6B4F] hover:bg-[#315940] text-white shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D6B4F]"
      >
        <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="Install Quadra 12 on iPhone or iPad"
          aria-label="Install Quadra 12 on iPhone or iPad"
          className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg border border-[#3D6B4F]/40 bg-[#E8F0EA] dark:bg-[#1C2E22] text-[#23422F] dark:text-[#B6DFC3] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Install</span>
        </button>
        {iosGuideModal}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowBrowserGuide(true)}
        title="Install Quadra 12 App (Free Offline PWA)"
        aria-label="Install Quadra 12 App"
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg border border-transparent bg-[#3D6B4F] hover:bg-[#315940] text-white shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D6B4F]"
      >
        <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Install App</span>
      </button>
      {browserGuideModal}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-[#B7791F] bg-[#1E1B18] text-[#F5F2EB] px-3 py-1.5 text-xs font-medium shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#E6B17A] shrink-0" aria-hidden="true" />
      <span>Offline Mode — Cached chapters &amp; tools active</span>
    </div>
  );
}
