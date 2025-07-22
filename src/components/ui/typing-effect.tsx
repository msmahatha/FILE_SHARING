import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypingEffect({ text, className = '', speed = 50 }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-0.5 h-5 bg-current ml-0.5"
      />
    </div>
  );
}