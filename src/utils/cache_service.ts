import dotenv from "dotenv";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";

dotenv.config();


interface CacheServicesOptions {
  location: "memory" | "redis";
  redisUrl?: string;
  memoryTTL?: number;
  maxMemorySize?: number;
  redisRetryDelay?: number;
}

class CacheServiceSystem {
  private location: "memory" | "redis";
  private options: CacheServicesOptions;

  private redisClient?: Redis;
  private memoryCache?: LRUCache<string, any>;

  constructor(opt: CacheServicesOptions) {
    this.options = opt;
    this.location = opt.location;

    if (this.location === "memory") {
      this.memoryCache = new LRUCache({
        max: opt.maxMemorySize || 2000,
        ttl: opt.memoryTTL || 1000 * 60 * 2,
      });
    } else if (this.location === "redis") {
      if (!opt.redisUrl) {
        throw new Error("redis url is required for Redis cache");
      }
      this.startRedisClient();
    }
  }

  private startRedisClient() {
    this.redisClient = new Redis(this.options.redisUrl!, {
      retryStrategy: (attempts) => {
        const delay = this.options.redisRetryDelay || 2000;
        console.warn(`Redis reconnect attempt #${attempts}, retrying in ${delay}ms...`);
        return delay;
      },
    });

    this.redisClient.on("connect", () => {
      console.log("connected to redis");
    });

    this.redisClient.on("error", (err) => {
      console.error("redis connection error", err);
    });
  }

  async setData(key: string, value: any, ttl?: number) {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.set(key, value, { ttl: ttl || this.options.memoryTTL });
    } else if (this.redisClient && this.redisClient.status === "ready") {
      await this.redisClient.set(
        key,
        JSON.stringify(value),
        "EX",
        ttl || this.options.memoryTTL || 60
      );
    }
  }

  async getData<T>(key: string): Promise<T | null> {
    if (this.location === "memory" && this.memoryCache) {
      return this.memoryCache.get(key) || null;
    } else if (this.redisClient && this.redisClient.status === "ready") {
      const mydata = await this.redisClient.get(key);
      return mydata ? JSON.parse(mydata) : null;
    }
    return null;
  }

  async deleteData(key: string) {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.delete(key);
    } else if (this.redisClient && this.redisClient.status === "ready") {
      await this.redisClient.del(key);
    }
  }

  async clearData() {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.clear();
    } else if (this.redisClient && this.redisClient.status === "ready") {
      await this.redisClient.flushall();
    }
  }
}


const cacheServices = new CacheServiceSystem({
  location: "redis",
  redisUrl: process.env.REDIS_URL,
  memoryTTL: Number(process.env.MEMORY_TTL),
  maxMemorySize: Number(process.env.MAX_MEMORY_SIZE),
  redisRetryDelay: Number(process.env.REDIS_RETRY_DELAY),
});

export default cacheServices;



