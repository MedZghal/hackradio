import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionPage } from './intervention';

@NgModule({
  declarations: [
    InterventionPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionPage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InterventionPageModule {}
