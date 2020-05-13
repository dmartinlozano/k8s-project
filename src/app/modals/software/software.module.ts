import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoftwarePageRoutingModule } from './software-routing.module';

import { SoftwarePage } from './software.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoftwarePageRoutingModule
  ],
  declarations: [SoftwarePage]
})
export class SoftwarePageModule {}
