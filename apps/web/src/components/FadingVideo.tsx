'use client';

import React, { useRef, useState, useEffect } from 'react';

interface FadingVideoProps {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export const FadingVideo: React.FC<FadingVideoProps> = ({
  src,
  className = '',
  style = {}
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const isFadingOutRef = useRef(false);

  const sources = Array.isArray(src) ? src : [src];
  const currentSource = sources[currentIndex % sources.length] || '';

  // Attempt instant playback on mount and source change
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, [currentSource]);

  const handleCanPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
    setOpacity(1);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= 0.35 && !isFadingOutRef.current) {
      isFadingOutRef.current = true;
      setOpacity(0);
    }
  };

  const handleEnded = () => {
    isFadingOutRef.current = false;
    if (sources.length <= 1) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
        setOpacity(1);
      }
    } else {
      setCurrentIndex((prev) => (prev + 1) % sources.length);
    }
  };

  return (
    <video
      ref={videoRef}
      src={currentSource}
      autoPlay
      muted
      playsInline
      loop={sources.length <= 1}
      preload="auto"
      onCanPlay={handleCanPlay}
      onLoadedData={handleCanPlay}
      onLoadedMetadata={handleCanPlay}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      className={className}
      style={{
        ...style,
        opacity,
        pointerEvents: 'none',
        willChange: 'opacity',
        transition: 'opacity 250ms ease-out'
      }}
    />
  );
};
