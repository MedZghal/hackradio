import { Component, ViewChild } from '@angular/core';
import {Events, LoadingController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {RadioServiceProvider} from "../providers/radio-service/radio-service";
import {AccueilPage} from "../pages/accueil/accueil";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  loading: any;
  rootPage: any = AccueilPage;

  pages: Array<{title: string, component: any}>;

  constructor(private player : RadioServiceProvider, public loadingCtrl: LoadingController,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public events: Events) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.playEvents();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }



  playEvents(){

    this.events.subscribe('play', (userId, attrs) => {
      this.loading = this.presentLoadingDefault();
      this.loading.present().then(()=>{
        this.player.playSTR(attrs.value).then(() => {
          this.loading.dismiss();
          console.log('Playing');
        });
      });


    });

    this.events.subscribe('pause', (userId, attrs) => {

      this.player.pauseSTR();
      console.log('STOP')

    });

  }

  presentLoadingDefault() {
    return this.loadingCtrl.create({
      content: 'Connecté...'
    });

  }
}
