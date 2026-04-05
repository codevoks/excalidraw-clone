import { publisher, subscriber } from "./client";

export async function publish(channel: string, message: string): Promise<void> {
  await publisher.publish(channel, message);
}

export async function subscribe(
  channel: string,
  onMessage: (message: string, channel: string) => void,
): Promise<void> {
  await subscriber.subscribe(channel, onMessage);
}

export async function unsubscribe(channel: string): Promise<void> {
  await subscriber.unsubscribe(channel);
}
