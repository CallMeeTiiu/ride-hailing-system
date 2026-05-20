import { Injectable } from '@nestjs/common'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class LocationService {
  private readonly DRIVER_LOCATION_KEY = 'driver_locations'

  constructor(private redisService: RedisService) {}

  async updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const client = this.redisService.getClient()
    await client.geoadd(this.DRIVER_LOCATION_KEY, longitude, latitude, driverId)
    // Lưu một key phụ để biết tài xế này đang online (có thể dùng TTL để expire nếu không gửi location liên tục)
    // Chỉ set nếu tài xế chưa bị đánh dấu là Offline thủ công
    const isOfflineManually = await client.get(`driver_offline_manual:${driverId}`)
    if (!isOfflineManually) {
      await client.set(`driver_online:${driverId}`, 'true', 'EX', 30) // expire sau 30 giây
    }
  }

  async setDriverAvailability(driverId: string, isAvailable: boolean): Promise<void> {
    const client = this.redisService.getClient()
    if (isAvailable) {
      await client.del(`driver_offline_manual:${driverId}`)
      await client.set(`driver_online:${driverId}`, 'true', 'EX', 30)
    } else {
      await client.set(`driver_offline_manual:${driverId}`, 'true')
      await client.del(`driver_online:${driverId}`)
      await client.zrem(this.DRIVER_LOCATION_KEY, driverId)
    }
  }

  async findNearbyDrivers(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
  ): Promise<string[]> {
    const client = this.redisService.getClient()
    // GEORADIUS bị deprecated ở Redis mới, dùng GEOSEARCH tuỳ version, ta dùng GEORADIUS cho ioredis dễ
    // Tìm các tài xế trong bán kính `radiusKm` km
    const nearbyDrivers = await client.geosearch(
      this.DRIVER_LOCATION_KEY,
      'FROMLONLAT',
      longitude,
      latitude,
      'BYRADIUS',
      radiusKm,
      'km',
      'ASC',
    )

    // Lọc ra các tài xế thực sự đang online (gửi toạ độ trong 30s qua)
    const validDrivers: string[] = []
    for (const driverId of nearbyDrivers as string[]) {
      const isOnline = await client.get(`driver_online:${driverId}`)
      if (isOnline) {
        validDrivers.push(driverId)
      }
    }
    return validDrivers
  }
}
