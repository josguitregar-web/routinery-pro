import { Transition, Variants } from 'framer-motion';

/**
 * Nothing OS "Snappy" Animation Physics
 * High-frequency mechanical springs, crisp easing, and zero sluggishness.
 */

// Mechanical spring transition with high stiffness
export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 32,
  mass: 0.7,
};

// Quick ease for scale and opacity transitions
export const snappyEase: Transition = {
  duration: 0.18,
  ease: [0.16, 1, 0.3, 1],
};

// Micro-interaction tactile feedback
export const tapScale = {
  scale: 0.96,
  transition: { duration: 0.08 },
};

// Modal animation variants
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: snappyEase,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: snappySpring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
};

// Backdrop backdrop-blur transition
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

// List item snappy reveal
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: snappySpring },
  exit: { opacity: 0, y: -6, transition: { duration: 0.1 } },
};

// Metric counter pop
export const statPopVariants: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: snappySpring },
};
