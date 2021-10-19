import { environment } from './../../environments/environment';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class SockerIoService {

  @Output('socket') socketEventEmitter: EventEmitter<string> = new EventEmitter();

  socket_connect_status: boolean = false

  constructor(
    private socket: Socket
  ) {
    this.socketEventEmitter.subscribe((event: string) => {
      this.socket_connect_status = event == 'connect' ? true : false
      console.log('socket on', event)
    })

    this.init()

  }

  private init = () => {
    this.socket.on('connect', () => this.socketEventEmitter.emit('connect'))

    this.socket.on('connect_error', () => this.socketEventEmitter.emit('connect_error'))
    this.socket.on('connect_timeout', () => this.socketEventEmitter.emit('connect_timeout'))

    this.socket.on('error', () => this.socketEventEmitter.emit('error'))

    this.socket.on('disconnect', () => this.socketEventEmitter.emit('disconnect'))

    this.socket.on('reconnect', () => this.socketEventEmitter.emit('reconnect'))
    this.socket.on('reconnecting', () => this.socketEventEmitter.emit('reconnecting'))
    this.socket.on('reconnect_error', () => this.socketEventEmitter.emit('reconnect_error'))
    this.socket.on('reconnect_failed', () => this.socketEventEmitter.emit('reconnect_failed'))
  }

  connect = () => this.socket.connect()

  disconnect = () => this.socket.disconnect()

  emit = (evento: string, payload?: any, callback?: Function) => this.socket.emit(evento, payload, callback)

  listen = (evento: string): Observable<any> => this.socket.fromEvent(evento)

}
