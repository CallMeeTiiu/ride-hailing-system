import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { LocationService } from '../location/location.service'
import { RidesService } from './rides.service'

@WebSocketGateway({ cors: { origin: '*' } })
export class TripGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    private jwtService: JwtService,
    private locationService: LocationService,
    private ridesService: RidesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization
      if (!token) throw new Error('No token provided')

      const payload = this.jwtService.verify(token.replace('Bearer ', ''))
      client.data.user = payload

      await client.join(`${payload.role.toLowerCase()}_${payload.sub}`)
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`)
    } catch (err) {
      console.log('❌ Lỗi xác thực Socket:', err.message);
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('driver:update_location')
  async handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      latitude: number
      longitude: number
      trip_id?: string
      heading?: number
      speed?: number
    },
  ) {
    const userId = client.data.user.sub
    await this.locationService.updateDriverLocation(
      userId,
      data.latitude,
      data.longitude,
    )

    if (data.trip_id) {
      await this.ridesService.saveTripLocation({
        trip_id: data.trip_id,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        speed: data.speed,
      })

      this.server.to(`trip_${data.trip_id}`).emit('server:driver_location', {
        driver_id: userId,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        speed: data.speed,
        timestamp: new Date().toISOString(),
      })
    }
  }

  @SubscribeMessage('customer:subscribe')
  async handleCustomerSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trip_id: string },
  ) {
    if (data.trip_id) {
      await client.join(`trip_${data.trip_id}`)
    }
  }

  notifyDrivers(driverIds: string[], payload: any) {
    for (const driverId of driverIds) {
      this.server.to(`driver_${driverId}`).emit('server:ride_request', payload)
    }
  }

  notifyTripAccepted(tripId: string, payload: any) {
    this.server.to(`trip_${tripId}`).emit('server:trip_accepted', payload)
  }

  @SubscribeMessage('join_trip_room')
  async handleJoinTripRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trip_id: string },
  ) {
    if (data.trip_id) {
      await client.join(`trip_${data.trip_id}`)
      console.log(
        `[Chat] Client ${client.id} đã join phòng trip_${data.trip_id}`,
      )
    }
  }

  @SubscribeMessage('send_message')
  handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trip_id: string; text: string; sender: string },
  ) {
    if (data.trip_id && data.text) {
      client.to(`trip_${data.trip_id}`).emit('receive_message', {
        text: data.text,
        sender: data.sender,
        timestamp: new Date().toISOString(),
      })
    }
  }
}
