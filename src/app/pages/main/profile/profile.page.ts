import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.obtenerDeLocalStorage('user');
  }

  ////Tomar/Seleccionar Foto
  async takeImage() {

    let user = this.user();

    ///
    let path = `users/${user.uid}`;
    ///
    


    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl;

    const loading= await this.utilsSvc.loading(); 
    await loading.present(); 

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, {image:user.image}).then(async res => {

      this.utilsSvc.guardarEnLocalStorage('user',user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).catch(err => {
      console.log(err);

      this.utilsSvc.presentToast({
        message: 'Usuario o contraseña incorrectos',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })


  }

}
