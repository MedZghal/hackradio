import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AccueilPageModule} from "../pages/accueil/accueil.module";
import {HttpClientModule} from "@angular/common/http";
import {RadioServiceProvider} from "../providers/radio-service/radio-service";
import {InterventionPageModule} from "../pages/intervention/intervention.module";
import {Camera} from "@ionic-native/camera";
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import {MapPageModule} from "../pages/map/map.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AccueilPageModule,
    InterventionPageModule,
    MapPageModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RadioServiceProvider,
    Camera,
    Media,
    File,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
