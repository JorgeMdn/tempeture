import { Temperature } from './models/temperature';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SockerIoService } from './services/socker-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'tempeture';
  temperature: Temperature
  private s: Subscription;

  constructor(private socket: SockerIoService) {
    this.s = new Subscription()
    this.temperature = new Temperature()
    this.temperature.level = 30
    this.temperature.btnLeft = 'red'
    this.temperature.btnRight = 'green'
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.temperature.color = this.getColor(this.temperature.level)
    }, 2000);
    this.socket.socketEventEmitter.subscribe((event: string) => {
      if (event == 'connect') {
        this.join();
        this.listenSocket()
      }
    });
  }

  ngOnDestroy(): void {
    this.s.unsubscribe()
  }
  // Join
  join = () => {
    this.socket.emit(
      'temperature',
      {
        join: 'temperature',
      },
      (r:any) => {
        console.log('open socket', r);
      }
    );
  };

  listenSocket = () => {
    console.log('listen Service');
    this.s = this.socket.listen('temperature').subscribe(
      (data: {range: number, left: string, right: string}) => {
        try
        {
          this.temperature.level = data.range
          this.temperature.btnLeft = data.left
          this.temperature.btnRight = data.right
          this.temperature.color = this.getColor(data.range)
          console.log('data',data);
        } catch (error) {
          console.log('Error socket:', error);
        }
      },
      () => {
        try {
          this.s.unsubscribe();
        } catch (error) {
          console.log(error);
          //this.listenSocket();
        }
      }
    );
  };

  private getColor(value: number): string{
    let color:string = null
    if (value >= 0 && value <= 50) {
      color= 'yellow'
    }else if (value >= 51 && value <= 75) {
      color= 'orange'
    }else if (value >= 76 && value <= 100) {
      color= 'red'
    }
    console.log(value,color);

    return color
  }


}
