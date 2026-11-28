import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {Maximize2, Minimize2} from 'lucide-react';

export type EmbedPlayerMode = 'standard' | 'pure' | 'nocookie';

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenContainer = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape' | 'portrait' | 'any') => Promise<void>;
  unlock?: () => void;
};

export function buildHackersYouTubeEmbedUrl(
  videoId: string,
  embedMode: EmbedPlayerMode = 'standard',
): string {
  if (embedMode === 'pure') {
    return `https://www.youtube.com/embed/${videoId}?fs=0`;
  }
  if (embedMode === 'nocookie') {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1&enablejsapi=1&fs=0`;
  }
  return `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1&enablejsapi=1&fs=0`;
}

export function buildHackersPlaylistEmbedUrl(playlistId: string): string {
  return `https://www.youtube.com/embed/videoseries?list=${playlistId}&fs=0`;
}

interface YouTubeSyncPlayerProps {
  videoId?: string;
  playlistId?: string;
  title: string;
  embedMode?: EmbedPlayerMode;
  onVideoCompleted?: (videoId: string) => void;
}

export function YouTubeSyncPlayer({
  videoId,
  playlistId,
  title,
  embedMode = 'standard',
  onVideoCompleted,
}: YouTubeSyncPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerDomId = useId();
  const currentVideoIdRef = useRef(videoId ?? '');
  const onCompletedRef = useRef(onVideoCompleted);
  const completedSetRef = useRef<Set<string>>(new Set());
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const [stageBounds, setStageBounds] = useState<{width: number; height: number}>({
    width: 0,
    height: 0,
  });

  const isFullscreen = nativeFullscreen || fallbackFullscreen;

  const unlockOrientation = useCallback(() => {
    try {
      const orientation = screen.orientation as LockableOrientation | undefined;
      orientation?.unlock?.();
    } catch {
      // Ignore browsers without screen.orientation.unlock()
    }
  }, []);

  const syncStageDimensions = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = Math.round(rect.width || window.innerWidth);
    const height = Math.round(rect.height || window.innerHeight);
    setStageBounds((prev) =>
      prev.width === width && prev.height === height ? prev : {width, height},
    );
  }, []);

  useEffect(() => {
    onCompletedRef.current = onVideoCompleted;
  }, [onVideoCompleted]);

  useEffect(() => {
    const vid = videoId ?? '';
    currentVideoIdRef.current = vid;
    if (vid) {
      completedSetRef.current.delete(vid);
    }
  }, [videoId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as FullscreenDocument;
      const fsEl = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      const active = Boolean(fsEl && fsEl === wrapperRef.current);
      setNativeFullscreen(active);

      if (!active) {
        setFallbackFullscreen(false);
        unlockOrientation();
      } else {
        window.requestAnimationFrame(syncStageDimensions);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      unlockOrientation();
    };
  }, [syncStageDimensions, unlockOrientation]);

  useEffect(() => {
    if (!isFullscreen) return;

    syncStageDimensions();
    const timer = window.setTimeout(syncStageDimensions, 120);

    const handleViewportChange = () => syncStageDimensions();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      observer = new ResizeObserver(syncStageDimensions);
      observer.observe(wrapperRef.current);
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fallbackFullscreen) {
        setFallbackFullscreen(false);
        unlockOrientation();
      }
    };
    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      window.removeEventListener('keydown', handleEscKey);
      observer?.disconnect();
    };
  }, [fallbackFullscreen, isFullscreen, syncStageDimensions, unlockOrientation]);

  useEffect(() => {
    if (!videoId || embedMode === 'pure') return;

    const markCurrentCompleted = () => {
      const vid = currentVideoIdRef.current;
      if (!vid) return;
      if (!completedSetRef.current.has(vid)) {
        completedSetRef.current.add(vid);
        onCompletedRef.current?.(vid);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (
        typeof event.origin !== 'string' ||
        (!event.origin.includes('youtube.com') &&
          !event.origin.includes('youtube-nocookie.com'))
      ) {
        return;
      }
      if (typeof event.data !== 'string') return;

      try {
        const payload = JSON.parse(event.data) as {
          event?: string;
          info?:
            | number
            | {
                playerState?: number;
                currentTime?: number;
                duration?: number;
              };
        };

        if (payload.event === 'onStateChange' && payload.info === 0) {
          markCurrentCompleted();
          return;
        }

        if (
          payload.event === 'infoDelivery' &&
          payload.info &&
          typeof payload.info === 'object'
        ) {
          const {playerState, currentTime, duration} = payload.info;
          if (playerState === 0) {
            markCurrentCompleted();
            return;
          }
          if (
            typeof currentTime === 'number' &&
            typeof duration === 'number' &&
            duration > 30 &&
            currentTime / duration >= 0.95
          ) {
            markCurrentCompleted();
          }
        }
      } catch {
        // Ignore non-JSON postMessage frames
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [embedMode, videoId]);

  const handleIframeLoad = () => {
    if (!videoId || embedMode === 'pure') return;
    const target = iframeRef.current?.contentWindow;
    if (!target) return;
    try {
      target.postMessage(
        JSON.stringify({event: 'listening', id: playerDomId}),
        '*',
      );
      target.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'addEventListener',
          args: ['onStateChange'],
        }),
        '*',
      );
    } catch {
      // Ignore cross-window postMessage errors
    }
  };

  const handleEnterLandscapeFullscreen = async () => {
    const container = wrapperRef.current as FullscreenContainer | null;
    if (!container) return;

    let enteredNative = false;
    try {
      if (typeof container.requestFullscreen === 'function') {
        await container.requestFullscreen();
        enteredNative = true;
      } else if (typeof container.webkitRequestFullscreen === 'function') {
        await container.webkitRequestFullscreen();
        enteredNative = true;
      }
    } catch {
      enteredNative = false;
    }

    if (!enteredNative) {
      setFallbackFullscreen(true);
    }

    try {
      const orientation = screen.orientation as LockableOrientation | undefined;
      if (orientation && typeof orientation.lock === 'function') {
        await orientation.lock('landscape');
      }
    } catch {
      // If screen.orientation.lock is unsupported or blocked (e.g. Auto-Rotate OFF / iframe),
      // CSS 90-degree landscape rotation below keeps the player horizontal edge-to-edge.
    }

    window.requestAnimationFrame(syncStageDimensions);
    window.setTimeout(syncStageDimensions, 150);
  };

  const handleExitFullscreen = async () => {
    const doc = document as FullscreenDocument;
    try {
      if (doc.fullscreenElement && typeof doc.exitFullscreen === 'function') {
        await doc.exitFullscreen();
      } else if (
        doc.webkitFullscreenElement &&
        typeof doc.webkitExitFullscreen === 'function'
      ) {
        await doc.webkitExitFullscreen();
      }
    } catch {
      // Ignore exit fullscreen failures
    }
    setNativeFullscreen(false);
    setFallbackFullscreen(false);
    unlockOrientation();
  };

  const src = videoId
    ? buildHackersYouTubeEmbedUrl(videoId, embedMode)
    : buildHackersPlaylistEmbedUrl(playlistId ?? '');

  // When full-screen is active but the screen/device stayed in portrait (e.g. Auto-Rotate OFF,
  // nested preview iframe, or iOS), physically rotate the player stage 90deg into true landscape.
  const shouldRotateToLandscape =
    isFullscreen && stageBounds.height > stageBounds.width && stageBounds.width > 0;

  return (
    <div
      ref={wrapperRef}
      className={
        fallbackFullscreen && !nativeFullscreen
          ? 'fixed inset-0 z-[9999] bg-black overflow-hidden'
          : isFullscreen
            ? 'relative w-full h-full bg-black overflow-hidden'
            : 'relative w-full h-full bg-[#161412]'
      }
    >
      <div
        className={shouldRotateToLandscape ? 'bg-black' : 'relative w-full h-full'}
        style={
          shouldRotateToLandscape
            ? {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${stageBounds.height}px`,
                height: `${stageBounds.width}px`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
                transformOrigin: 'center center',
              }
            : undefined
        }
      >
        <iframe
          ref={iframeRef}
          key={`${embedMode}-${videoId ?? playlistId ?? 'playlist'}`}
          src={src}
          title={title}
          onLoad={handleIframeLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
        />

        {isFullscreen && (
          <button
            type="button"
            onClick={() => void handleExitFullscreen()}
            aria-label="Exit Landscape Full Screen"
            className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-lg bg-[#231f1e]/85 text-[#f8f5f0] border border-[#f8f5f0]/20 px-2.5 py-1.5 text-xs font-medium shadow-md backdrop-blur-xs hover:bg-[#231f1e] active:scale-95 transition"
          >
            <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exit</span>
          </button>
        )}
      </div>

      {!isFullscreen && (
        <button
          type="button"
          onClick={() => void handleEnterLandscapeFullscreen()}
          aria-label="Enter Full Screen in Landscape"
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-lg bg-[#231f1e] text-[#f8f5f0] border border-[#f8f5f0]/15 px-3 py-1.5 text-xs font-medium shadow-md hover:opacity-95 active:scale-95 transition"
        >
          <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Full Screen</span>
        </button>
      )}
    </div>
  );
}

