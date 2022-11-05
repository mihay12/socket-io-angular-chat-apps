import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketioService } from './socketio.service';
import { FormBuilder } from '@angular/forms';

const SENDER = {
  id: '123',
  name: 'John Doe',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  messages = [];

  // id каналу чату, яке буде мінятися динамічно в режимі реального часу
  CHAT_ROOM = 'myRandomChatRoomId';

  // Об'єкт, в який записуємо дані з форми
  tokenForm = this.formBuilder.group({
    token: '',
  });

  messageForm = this.formBuilder.group({
    message: '',
  });

  constructor(
    private socketService: SocketioService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  // Функція відправки даних з формаи
  submitToken() {
    // Отримаання данних з форми
    const token = this.tokenForm.get('token').value;
    if (token) {
      // Функція ініціалізації підключення токена до сокета
      this.socketService.setupSocketConnection(token);

      // Функція subscribeToMessages буде прослуховувати всі
      // вхідні повідомлення після з'єднання через веб-сокет
      this.socketService.subscribeToMessages((err, data) => {
        console.log('NEW MESSAGE ', data);
        // debugger
        this.messages = [...this.messages, data];
      });
    }
  }

  submitMessage() {
    // Отримаання данних з форми
    const message = this.messageForm.get('message').value;
    if (message) {
      // Метод sendMessage надсилає повідомлленя на сервер разом
      // із зворотнім викликом (callBack), який пересилається на
      // сервер і використовується для підтвержєеня.
      this.socketService.sendMessage(
        { message, roomName: this.CHAT_ROOM },
        (cb) => {
          // debugger
          console.log('ACKNOWLEDGEMENT ', cb);
        }
      );
        // debugger
      this.messages = [
        ...this.messages,
        {
          message,
          ...SENDER,
        },
      ];

      // Очистка інпуту після надсилання повідомлення
      this.messageForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
