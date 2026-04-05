import { createClient, type RedisClientType } from "redis";

const url = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const publisher: RedisClientType = createClient({ url });
export const subscriber: RedisClientType = createClient({ url });

export async function connectRedisClients(): Promise<void> {
  await Promise.all([publisher.connect(), subscriber.connect()]);
}
