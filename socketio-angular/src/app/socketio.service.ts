import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any;

  constructor() {
   }

  // функція ініціалізації сокета
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      // Надсилання query parameters на бекенд під час підключення сокета
      auth: {
        token: 'cde'
      }
    });

    // Передача з ангуляру тексту через подію 'my message'
    this.socket.emit('my message', 'Hello there from Angular');

    // Друк тексту у консолі переданого з серверної сторони
    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
    });
  }

  // Функція відключення сокета
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
