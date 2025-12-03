import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SecurityService } from './security.service';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: Socket;
  callback: EventEmitter<any> = new EventEmitter();
  nameEvent: string = "";

  constructor(private securityService: SecurityService) {

    const userId = securityService.activeUserSession?.email || '';

    // Crear la conexión al websocket
    this.socket = io(environment.url_web_socket, {
      query: {
        "user_id": userId
      }
    });
  }

  setNameEvent(nameEvent: string) {
    this.nameEvent = nameEvent;
    this.listen();
  }

  listen() {
    this.socket.on(this.nameEvent, (res: any) => {
      this.callback.emit(res);
    });
  }

  emitEvent(payload: any = {}) {
    this.socket.emit(this.nameEvent, payload);
  }
}
