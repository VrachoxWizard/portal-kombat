export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const springNav = { type: "spring" as const, stiffness: 380, damping: 30 };
export const springCard = { type: "spring" as const, stiffness: 300, damping: 20 };
export const springSnappy = { type: "spring" as const, stiffness: 300, damping: 25 };

export const duration = {
  hover: 0.18,
  entrance: 0.42,
  drawer: 0.35,
} as const;
