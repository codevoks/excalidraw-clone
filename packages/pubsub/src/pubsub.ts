import { publisher, subscriber } from "./client";

export async function publish(channel: string, message: string): Promise<void> {
  try {
    await publisher.publish(channel, message);
  } catch (error) {
    console.log("Error publishing " + error);
  }
}

export async function subscribe(
  channel: string,
  onMessage: (message: string, channel: string) => void,
): Promise<void> {
  try {
    await subscriber.subscribe(channel, onMessage);
  } catch (error) {
    console.log("Error subscribing " + error);
  }
}

export async function unsubscribe(channel: string): Promise<void> {
  try {
    await subscriber.unsubscribe(channel);
  } catch (error) {
    console.log("Error unsubscribing " + error);
  }
}
