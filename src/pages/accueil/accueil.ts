import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RadioServiceProvider} from "../../providers/radio-service/radio-service";
import {InterventionPage} from "../intervention/intervention";
import { timeout, catchError,filter } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import {CallNumber} from "@ionic-native/call-number";
import {Geolocation, GeolocationOptions, Geoposition} from "@ionic-native/geolocation";

/**
 * Generated class for the AccueilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})
export class AccueilPage {

  latitude :any ;
  longitude:any;
  optionsG : GeolocationOptions;
  slides =[
    {src :"./assets/imgs/programme_freq_sfax_.jpg",style:'200px;'},
    {src :"./assets/imgs/13653184_1061028897307531_3920583169487014758_o.jpg",style:'200px;'},
    {src :"./assets/imgs/النشرة-الصباحية.jpg",style:'200px;'},
    {src :"./assets/imgs/المجلة-الإخبارية.jpg",style:'200px;'},
    {src :"./assets/imgs/unnamed.jpg",style:'150px;'}
  ];
  items = [
    {
      title: ' أحلــــــى صبـــــــــاح ',
      content: ` (9.00-6.00)  `,
      icon: 'calendar',
      time: { subtitle: '4/16/2013', title: '21:30' }
    },
    {
      title: ' ',
      content: `(11.00-9.00) هنا صفاقس`,
      icon: 'calendar',
      time: { subtitle: 'January', title: '29' }
    },
    {
      title: 'Courgette daikon',
      content: `Parsley amaranth tigernut silver beet maize .`,
      icon: 'calendar',
      time: { title: 'Short Text' }
    }
  ];

  Serveur ="";
  click  ='pause';
  url :any ='./assets/play-button.png';
  dDate: Date = new Date();

  public map: any;
  public childs: any;

  // search conditions
  public checkin = {
    name: "Check-in",
    date: this.dDate.toISOString()
  };

  public checkout = {
    name: "Check-out",
    date: new Date(this.dDate.setDate(this.dDate.getDate() + 1)).toISOString()
  };

  constructor(public navCtrl: NavController,
              public player: RadioServiceProvider,
              private callNumber: CallNumber,
              public geolocation: Geolocation) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');
    this.getUserPosition();
    this.Ping();
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
    // alert(this.latitude+"  --- "+this.longitude);
    let data  ={
      latitude :this.latitude ,
      longitude:this.longitude
    };

    this.navCtrl.push(InterventionPage,{ Data : data});
  }

  Music(){
    // this.navCtrl.push(MusiquePage);
  }

  dedicaces(){
    // this.navCtrl.push(DeduPage);
  }

  callJoint(telephoneNumber) {
    this.callNumber.callNumber(telephoneNumber, true);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.Ping();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  Ping(){

    this.player.get('ListAnimateurs').pipe(
      timeout(15000),
          catchError(e => {
            // do something on a timeout
            console.log('timeout'+JSON.stringify(e));
            this.Serveur ='off';
            return of(null);
          })
      ).subscribe(
      data => {

        if(data != null){
          this.Serveur ='on';
          console.log('on');
        }else{
          this.Serveur ='off';
          console.log('off 1');
        }


      },err =>{
        console.log(err);
        this.Serveur ='off';
        console.log('off 2');
      }
    );
  }



  getUserPosition(){
    this.optionsG = {
      enableHighAccuracy:true
    };

    this.geolocation.getCurrentPosition(this.optionsG).then((pos : Geoposition) => {

      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;

    },(err : PositionError)=>{
      console.log("error : " + err.message);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    });


  }

}
