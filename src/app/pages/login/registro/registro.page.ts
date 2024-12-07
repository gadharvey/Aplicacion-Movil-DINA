import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form= new FormGroup({
    ///
    uid: new FormControl(''),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
  })

  firebaseSvc=inject(FirebaseService);
  utilsSvc=inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  
  async ingresar(){
    if (this.form.valid){ 
      const loading= await this.utilsSvc.loading(); 
      await loading.present(); 

      this.firebaseSvc.registrarse(this.form.value as User).then(async res =>{
        
        await this.firebaseSvc.updateUser(this.form.value.name);
        
        ///
        let uid= res.user.uid;
        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);
        
        //
        console.log(res); 
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



  ///
  async setUserInfo(uid:string){
    if (this.form.valid){ 
      const loading= await this.utilsSvc.loading(); 
      await loading.present();

      let path = `users/${uid}`
      delete this.form.value.password;
      
      this.firebaseSvc.setDocument(path,this.form.value).then(async res =>{
        
        this.utilsSvc.guardarEnLocalStorage('user',this.form.value);
        this.utilsSvc.routerLink('main/home');
        this.form.reset();



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
