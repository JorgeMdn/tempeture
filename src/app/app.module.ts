import { SockerIoService } from './services/socker-io.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.api, 	options: {
  transports: ['websocket']
} };
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [SockerIoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
