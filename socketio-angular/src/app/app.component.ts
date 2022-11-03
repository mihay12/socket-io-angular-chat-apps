import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketioService } from './socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy{

  constructor(private socketService: SocketioService) {}


  ngOnInit(): void {
    this.socketService.setupSocketConnection();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  title = 'socketio-angular';
}
