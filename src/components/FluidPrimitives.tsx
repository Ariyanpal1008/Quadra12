import {ReactNode, useEffect, useRef} from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

export const APPLE_EASE = [0.22, 1, 0.36, 1] as const;

export const APPLE_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 32,
  mass: 0.85,
};

export function AnimatedNumber({
  value,
  className = '',
  suffix = '',
}: {
  value: number;
  className?: string;
  suffix?: string;
}) {
  const prefersReduced = useReducedMotion();
  const motionVal = useMotionValue(value);
  const springVal = useSpring(motionVal, {
    stiffness: 120,
    damping: 22,
    mass: 0.7,
  });
  const display = useTransform(springVal, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (prefersReduced) {
      motionVal.jump(value);
    } else {
      motionVal.set(value);
    }
  }, [motionVal, prefersReduced, value]);

  if (prefersReduced) {
    return (
      <span className={className}>
        {Math.round(value)}
        {suffix}
      </span>
    );
  }

  return <motion.span className={className}>{display}</motion.span>;
}

export function ScrollRevealBand({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 92%', 'start 35%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.001,
  });
  const scale = useTransform(smoothProgress, [0, 1], [0.965, 1]);
  const y = useTransform(smoothProgress, [0, 1], [22, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.35, 1], [0.78, 0.94, 1]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{scale, y, opacity}}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
