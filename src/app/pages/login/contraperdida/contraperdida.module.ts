import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContraperdidaPageRoutingModule } from './contraperdida-routing.module';

import { ContraperdidaPage } from './contraperdida.page';
import { UtilModule } from 'src/app/util/util.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContraperdidaPageRoutingModule,
    UtilModule
  ],
  declarations: [ContraperdidaPage]
})
export class ContraperdidaPageModule {}
