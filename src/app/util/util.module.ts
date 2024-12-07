import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componente/header/header.component';
import { InputComponent } from './componente/input/input.component';
import { LogoComponent } from './componente/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductoComponent } from './componente/add-update-producto/add-update-producto.component';
// import { AddCajaComponent } from './componente/add-caja/add-caja.component';



@NgModule({
  declarations: [
    HeaderComponent,
    InputComponent,
    LogoComponent,
    AddUpdateProductoComponent,
    // AddCajaComponent
  ],
  //se crea nuevo arreglo vacio, para colocar los compenentes de header,input,logo, esto para declarations y exports
  exports: [
    HeaderComponent,
    InputComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateProductoComponent,
    // AddCajaComponent
  ],

  //para que funcionen correctamente los componentes se importa el ionicmodule,reactiveformsmodule para formularios y formsmodule
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UtilModule { }
