/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '@/env';
import Redis from 'ioredis';

class RedisCache {
  private client: Redis;

  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      // Recommended options for production
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.on('connect', () => {
      console.log('Successfully connected to Redis');
    });
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value; // Return raw value if not JSON
    }
  }

  async set(
    key: string,
    value: any,
    ttlInSeconds?: number,
    flag?: 'NX' | 'XX',
    px?: 'PX',
    pxValue?: number
  ): Promise<boolean> {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    if (flag && px && pxValue) {
      // Handle the special case for locks with PX
      const result = await this.client.set(
        key,
        serializedValue,
        px,
        pxValue
      );
      return result === 'OK';
    }

    if (ttlInSeconds) {
      const result = await this.client.setex(
        key,
        ttlInSeconds,
        serializedValue
      );
      return result === 'OK';
    }

    const result = await this.client.set(key, serializedValue);
    return result === 'OK';
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async flushAll(): Promise<void> {
    await this.client.flushall();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

// Export a singleton instance
export const cache = new RedisCache();
