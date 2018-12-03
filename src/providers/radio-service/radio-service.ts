import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";

/*
  Generated class for the RadioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RadioServiceProvider {

  promise: any;
  stream: any = null;
  loading: any;

  constructor(public http: HttpClient, public events: Events) {

  }


  play(Data) {
    this.events.publish('play', 1, {value: Data});
  }

  pause(Data) {

    this.events.publish('pause', 1, {value: Data});
  }

  stop(Data) {
    this.events.publish('stop', 1, {value: Data});
    console.log('Stop')
  }

  playSTR(streamUrl) {
    if (this.stream != null)
      this.pauseSTR();
    try {

      let src = streamUrl;
      this.stream = new Audio(src);
      this.stream.play();
      this.promise = new Promise((resolve, reject) => {
        this.stream.addEventListener('playing', () => {
          resolve(true);
        });

        this.stream.addEventListener('error', () => {
          reject(false);
        });
      });
      return this.promise;
    } catch (error) {
      console.log("erro ao carregar a playlist");
    }

  };

  playSTRVideo(streamUrl) {
    if (this.stream != null)
      this.pauseSTR();
    try {

      let src = streamUrl;
      this.stream = new Audio(src);
      this.stream.play();
      this.promise = new Promise((resolve, reject) => {
        this.stream.addEventListener('playing', () => {
          resolve(true);
        });

        this.stream.addEventListener('error', () => {
          reject(false);
        });
      });
      return this.promise;
    } catch (error) {
      console.log("erro ao carregar a playlist");
    }

  };
  pauseSTR() {
    if (this.stream != null) {
      this.stream.pause();
      this.stream.currentTime = 0;
      this.stream.src = "";
    }
  };

}
