import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';

type IntroScreenProps = {
  onComplete: () => void;
  onDecline: () => void;
};

const IntroScreen = ({ onComplete, onDecline }: IntroScreenProps) => {
  const [step, setStep] = useState<'initial' | 'question' | 'loading' | 'complete' | 'declined'>('initial');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Ref to hold timeout IDs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animated gradient values for the background
  const { backgroundPosition } = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 5000 },
    loop: { reverse: true },
  });

  // Particles for background animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    speed: 0.3 + Math.random() * 0.5,
  }));

  // Logo letters animation
  const letters = "Kirthik Ramadoss".split("");

  // Force transition to question step after initial time
  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Initial animation sequence
    if (step === 'initial') {
      // Set a timeout to transition to question step
      timeoutRef.current = setTimeout(() => {
        setStep('question');
      }, 2000);

      // Failsafe: If still on initial after 3s, force transition
      const failsafe = setTimeout(() => {
        if (step === 'initial') {
          setStep('question');
        }
      }, 3000);

      return () => {
        clearTimeout(timeoutRef.current!);
        clearTimeout(failsafe);
      };
    }
  }, [step]);

  // Loading progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (step === 'loading') {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newValue = prev + (1 + Math.random() * 3);
          if (newValue >= 100) {
            if (interval) clearInterval(interval);

            // Launch confetti celebration
            const duration = 3000;
            const end = Date.now() + duration;

            const fireConfetti = () => {
              confetti({
                particleCount: 80,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#5b21b6', '#8b5cf6', '#ec4899', '#3b82f6'],
              });

              confetti({
                particleCount: 80,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#5b21b6', '#8b5cf6', '#ec4899', '#3b82f6'],
              });

              if (Date.now() < end) {
                timeoutRef.current = setTimeout(fireConfetti, 150);
              } else {
                timeoutRef.current = setTimeout(() => setStep('complete'), 500);
              }
            };

            fireConfetti();
            return 100;
          }
          return newValue;
        });
      }, 70);

      // Failsafe: If loading gets stuck, complete it after 15s
      const loadingFailsafe = setTimeout(() => {
        if (step === 'loading' && loadingProgress < 100) {
          setLoadingProgress(100);
          setTimeout(() => setStep('complete'), 1000);
        }
      }, 15000);

      return () => {
        if (interval) clearInterval(interval);
        clearTimeout(loadingFailsafe);
      };
    }
  }, [step]);

  // Complete animation and call the parent complete/decline function
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (step === 'complete') {
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, 1000);
    } else if (step === 'declined') {
      // Increased timeout to give user time to read the content before transitioning
      timeoutRef.current = setTimeout(() => {
        onDecline();
      }, 20000); // Increased from 1500ms to 8000ms (8 seconds)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [step, onComplete, onDecline]);

  // Handle user's choice
  const handleChoice = (choice: 'yes' | 'no') => {
    if (choice === 'yes') {
      setStep('loading');
    } else {
      setStep('declined');
    }
  };

  // Handle when user changes their mind
  const handleChangeDecision = () => {
    // Clear any pending timeouts to prevent automatic exit
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStep('loading');
  };

  // Launch fireworks effect
  const launchFireworks = () => {
    const launchFirework = (originX = 0.5, originY = 0.5) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: originX, y: originY },
        colors: ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#ee82ee'],
      });
    };

    // Launch multiple fireworks in sequence
    launchFirework(0.25, 0.5);
    setTimeout(() => launchFirework(0.75, 0.5), 300);
    setTimeout(() => launchFirework(0.5, 0.5), 600);
  };

  // Handle explicit exit
  const handleExit = () => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Call onDecline immediately
    onDecline();
  };

  return (
    <animated.div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-auto"
      style={{
        background: 'linear-gradient(-45deg, #220b34, #121212, #0a1527, #1a0523)',
        backgroundSize: '400% 400%',
        backgroundPosition,
      }}
    >
      {/* Animated particles in the background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              y: [`${particle.y}%`, `${(particle.y + 100) % 100}%`],
            }}
            transition={{
              duration: 10 / particle.speed,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {step === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <div className="relative flex justify-center mb-6">
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.1 + index * 0.08 },
                    }}
                    className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-gray-300 text-xl"
              >
                <span className="inline-block">
                  Portfolio
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mt-1"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                  />
                </span>
              </motion.div>

              {/* Hidden clickable area to manually progress if animation gets stuck */}
              <motion.button
                className="mt-8 px-8 py-3 rounded-full bg-transparent text-transparent hover:text-gray-400/30 text-xs transition-colors"
                onClick={() => setStep('question')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                tap to continue
              </motion.button>
            </motion.div>
          )}

          {step === 'question' && (
            <motion.div
              key="question"
              className="w-full max-w-lg mx-auto text-center p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Welcome to my Portfolio
                </h2>

                <p className="text-xl text-gray-300 mb-8">
                  Are you ready to explore my creative universe?
                </p>
              </motion.div>

              <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                <motion.button
                  onClick={() => handleChoice('yes')}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-medium relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                    whileHover={{
                      opacity: 1,
                      backgroundPosition: ['0% 50%', '100% 50%'],
                    }}
                    transition={{ duration: 0.8 }}
                  />
                  <span className="relative z-10">Yes, Let's Go!</span>
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                    whileHover={{
                      boxShadow: '0 0 0 4px rgba(236, 72, 153, 0.4)',
                    }}
                  />
                </motion.button>

                <motion.button
                  onClick={() => handleChoice('no')}
                  className="px-8 py-3 rounded-full border-2 border-gray-400 text-gray-300 text-lg font-medium transition-colors relative overflow-hidden group"
                  whileHover={{
                    scale: 1.05,
                    borderColor: '#ffffff',
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-50"
                    whileHover={{ opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 group-hover:text-white">No, Maybe Later</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              className="w-full max-w-lg mx-auto text-center px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Loading content remains the same */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.1, 1] }}
                transition={{
                  duration: 1.2,
                  times: [0, 0.7, 1],
                  ease: 'easeInOut',
                }}
              >
                <div className="w-28 h-28 mx-auto mb-4">
                  {/* Animated logo spinner */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={252}
                      initial={{ strokeDashoffset: 252 }}
                      animate={{ strokeDashoffset: 0, rotate: 360 }}
                      transition={{
                        strokeDashoffset: { duration: 2, ease: 'easeInOut' },
                        rotate: { duration: 2, ease: 'linear', repeat: Infinity },
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>

              <motion.h2
                className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Preparing an immersive experience...
              </motion.h2>

              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ type: 'spring', stiffness: 20 }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-20 bg-white opacity-20 blur-sm"
                  animate={{
                    left: ['-10%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              <motion.p
                className="text-gray-400"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {loadingProgress < 100 ? `${Math.round(loadingProgress)}%` : 'Launching...'}
              </motion.p>

              <motion.div
                className="mt-8 space-y-3 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: loadingProgress > 30 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {loadingProgress > 30 && (
                  <motion.div
                    className="flex items-center space-x-3 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">Loading creative assets</span>
                  </motion.div>
                )}

                {loadingProgress > 60 && (
                  <motion.div
                    className="flex items-center space-x-3 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">Initializing animations</span>
                  </motion.div>
                )}

                {loadingProgress > 85 && (
                  <motion.div
                    className="flex items-center space-x-3 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">Preparing your experience</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {step === 'declined' && (
            <motion.div
              key="declined"
              className="w-full max-w-lg mx-auto text-center p-8 bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
                transition={{
                  scale: { type: 'spring', stiffness: 200, damping: 10 },
                  rotate: { duration: 1.5, delay: 0.3 },
                }}
                className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center"
              >
                <motion.svg
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-400"
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: [0, 5, -5, 5, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{ duration: 2, delay: 0.2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-purple-300 to-gray-300"
                  animate={{
                    backgroundPosition: ['0% center', '100% center', '0% center'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  I Understand
                </motion.h2>

                <motion.div
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-300 text-lg">
                    No rush—the creative world will still be here when you return.
                  </p>
                  <p className="text-gray-400 mb-2">
                    My portfolio showcases innovative projects across web development, AI integration, and interactive
                    experiences that might inspire your next endeavor.
                  </p>
                  <motion.div
                    className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto my-6 rounded-full"
                    animate={{
                      scaleX: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <p className="text-purple-300 font-light italic text-sm">
                    "Creativity is intelligence having fun." — Kirthik Ramadoss
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleChangeDecision}
                  className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-medium shadow-lg relative overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(168, 85, 247, 0.5)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white opacity-0"
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span className="relative z-10 flex items-center justify-center">
                    Actually, I'm Curious
                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </motion.span>
                </motion.button>

                <motion.button
                  onClick={handleExit}
                  className="w-full md:w-auto px-6 py-2 rounded-full border border-gray-500 text-gray-400 hover:text-white hover:border-white transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Exit Completely
                </motion.button>
              </motion.div>

              {/* Countdown indicator showing time to auto-exit */}
              <motion.div
                className="mt-6 text-gray-500 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Auto-exit in a few seconds...
                <motion.span
                  className="inline-block ml-1 w-4 h-1"
                  animate={{ width: [16, 0] }}
                  transition={{ duration: 8, ease: 'linear' }}
                  style={{ background: 'linear-gradient(to right, #8b5cf6, transparent)' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </animated.div>
  );
};

export default IntroScreen;
