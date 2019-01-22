import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AccueilPageModule} from "../pages/accueil/accueil.module";
import {InterventionPageModule} from "../pages/intervention/intervention.module";
import {MapPageModule} from "../pages/map/map.module";
import {RadioServiceProvider} from "../providers/radio-service/radio-service";
import {HttpClientModule} from "@angular/common/http";
import {Camera} from "@ionic-native/camera";
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import {Base64} from "@ionic-native/base64";
import {ComponentsModule} from "../components/components.module";
import {DeduPageModule} from "../pages/dedu/dedu.module";
import {MediaCapture} from "@ionic-native/media-capture";
import {SplashPageModule} from "../pages/splash/splash.module";
import { defaultAudioProviderFactory, IonicAudioModule} from "ionic-audio";
import {MusiquePageModule} from "../pages/musique/musique.module";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {CallNumber} from "@ionic-native/call-number";
import { Sim } from '@ionic-native/sim';

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
    ComponentsModule,
    DeduPageModule,
    SplashPageModule,
    MusiquePageModule,
    IonicModule.forRoot(MyApp),
    IonicAudioModule.forRoot(defaultAudioProviderFactory),
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
    PhotoViewer,
    Geolocation,
    Base64,
    MediaCapture,
    CallNumber,
    Sim,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
