import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";

/*
  Generated class for the RadioServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RadioServiceProvider {


  // url: string = 'https://radioservice.herokuapp.com';
  url: string = 'https://medproapp.ddns.net/RadioBackend';
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


  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  postReq(endpoint: string, body: any) {
    return this.http.post(this.url + '/' + endpoint, body);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

}
