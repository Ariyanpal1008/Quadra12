import {useEffect, useId, useRef} from 'react';

export type EmbedPlayerMode = 'standard' | 'pure' | 'nocookie';

interface YouTubeSyncPlayerProps {
  videoId: string;
  title: string;
  embedMode?: EmbedPlayerMode;
  onVideoCompleted: (videoId: string) => void;
}

export function YouTubeSyncPlayer({
  videoId,
  title,
  embedMode = 'standard',
  onVideoCompleted,
}: YouTubeSyncPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerDomId = useId();
  const currentVideoIdRef = useRef(videoId);
  const onCompletedRef = useRef(onVideoCompleted);
  const completedSetRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    onCompletedRef.current = onVideoCompleted;
  }, [onVideoCompleted]);

  useEffect(() => {
    currentVideoIdRef.current = videoId;
    completedSetRef.current.delete(videoId);
  }, [videoId]);

  useEffect(() => {
    if (embedMode === 'pure') return;

    const markCurrentCompleted = () => {
      const vid = currentVideoIdRef.current;
      if (!completedSetRef.current.has(vid)) {
        completedSetRef.current.add(vid);
        onCompletedRef.current(vid);
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
  }, [embedMode]);

  const handleIframeLoad = () => {
    if (embedMode === 'pure') return;
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

  let src = `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1&enablejsapi=1`;
  if (embedMode === 'pure') {
    src = `https://www.youtube.com/embed/${videoId}`;
  } else if (embedMode === 'nocookie') {
    src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1&enablejsapi=1`;
  }

  return (
    <iframe
      ref={iframeRef}
      key={`${embedMode}-${videoId}`}
      src={src}
      title={title}
      onLoad={handleIframeLoad}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className="w-full h-full border-0"
    />
  );
}
