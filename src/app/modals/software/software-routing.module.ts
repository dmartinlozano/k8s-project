import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoftwarePage } from './software.page';

const routes: Routes = [
  {
    path: '',
    component: SoftwarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoftwarePageRoutingModule {}
