import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private redisClient: RedisClientType

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost')
    const port = this.configService.get<number>('REDIS_PORT', 6379)
    const password = this.configService.get<string>('REDIS_PASSWORD', '')
    const username = this.configService.get<string>('REDIS_USERNAME', 'default')

    this.redisClient = createClient({
      username,
      password,
      socket: {
        host,
        port,
      },
    })

    // Bắt lỗi thay vì để crash unhandled
    this.redisClient.on('error', (err) => {
      this.logger.error('[Redis] Connection error:', err)
    })
    this.redisClient.on('connect', () => {
      this.logger.log('[Redis] Connecting...')
    })
    this.redisClient.on('ready', () => {
      this.logger.log('[Redis] Connected and ready')
    })
  }

  async onModuleInit() {
    try {
      await this.redisClient.connect()
      this.logger.log('Connected to Redis')
    } catch (e) {
      this.logger.warn('Redis connect failed', e)
    }
  }

  getClient(): RedisClientType {
    return this.redisClient
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value)
    if (ttlSeconds) {
      await this.redisClient.set(key, stringValue, { EX: ttlSeconds })
    } else {
      await this.redisClient.set(key, stringValue)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key)
    if (!value) return null
    return JSON.parse(value) as T
  }

  async onModuleDestroy() {
    try {
      await this.redisClient.quit()
    } catch (e) {
      try {
        this.redisClient.disconnect()
      } catch {}
    }
  }
}
