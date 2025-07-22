import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../lib/theme-store';

const TreeComponent = ({ scale = 1, delay = 0, silhouette = false }) => (
  <div className="relative" style={{ transform: `scale(${scale})` }}>
    {/* Tree trunk with texture */}
    <div className="relative w-8 h-40 mx-auto overflow-hidden">
      <div className={`absolute inset-0 ${silhouette ? 'bg-black/40' : 'bg-gradient-to-br from-[#8B4513] to-[#654321]'}`} />
      {/* Trunk texture */}
      {!silhouette && Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-1.5 bg-[#483225]"
          style={{
            top: `${i * 5}px`,
            transform: `rotate(${Math.random() * 10 - 5}deg)`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>

    {/* Main branches */}
    <div className="absolute top-10 left-1/2 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-24 h-1.5 ${
            silhouette ? 'bg-black/40' : 'bg-gradient-to-r from-[#8B4513] to-[#654321]'
          }`}
          style={{
            transformOrigin: i % 2 === 0 ? "left" : "right",
            left: i % 2 === 0 ? "50%" : "calc(50% - 96px)",
            top: i * 20,
            transform: `rotate(${i % 2 === 0 ? 30 : -30}deg)`,
          }}
          animate={{
            rotate: i % 2 === 0 ? [30, 35, 30] : [-30, -35, -30],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
          }}
        >
          {/* Sub-branches */}
          {Array.from({ length: 2 }).map((_, j) => (
            <motion.div
              key={j}
              className={`absolute w-16 h-1 ${
                silhouette ? 'bg-black/40' : 'bg-gradient-to-r from-[#8B4513] to-[#654321]'
              }`}
              style={{
                right: j === 0 ? 0 : "auto",
                left: j === 1 ? 0 : "auto",
                top: 0,
                transformOrigin: j === 0 ? "right" : "left",
                transform: `rotate(${j === 0 ? 30 : -30}deg)`,
              }}
              animate={{
                rotate: j === 0 ? [30, 35, 30] : [-30, -35, -30],
              }}
              transition={{
                duration: 2 + j,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + 0.5,
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>

    {/* Foliage layers */}
    <motion.div
      className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64"
      animate={{
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + i * 0.2,
          }}
        >
          <div
            className={`
              absolute inset-0
              ${silhouette ? 'bg-black/40' : `
                bg-gradient-to-br
                ${i === 0 ? 'from-[#1a4314] to-[#2d5a27]' : ''}
                ${i === 1 ? 'from-[#2d5a27] to-[#3a6b33]' : ''}
                ${i === 2 ? 'from-[#3a6b33] to-[#4d7c3f]' : ''}
                ${i === 3 ? 'from-[#4d7c3f] to-[#68a357]' : ''}
                ${i === 4 ? 'from-[#68a357] to-[#8bc34a]' : ''}
              `}
            `}
            style={{
              clipPath: `polygon(
                ${50 + Math.random() * 10 - 5}% 0%,
                ${100 - (Math.random() * 10 + 5)}% ${30 + Math.random() * 10}%,
                ${100 - (Math.random() * 10 + 5)}% ${70 + Math.random() * 10}%,
                ${50 + Math.random() * 10 - 5}% 100%,
                ${Math.random() * 10 + 5}% ${70 + Math.random() * 10}%,
                ${Math.random() * 10 + 5}% ${30 + Math.random() * 10}%
              )`,
              transform: `rotate(${i * (360 / 5)}deg) scale(${1 - i * 0.1})`,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export function AnimatedBackground() {
  const { theme } = useThemeStore();

  const renderBackground = () => {
    switch (theme) {
      case 'dark':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#0a192f] via-[#112a4a] to-[#1a365d] animate-gradient">
            {/* Enhanced stars with better visibility */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, transparent 20%, rgba(10, 25, 47, 0.8) 90%)' }}>
              {Array.from({ length: 200 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  initial={{ opacity: 0.1 }}
                  animate={{
                    opacity: [0.1, 0.8, 0.1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
                  }}
                />
              ))}
            </div>
            {/* Moon with enhanced glow */}
            <motion.div
              className="absolute right-10 top-10 w-20 h-20"
              animate={{
                y: [0, 10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.2)]" />
              <div className="absolute inset-0 rounded-full blur-xl bg-white/30" />
            </motion.div>
            {/* Northern lights effect */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-x-0 h-64 bottom-40"
                style={{
                  background: `linear-gradient(180deg, transparent, ${
                    i === 0 ? 'rgba(32, 128, 192, 0.1)' :
                    i === 1 ? 'rgba(64, 192, 128, 0.1)' :
                    'rgba(128, 128, 255, 0.1)'
                  })`,
                  transform: `translateY(${i * 20}px)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        );

      case 'evening':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#FF8C42] via-[#9B4B8C] to-[#392B58] animate-gradient">
            {/* Setting Sun */}
            <motion.div
              className="absolute left-1/2 bottom-40 w-48 h-48 -translate-x-1/2"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#FF512F] to-[#F09819] shadow-[0_0_200px_rgba(255,81,47,0.4)]" />
              {/* Sun rays */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-64 h-2 bg-gradient-to-r from-[#FF512F]/60 to-transparent"
                  style={{
                    transformOrigin: "0% 50%",
                    transform: `rotate(${i * 30}deg)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Evening Clouds */}
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ x: -100 }}
                animate={{
                  x: ['calc(-10% + 100px)', 'calc(110% - 100px)'],
                }}
                transition={{
                  duration: 40 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: -i * 15,
                }}
                style={{
                  top: `${15 + i * 10}%`,
                  filter: 'blur(4px)',
                }}
              >
                <div className="flex gap-6">
                  <div className="w-32 h-16 bg-gradient-to-br from-[#9B4B8C]/40 to-[#392B58]/40 rounded-full" />
                  <div className="w-40 h-20 bg-gradient-to-br from-[#9B4B8C]/40 to-[#392B58]/40 rounded-full" />
                  <div className="w-32 h-16 bg-gradient-to-br from-[#9B4B8C]/40 to-[#392B58]/40 rounded-full" />
                </div>
              </motion.div>
            ))}

            {/* Trees as silhouettes */}
            <div className="absolute bottom-0 w-full">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${5 + i * 15}%`,
                    zIndex: Math.floor(Math.random() * 10),
                  }}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  <TreeComponent
                    scale={0.8 + Math.random() * 0.4}
                    delay={i * 0.2}
                    silhouette={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        );

      default: // Light mode
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#f0f9ff] via-[#e0f7fa] to-[#e1f5fe] animate-gradient">
            {/* Animated Sun */}
            <motion.div
              className="absolute left-1/2 top-20 w-40 h-40"
              animate={{
                y: [0, 15, 0],
                rotate: 360,
              }}
              transition={{
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 200,
                  repeat: Infinity,
                  ease: "linear",
                }
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff8c00] shadow-[0_0_120px_rgba(255,215,0,0.4)]" />
              {/* Sun rays */}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-48 h-1.5 bg-gradient-to-r from-[#ffd700]/70 to-transparent"
                  style={{
                    transformOrigin: "0% 50%",
                    transform: `rotate(${i * 22.5}deg)`,
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>

            {/* Trees */}
            <div className="absolute bottom-0 w-full">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${5 + i * 15}%`,
                    zIndex: Math.floor(Math.random() * 10),
                  }}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  <TreeComponent
                    scale={0.8 + Math.random() * 0.4}
                    delay={i * 0.2}
                  />
                </motion.div>
              ))}
            </div>

            {/* Clouds */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ x: -100 }}
                animate={{
                  x: ['calc(-10% + 100px)', 'calc(110% - 100px)'],
                }}
                transition={{
                  duration: 35 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: -i * 12,
                }}
                style={{
                  top: `${10 + i * 12}%`,
                  filter: 'blur(4px)',
                }}
              >
                <div className="flex gap-6">
                  <div className="w-32 h-16 bg-gradient-to-br from-white to-white/80 rounded-full" />
                  <div className="w-40 h-20 bg-gradient-to-br from-white to-white/80 rounded-full" />
                  <div className="w-32 h-16 bg-gradient-to-br from-white to-white/80 rounded-full" />
                </div>
              </motion.div>
            ))}

            {/* Sparkles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {renderBackground()}
    </div>
  );
}