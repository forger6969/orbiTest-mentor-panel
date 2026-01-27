import { motion } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  texts = [],
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  stepDuration = 0.35,
  interval = 3000,
  loop = true,
}) => {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const text = texts[index] ?? "";
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  // Intersection Observer
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index, threshold, rootMargin]);

  // Переключение текста
  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setTimeout(() => {
      setInView(false);
      setIndex((prev) => {
        if (prev + 1 >= texts.length) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearTimeout(timer);
  }, [index, texts.length, interval, loop]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p
      ref={ref}
      key={index} // 🔑 важно для перезапуска анимации
      className={className}
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {elements.map((segment, i) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        return (
          <motion.span
            key={i}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{
              duration: totalDuration,
              times,
              delay: (i * delay) / 1000,
              ease: easing,
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && i < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
