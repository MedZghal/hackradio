import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RadioServiceProvider} from "../../providers/radio-service/radio-service";
import {InterventionPage} from "../intervention/intervention";

/**
 * Generated class for the AccueilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html',
})
export class AccueilPage {

  click  ='pause';
  url :any ='./assets/play-button.png';
  dDate: Date = new Date();
  searchQuery: string = '';
  items: string[];
  showItems: boolean = false;

  public map: any;
  public childs: any;

  public hotellocation: string;

  // list of hotels
  public hotels: any;

  // search conditions
  public checkin = {
    name: "Check-in",
    date: this.dDate.toISOString()
  };

  public checkout = {
    name: "Check-out",
    date: new Date(this.dDate.setDate(this.dDate.getDate() + 1)).toISOString()
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,public player: RadioServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');
  }

  play(Data) {
    this.player.play(Data);
  }

  pause(Data) {
    this.player.pause(Data);
  }

  playStop(){
    if(this.click.toString() == 'pause'){
      this.click  ='play';
      this.player.play('http://rtstream.tanitweb.com/sfax');
      this.url='./assets/round-pause-button.png';
    }else{
      this.click  ='pause';
      this.player.pause('http://rtstream.tanitweb.com/sfax');
      this.url='./assets/play-button.png';
    }

  }

  interversion(){
    this.navCtrl.push(InterventionPage);
  }
}
