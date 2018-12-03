import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionPage } from './intervention';

@NgModule({
  declarations: [
    InterventionPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionPage),
  ],
})
export class InterventionPageModule {}
