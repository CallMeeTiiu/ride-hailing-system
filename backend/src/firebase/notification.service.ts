import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class NotificationService {
  constructor() {
    // Để cho an toàn khi chưa cung cấp credentials thật, ta wrap lại trong try..catch hoặc dùng hàm mock
    try {
      if (!admin.apps.length) {
        // Init logic from env (mặc định lấy GOOGLE_APPLICATION_CREDENTIALS)
        // Hiện tại dùng mock data để pass MVP.
      }
    } catch (e) {
      console.log('Firebase Admin init error', e)
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    if (!token) return

    try {
      console.log(
        `[FIREBASE NOTIFICATION] To: ${token} | Title: ${title} | Body: ${body}`,
      )
      // Chuyển data values thành string vì FCM yêu cầu
      const formattedData = data
        ? Object.entries(data).reduce((acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          }, {})
        : undefined

      await admin.messaging().send({
        token,
        notification: { title, body },
        data: formattedData,
      })
    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  }
}
