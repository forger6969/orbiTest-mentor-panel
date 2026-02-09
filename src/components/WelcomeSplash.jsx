import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const WelcomeSplash = ({ firstName, lastName, onFinish, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState("initial"); // initial -> shrinking -> finished

  useEffect(() => {
    // Держим полноэкранный splash в течение заданного времени
    const splashTimer = setTimeout(() => {
      setAnimationPhase("shrinking");
    }, duration);

    // После анимации скрываем компонент и вызываем callback
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) {
        onFinish();
      }
    }, duration + 2000); // duration + время анимации (2 сек)

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
          animate={{
            backgroundColor:
              animationPhase === "shrinking"
                ? "rgba(0, 0, 0, 0.3)"
                : "rgba(0, 0, 0, 1)",
            backdropFilter:
              animationPhase === "shrinking" ? "blur(24px)" : "blur(0px)",
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5 },
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="text-center px-4"
            initial={{
              scale: 1,
              y: 0,
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={
              animationPhase === "initial"
                ? {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                  }
                : {
                    scale: 0.3,
                    y: -window.innerHeight * 0.4,
                    x: -window.innerWidth * 0.35,
                    opacity: 0.8,
                  }
            }
            transition={{
              duration: animationPhase === "initial" ? 0.8 : 1.8,
              ease:
                animationPhase === "initial"
                  ? "easeOut"
                  : [0.43, 0.13, 0.23, 0.96],
              scale: {
                type: "spring",
                stiffness: 100,
                damping: 15,
              },
            }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight"
              initial={{ letterSpacing: "0.05em" }}
              animate={{
                letterSpacing:
                  animationPhase === "shrinking" ? "0.02em" : "0.05em",
              }}
              transition={{ duration: 1.5 }}
            >
              Xush kelibsiz,
            </motion.h1>
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mt-2 tracking-tight"
              initial={{ letterSpacing: "0.05em" }}
              animate={{
                letterSpacing:
                  animationPhase === "shrinking" ? "0.02em" : "0.05em",
              }}
              transition={{ duration: 1.5 }}
            >
              {firstName} {lastName}!
            </motion.h1>
          </motion.div>

          {/* Декоративные элементы для улучшения визуала */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationPhase === "initial" ? 0.1 : 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
