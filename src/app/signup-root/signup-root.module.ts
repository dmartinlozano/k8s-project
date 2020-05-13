import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignupRootPageRoutingModule } from './signup-root-routing.module';
import { SignupRootPage } from './signup-root.page';
import { K8sProjectFormErrorModule } from '../components/k8s-project-form-error/k8s-project-form-error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    K8sProjectFormErrorModule,
    SignupRootPageRoutingModule
  ],
  declarations: [SignupRootPage]
})
export class SignupRootPageModule {}
