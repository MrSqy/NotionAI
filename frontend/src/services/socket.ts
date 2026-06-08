/// <reference types="vite/client" />
import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export const socket = io(WS_URL, { autoConnect: false });

export function connectSocket(userId: string) {
  socket.io.opts.query = { userId };
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}
