import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupRootPage } from './signup-root.page';

const routes: Routes = [
  {
    path: '',
    component: SignupRootPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRootPageRoutingModule {}
