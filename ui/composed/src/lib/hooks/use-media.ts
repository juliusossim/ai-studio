import type {
  MediaMetadata,
  MediaSource,
  MediaType,
  UseMediaResult,
  VideoControls,
  VideoState,
} from '@org/models';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IMAGE_EXTENSIONS, IMAGE_MIME_TYPES, VIDEO_EXTENSIONS, VIDEO_MIME_TYPES } from '../utils';

export type {
  MediaMetadata,
  MediaSource,
  MediaType,
  UseMediaResult,
  VideoControls,
  VideoState,
} from '@org/models';

// ============================================================================
// Media Type Detection
// ============================================================================

/**
 * Detect media type from MIME type (most reliable)
 */
export function getMediaTypeFromMime(mimeType: string | undefined): MediaType {
  if (!mimeType) return 'unknown';

  const normalized = mimeType.toLowerCase().trim();

  if (IMAGE_MIME_TYPES.has(normalized)) return 'image';
  if (VIDEO_MIME_TYPES.has(normalized)) return 'video';

  // Fallback: check if starts with image/ or video/
  if (normalized.startsWith('image/')) return 'image';
  if (normalized.startsWith('video/')) return 'video';

  return 'unknown';
}

/**
 * Detect media type from file extension (fallback)
 */
export function getMediaTypeFromExtension(url: string): MediaType {
  try {
    // Remove query params and hash
    const cleanUrl = url.split('?')[0].split('#')[0];
    const extension = cleanUrl.split('.').pop()?.toLowerCase();

    if (!extension) return 'unknown';

    if (IMAGE_EXTENSIONS.has(extension)) return 'image';
    if (VIDEO_EXTENSIONS.has(extension)) return 'video';

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Detect media type using MIME type first, then extension as fallback
 */
export function detectMediaType(source: MediaSource): MediaType {
  // Priority 1: MIME type (most reliable)
  const mimeType = getMediaTypeFromMime(source.mimeType);
  if (mimeType !== 'unknown') return mimeType;

  // Priority 2: File extension (fallback)
  const extension = getMediaTypeFromExtension(source.url);
  if (extension !== 'unknown') return extension;

  // Fallback: Unknown
  const urlType = source.url.toLowerCase();
  if (urlType.includes('image')) return 'image';
  if (urlType.includes('video')) return 'video';
  return 'unknown';
}

/**
 * Check if a URL points to a video
 */
export function isVideo(source: MediaSource): boolean {
  return detectMediaType(source) === 'video';
}

/**
 * Check if a URL points to an image
 */
export function isImage(source: MediaSource): boolean {
  return detectMediaType(source) === 'image';
}

// ============================================================================
// useMedia Hook
// ============================================================================

const initialVideoState: VideoState = {
  isPlaying: false,
  isPaused: true,
  isEnded: false,
  isMuted: false,
  isFullscreen: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  playbackRate: 1,
};

const initialMetadata: MediaMetadata = {
  type: 'unknown',
  width: null,
  height: null,
  duration: null,
  aspectRatio: null,
  isLoaded: false,
  isError: false,
  errorMessage: null,
};

/**
 * Hook for handling media (images and videos) with metadata and controls
 *
 * @example
 * ```tsx
 * const { metadata, videoState, controls, videoRef, imageRef } = useMedia({
 *   url: 'https://example.com/video.mp4',
 *   mimeType: 'video/mp4'
 * });
 *
 * if (metadata.type === 'video') {
 *   return <video ref={videoRef} src={source.url} />;
 * }
 * return <img ref={imageRef} src={source.url} />;
 * ```
 */
export function useMedia(source: MediaSource): UseMediaResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [metadata, setMetadata] = useState<MediaMetadata>(() => ({
    ...initialMetadata,
    type: detectMediaType(source),
  }));

  const [videoState, setVideoState] = useState<VideoState | null>(
    metadata.type === 'video' ? initialVideoState : null,
  );

  // Update media type when source changes
  useEffect(() => {
    const type = detectMediaType(source);
    setMetadata({
      ...initialMetadata,
      type,
    });
    setVideoState(type === 'video' ? initialVideoState : null);
  }, [source]);

  // ============================================================================
  // Video Controls
  // ============================================================================

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
    } catch (error) {
      console.error('Failed to play video:', error);
    }
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const toggle = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await play();
    } else {
      pause();
    }
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = Math.max(0.25, Math.min(4, rate));
  }, []);

  const requestFullscreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (
        (video as unknown as { webkitRequestFullscreen?: () => Promise<void> })
          .webkitRequestFullscreen
      ) {
        await (
          video as unknown as { webkitRequestFullscreen: () => Promise<void> }
        ).webkitRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const controls: VideoControls | null =
    metadata.type === 'video'
      ? {
          play,
          pause,
          toggle,
          seek,
          setVolume,
          setMuted,
          setPlaybackRate,
          requestFullscreen,
        }
      : null;

  // ============================================================================
  // Video Event Handlers
  // ============================================================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video || metadata.type !== 'video') return;

    const updateVideoState = () => {
      const buffered =
        video.buffered.length > 0
          ? (video.buffered.end(video.buffered.length - 1) / video.duration) * 100
          : 0;

      setVideoState({
        isPlaying: !video.paused && !video.ended,
        isPaused: video.paused,
        isEnded: video.ended,
        isMuted: video.muted,
        isFullscreen: document.fullscreenElement === video,
        currentTime: video.currentTime,
        duration: video.duration || 0,
        buffered,
        volume: video.volume,
        playbackRate: video.playbackRate,
      });
    };

    const handleLoadedMetadata = () => {
      setMetadata((prev) => ({
        ...prev,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        aspectRatio: video.videoWidth / video.videoHeight,
        isLoaded: true,
        isError: false,
        errorMessage: null,
      }));
      updateVideoState();
    };

    const handleError = () => {
      const error = video.error;
      setMetadata((prev) => ({
        ...prev,
        isLoaded: false,
        isError: true,
        errorMessage: error?.message || 'Failed to load video',
      }));
    };

    const handleFullscreenChange = () => {
      setVideoState((prev) =>
        prev
          ? {
              ...prev,
              isFullscreen: document.fullscreenElement === video,
            }
          : null,
      );
    };

    // Subscribe to video events
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', updateVideoState);
    video.addEventListener('pause', updateVideoState);
    video.addEventListener('ended', updateVideoState);
    video.addEventListener('timeupdate', updateVideoState);
    video.addEventListener('volumechange', updateVideoState);
    video.addEventListener('ratechange', updateVideoState);
    video.addEventListener('progress', updateVideoState);
    video.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', updateVideoState);
      video.removeEventListener('pause', updateVideoState);
      video.removeEventListener('ended', updateVideoState);
      video.removeEventListener('timeupdate', updateVideoState);
      video.removeEventListener('volumechange', updateVideoState);
      video.removeEventListener('ratechange', updateVideoState);
      video.removeEventListener('progress', updateVideoState);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [metadata.type]);

  // ============================================================================
  // Image Event Handlers
  // ============================================================================

  useEffect(() => {
    const image = imageRef.current;
    if (!image || metadata.type !== 'image') return;

    const handleLoad = () => {
      setMetadata((prev) => ({
        ...prev,
        width: image.naturalWidth,
        height: image.naturalHeight,
        aspectRatio: image.naturalWidth / image.naturalHeight,
        isLoaded: true,
        isError: false,
        errorMessage: null,
      }));
    };

    const handleError = () => {
      setMetadata((prev) => ({
        ...prev,
        isLoaded: false,
        isError: true,
        errorMessage: 'Failed to load image',
      }));
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);

    // If image is already loaded (cached)
    if (image.complete && image.naturalWidth > 0) {
      handleLoad();
    }

    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, [metadata.type]);

  return {
    metadata,
    videoState,
    controls,
    videoRef,
    imageRef,
  };
}

// ============================================================================
// Utility: Format video time (seconds to MM:SS or HH:MM:SS)
// ============================================================================

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
