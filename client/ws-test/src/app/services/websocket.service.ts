import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => console.log('WebSocket kapcsolat létrejött.');
    this.socket.onmessage = (event) => console.log('Üzenet:', event.data);
    this.socket.onclose = () => console.log('WebSocket kapcsolat lezárva.');
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }
}
