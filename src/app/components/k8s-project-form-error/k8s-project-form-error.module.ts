import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { K8sProjectFormErrorComponent } from './k8s-project-form-error.component';

@NgModule({
  declarations: [K8sProjectFormErrorComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot()
  ],
  exports: [K8sProjectFormErrorComponent]
})
export class K8sProjectFormErrorModule { }