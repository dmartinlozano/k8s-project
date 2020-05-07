import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupRootPageRoutingModule } from './signup-root-routing.module';

import { SignupRootPage } from './signup-root.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupRootPageRoutingModule
  ],
  declarations: [SignupRootPage]
})
export class SignupRootPageModule {}
