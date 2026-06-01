import { io, Socket } from 'socket.io-client';
import { CONFIG } from './config';

let socket: Socket | null = null;

/**
 * Kết nối Socket.IO với token truyền trực tiếp.
 * Caller lấy token từ useAuthStore.getState().token để đảm bảo luôn dùng token mới nhất.
 */
export function connectSocket(token: string): Socket {
    if (socket?.connected) return socket;

    socket = io(CONFIG.SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: 10,
    });

    socket.on('connect', () => console.log('[Socket] Connected:', socket?.id));
    socket.on('disconnect', (reason) => console.log('[Socket] Disconnected:', reason));
    socket.on('connect_error', (err) => console.error('[Socket] Error:', err.message));

    return socket;
}

export function disconnectSocket(): void {
    socket?.disconnect();
    socket = null;
}

export function getSocket(): Socket | null {
    return socket;
}
