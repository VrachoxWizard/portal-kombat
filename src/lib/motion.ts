export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const springNav = { type: "spring" as const, stiffness: 380, damping: 30 };
export const springCard = { type: "spring" as const, stiffness: 300, damping: 20 };
export const springSnappy = { type: "spring" as const, stiffness: 300, damping: 25 };

export const duration = {
  hover: 0.18,
  entrance: 0.42,
  drawer: 0.35,
} as const;

export const springBroadcast = { type: "spring" as const, stiffness: 400, damping: 35 };
export const springCountdown = { type: "spring" as const, stiffness: 500, damping: 25 };

export const broadcastTransition = {
  entrance: 0.35,
  wipe: 0.4,
  flash: 0.08,
  statReveal: 0.6,
} as const;
