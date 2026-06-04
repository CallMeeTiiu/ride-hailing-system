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

      // Tham gia phòng chung tương ứng role nếu cần
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
    // Cập nhật lên Redis lấy tài xế vào radar
    await this.locationService.updateDriverLocation(
      userId,
      data.latitude,
      data.longitude,
    )

    // Nếu tài xế đang trong 1 chuyến xe, vứt tọa độ qua room của chuyến xe đó
    if (data.trip_id) {
      // Lưu lịch sử vị trí vào database
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
      // Vì lúc connect, ta nối client vào room dạng: "driver_<userId>" hoặc "customer_<userId>"
      // payload.role = "DRIVER", payload.sub = "<userId>"
      // -> client.join(`driver_${payload.sub}`)
      this.server.to(`driver_${driverId}`).emit('server:ride_request', payload)
    }
  }

  notifyTripAccepted(tripId: string, payload: any) {
    // Thông báo cho khách hàng trong room của chuyến đi
    this.server.to(`trip_${tripId}`).emit('server:trip_accepted', payload)
  }

  @SubscribeMessage('join_trip_room')
  handleJoinTripRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { trip_id: string | number },
  ) {
    const roomName = `trip_${payload.trip_id}`
    void client.join(roomName)
    console.log(`[Chat] Client ${client.id} vừa tham gia phòng: ${roomName}`)
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { trip_id: string | number; text: string; sender: string },
  ) {
    const roomName = `trip_${payload.trip_id}`
    console.log(
      `[Chat] ${payload.sender} gửi tin nhắn vào phòng ${roomName}: ${payload.text}`,
    )

    this.server.to(roomName).emit('receive_message', {
      text: payload.text,
      sender: payload.sender,
      timestamp: new Date().toISOString(),
    });
  }
}
