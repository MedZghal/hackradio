import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MusiquePage } from './musique';

@NgModule({
  declarations: [
    MusiquePage,
  ],
  imports: [
    IonicPageModule.forChild(MusiquePage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MusiquePageModule {}
