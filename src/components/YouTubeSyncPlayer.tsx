import {useEffect, useId, useRef, useState} from 'react';
import {Maximize2} from 'lucide-react';

export type EmbedPlayerMode = 'standard' | 'pure' | 'nocookie';

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      setIsFullscreen(active);

      if (!active) {
        try {
          const orientation = screen.orientation as LockableOrientation | undefined;
          orientation?.unlock?.();
        } catch {
          // Ignore browsers without screen.orientation.unlock()
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      try {
        const orientation = screen.orientation as LockableOrientation | undefined;
        orientation?.unlock?.();
      } catch {
        // Ignore cleanup orientation unlock errors
      }
    };
  }, []);

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

    try {
      if (typeof container.requestFullscreen === 'function') {
        await container.requestFullscreen();
      } else if (typeof container.webkitRequestFullscreen === 'function') {
        await container.webkitRequestFullscreen();
      }
    } catch {
      // Continue silently if fullscreen was declined
    }

    try {
      const orientation = screen.orientation as LockableOrientation | undefined;
      if (orientation && typeof orientation.lock === 'function') {
        await orientation.lock('landscape');
      }
    } catch {
      // Unsupported mobile browsers stay in clean full-screen without throwing
    }
  };

  const src = videoId
    ? buildHackersYouTubeEmbedUrl(videoId, embedMode)
    : buildHackersPlaylistEmbedUrl(playlistId ?? '');

  return (
    <div ref={wrapperRef} className="relative w-full h-full bg-[#161412]">
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
