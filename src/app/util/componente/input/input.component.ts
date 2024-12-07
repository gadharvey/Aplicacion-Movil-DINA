import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent  implements OnInit {

  //este compenente esta recibiendo parametros 

  //
  @Input() control!: FormControl;

  //cual es el tipo de input type y va estar sin inicializar
  @Input() type!: string;
  //para identificar el input donde se escribe el label y va estar sin inicializar
  @Input() label!: string;
  //algunos input tienen autocomplete y va estar sin inicializar
  @Input() autocomplete!: string;
  //algunos input tienen icono y va estar sin inicializar
  @Input() icon!: string;

  //para el ojito de la contraseña, se crean variables booleanas
  isPassword! : boolean;
  hide : boolean =true;



  constructor() { }

  ngOnInit() {
    if (this.type === 'password') this.isPassword = true; //si el tipo es password, se asigna a true
  }


  //metodo para mostrar o ocultar el ojito de la contraseña
  mostrarojito(){
    this.hide = !this.hide; //si this.hide es true, se cambia a false, y viceversa
    if(this.hide) this.type = 'password'; //si this.hide es true, se cambia a password, y viceversa
    else this.type = 'text'; //si this.hide es false, se cambia a text, y viceversa
  }


}
