// src/lib/redis.ts
import Redis from 'ioredis';
import { env } from '@/env';

class RedisCache {
  private client: Redis | null = null;
  private isServer: boolean;

  constructor() {
    // Check if we're on the server side
    this.isServer = typeof window === 'undefined';

    if (this.isServer) {
      this.client = new Redis(env.REDIS_URL!, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        // Disable auto clustering to avoid dns module dependency
        enableReadyCheck: false,
        lazyConnect: true,
      });

      this.client.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      this.client.on('connect', () => {
        console.log('Successfully connected to Redis');
      });
    }
  }

  private ensureConnection() {
    if (!this.isServer) {
      throw new Error(
        'Redis operations can only be performed on the server side'
      );
    }
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
  }

  async get(key: string): Promise<unknown> {
    this.ensureConnection();
    const value = await this.client!.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttlInSeconds?: number,
    flag?: 'NX' | 'XX',
    px?: 'PX',
    pxValue?: number
  ): Promise<boolean> {
    this.ensureConnection();
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    if (flag && px && pxValue) {
      const result = await this.client!.set(
        key,
        serializedValue,
        px,
        pxValue
      );
      return result === 'OK';
    }

    if (ttlInSeconds) {
      const result = await this.client!.setex(
        key,
        ttlInSeconds,
        serializedValue
      );
      return result === 'OK';
    }

    const result = await this.client!.set(key, serializedValue);
    return result === 'OK';
  }

  async del(key: string): Promise<void> {
    this.ensureConnection();
    await this.client!.del(key);
  }

  async flushAll(): Promise<void> {
    this.ensureConnection();
    await this.client!.flushall();
  }

  async disconnect(): Promise<void> {
    this.ensureConnection();
    await this.client!.quit();
  }
}

// Create and export singleton instance
let cacheInstance: RedisCache | null = null;

export function getRedisCache(): RedisCache {
  if (!cacheInstance) {
    cacheInstance = new RedisCache();
  }
  return cacheInstance;
}

// For backward compatibility
export const cache = getRedisCache();
