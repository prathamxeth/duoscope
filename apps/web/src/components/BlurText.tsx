'use client';

import React, { useRef, useState, useEffect } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BlurText: React.FC<BlurTextProps> = ({ text, className = '', style = {} }) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em',
        ...style
      }}
    >
      {words.map((word, index) => {
        const delay = index * 100; // 100ms stagger per word
        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              filter: isVisible ? 'blur(0px)' : 'blur(10px)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
              transition: `filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              willChange: 'filter, opacity, transform'
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
