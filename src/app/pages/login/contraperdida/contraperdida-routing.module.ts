import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContraperdidaPage } from './contraperdida.page';

const routes: Routes = [
  {
    path: '',
    component: ContraperdidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContraperdidaPageRoutingModule {}
