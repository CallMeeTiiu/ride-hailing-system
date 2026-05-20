import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    })
  }

  getClient(): Redis {
    return this.redisClient
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value)
    if (ttlSeconds) {
      await this.redisClient.setex(key, ttlSeconds, stringValue)
    } else {
      await this.redisClient.set(key, stringValue)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key)
    if (!value) return null
    return JSON.parse(value) as T
  }

  onModuleDestroy() {
    this.redisClient.quit()
  }
}
