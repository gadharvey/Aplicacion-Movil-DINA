import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-contraperdida',
  templateUrl: './contraperdida.page.html',
  styleUrls: ['./contraperdida.page.scss'],
})
export class ContraperdidaPage implements OnInit {

  form= new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    
  })

  firebaseSvc=inject(FirebaseService);
  utilsSvc=inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  
  async ingresar(){
    if (this.form.valid){ //validamos que el formulario sea valido
      const loading= await this.utilsSvc.loading(); //cargala funcion de loading
      await loading.present(); //mostramos el loading

      this.firebaseSvc.recuperarContrasena(this.form.value.email).then(res =>{ //llamamos al metodo de login de firebase
        
        this.utilsSvc.presentToast({
          message: 'Correo enviado con éxito',  
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        })

        this.utilsSvc.routerLink('login');
        this.form.reset();
      

      }).catch(err =>{ //si ocurre algun error
        console.log(err); //imprimimos el error

        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() =>{ // si todo va bien
        loading.dismiss();// cerramos el loading
      })
    }
  }




}
