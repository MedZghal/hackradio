import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AudioProvider, ITrackConstraint} from "ionic-audio";

/**
 * Generated class for the MusiquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-musique',
  templateUrl: 'musique.html',
})
export class MusiquePage {

  myTracks: ITrackConstraint[];
  allTracks: any[];
  selectedTrack: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private _audioProvider: AudioProvider) {

    this.myTracks = [{
      src: 'https://archive.org/download/swrembel2010-03-07.tlm170.flac16/swrembel2010-03-07s1t05.mp3',
      artist: 'John Mayer',
      title: 'Why Georgia',
      art: './assets/logo.png',
      preload: 'metadata' // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
    },
      {
        src: 'https://archive.org/download/swrembel2010-03-07.tlm170.flac16/swrembel2010-03-07s1t05.mp3',
        artist: 'John Mayer',
        title: 'Who Says',
        art: './assets/logo.png',
        preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
      }];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusiquePage');
  }


  ngAfterContentInit() {
    // get all tracks managed by AudioProvider so we can control playback via the API
    this.allTracks = this._audioProvider.tracks;
  }

  playSelectedTrack() {
    // use AudioProvider to control selected track
    this._audioProvider.play(this.selectedTrack);
  }

  pauseSelectedTrack() {
    // use AudioProvider to control selected track
    this._audioProvider.pause(this.selectedTrack);
  }

  onTrackFinished(track: any) {
    console.log('Track finished', track);
  }
}
