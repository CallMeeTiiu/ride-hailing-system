import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  Client,
  DistanceMatrixResponse,
} from '@googlemaps/google-maps-services-js'

@Injectable()
export class PricingService {
  private readonly googleClient: Client
  private readonly BASE_FARE = 15000
  private readonly FARE_PER_KM = 10000
  private readonly FARE_PER_MINUTE = 2000

  constructor(private configService: ConfigService) {
    this.googleClient = new Client({})
  }

  async calculateFare(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY')

    // Nếu dùng key MOCK thì sinh dữ liệu ảo
    if (!apiKey || apiKey === 'mock-api-key') {
      console.log(
        '[MOCK] Google Maps API is not configured. Using mocked distance and duration.',
      )
      const distanceKm = 5 // 5 km
      const durationMins = 15 // 15 mins
      return this.computePrice(distanceKm, durationMins)
    }

    try {
      const response: DistanceMatrixResponse =
        await this.googleClient.distancematrix({
          params: {
            origins: [{ lat: pickupLat, lng: pickupLng }],
            destinations: [{ lat: dropoffLat, lng: dropoffLng }],
            key: apiKey,
          },
        })

      const element = response.data.rows[0].elements[0]
      if (element.status !== 'OK') {
        throw new Error('Distance calculation failed')
      }

      const distanceKm = element.distance.value / 1000
      const durationMins = element.duration.value / 60

      return this.computePrice(distanceKm, durationMins)
    } catch (error) {
      console.error('Google Maps API Error:', error)
      // Fallback
      return this.computePrice(5, 15)
    }
  }

  private computePrice(distanceKm: number, durationMins: number) {
    const surgeMultiplier = this.getSurgeMultiplier()
    const estimatedFare =
      (this.BASE_FARE +
        distanceKm * this.FARE_PER_KM +
        durationMins * this.FARE_PER_MINUTE) *
      surgeMultiplier

    return {
      distance_km: distanceKm,
      duration_mins: durationMins,
      estimated_fare: Math.round(estimatedFare),
      surge_multiplier: surgeMultiplier,
    }
  }

  private getSurgeMultiplier(): number {
    const now = new Date()
    const hour = now.getHours()

    // Giờ cao điểm sáng: 7h - 9h
    if (hour >= 7 && hour <= 9) return 1.5
    // Giờ cao điểm chiều: 17h - 19h
    if (hour >= 17 && hour <= 19) return 1.8
    // Ban đêm: 22h - 5h
    if (hour >= 22 || hour <= 5) return 1.2

    return 1.0
  }
}
