import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccueilPage } from './accueil';

@NgModule({
  declarations: [
    AccueilPage,
  ],
  imports: [
    IonicPageModule.forChild(AccueilPage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AccueilPageModule {}
