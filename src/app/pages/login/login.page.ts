import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form= new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
  })

  firebaseSvc=inject(FirebaseService);
  utilsSvc=inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  //metodo para validar al usuario
  async ingresar(){
    if (this.form.valid){ //validamos que el formulario sea valido
      const loading= await this.utilsSvc.loading(); //cargala funcion de loading
      await loading.present(); //mostramos el loading

      this.firebaseSvc.login(this.form.value as User).then(res =>{ //llamamos al metodo de login de firebase
        

        this.getUserInfo(res.user.uid);

      }).catch(err =>{ //si ocurre algun error
        console.log(err); //imprimimos el error

        this.utilsSvc.presentToast({
          message: 'Usuario o contraseña incorrectos',
          duration: 6500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() =>{ // si todo va bien
        loading.dismiss();// cerramos el loading
      })
    }
  }


 ///
 async getUserInfo(uid:string){
  if (this.form.valid){ 
    const loading= await this.utilsSvc.loading(); 
    await loading.present();

    let path = `users/${uid}`;
    
    
    this.firebaseSvc.getDocument(path).then((user: User) =>{
      
      this.utilsSvc.guardarEnLocalStorage('user',user);
      this.utilsSvc.routerLink('main/home');
      this.form.reset();

      

      this.utilsSvc.presentToast({
        message: `Bienvenido ${user.name}`,
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'person-circle-outline'
      })



    }).catch(err =>{ 
      console.log(err); 

      this.utilsSvc.presentToast({
        message: 'Usuario o contraseña incorrectos',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() =>{ 
      loading.dismiss();
    })
  }
}


}
