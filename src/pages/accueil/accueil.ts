import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RadioServiceProvider} from "../../providers/radio-service/radio-service";
import {InterventionPage} from "../intervention/intervention";
import {DeduPage} from "../dedu/dedu";

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

  click  ='pause';
  url :any ='./assets/play-button.png';
  dDate: Date = new Date();
  searchQuery: string = '';
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
    // this.player.get('ViewAllFile').subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   err =>{
    //
    //   }
    // )
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

  Deducace(){
    this.navCtrl.push(DeduPage);
  }
}
