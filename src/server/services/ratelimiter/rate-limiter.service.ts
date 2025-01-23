import { env } from '@/env';
import { RateLimitError } from './errors';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { getIp } from '@/lib/get-ip';

export class RateLimiterService {
  private static instance: RateLimiterService;
  private redisLimiter: Ratelimit | null = null;
  private memoryTrackers: Record<
    string,
    { count: number; expiresAt: number }
  > = {};
  private pruneInterval: NodeJS.Timeout;

  private constructor() {
    // Try to initialize Redis limiter if credentials are available
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const redis = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });
        this.redisLimiter = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(10, '10 s'),
          prefix: 'app-rate-limit',
        });
      } catch {
        console.warn(
          'Failed to initialize Redis rate limiter, falling back to memory limiter'
        );
      }
    }

    // Set up memory tracker pruning
    this.pruneInterval = setInterval(
      this.pruneTrackers.bind(this),
      60 * 1000
    );
  }

  public static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  private pruneTrackers(): void {
    const now = Date.now();
    for (const key in this.memoryTrackers) {
      if (this.memoryTrackers[key].expiresAt < now) {
        delete this.memoryTrackers[key];
      }
    }
  }

  /**
   * Rate limit by IP address
   * @param options Rate limiting options
   */
  public async limitByIp(options: {
    key?: string;
    limit?: number;
    window?: number;
    useRedis?: boolean; // Whether to prefer Redis limiter if available
  }) {
    const ip = getIp();
    if (!ip) throw new RateLimitError();

    await this.limit({
      ...options,
      identifier: `${ip}-${options.key || 'global'}`,
    });
  }

  /**
   * Rate limit by any identifier
   * @param options Rate limiting options
   */
  public async limit(options: {
    identifier: string;
    limit?: number;
    window?: number;
    useRedis?: boolean;
  }): Promise<void> {
    const {
      identifier,
      limit = 1,
      window = 10000,
      useRedis = false,
    } = options;

    // Try Redis limiter first if requested and available
    if (useRedis && this.redisLimiter) {
      try {
        const result = await this.redisLimiter.limit(identifier);
        if (!result.success) {
          throw new RateLimitError();
        }
        return;
      } catch {
        // Fall back to memory limiter on Redis failure
        console.warn(
          'Redis rate limit failed, falling back to memory limiter'
        );
      }
    }

    // Memory-based rate limiting
    const tracker = this.memoryTrackers[identifier] || {
      count: 0,
      expiresAt: 0,
    };

    if (!this.memoryTrackers[identifier]) {
      this.memoryTrackers[identifier] = tracker;
    }

    if (tracker.expiresAt < Date.now()) {
      tracker.count = 0;
      tracker.expiresAt = Date.now() + window;
    }

    tracker.count++;

    if (tracker.count > limit) {
      throw new RateLimitError();
    }
  }

  // Cleanup
  public destroy(): void {
    clearInterval(this.pruneInterval);
  }
}

// Export singleton instance
export const rateLimiter = RateLimiterService.getInstance();
