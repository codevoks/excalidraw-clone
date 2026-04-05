export const QUEUE_NAMES = {
  room: "room",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
