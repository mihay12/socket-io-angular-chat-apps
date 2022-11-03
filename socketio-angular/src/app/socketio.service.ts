import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any;

  constructor() { }

  // функція ініціалізації сокета
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  // функція відключення сокета
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
