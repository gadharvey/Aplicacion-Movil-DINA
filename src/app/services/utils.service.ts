import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadinCtrl= inject(LoadingController); //cargamos el loadingcontroller
  toastCtrl= inject(ToastController); //cargamos el toastcontroller para mostrar los mensajes
  modalCrtl = inject(ModalController);

  ///
  router=inject(Router);

  alertCtrl= inject(AlertController);

  constructor() { }

  //////


  async takePicture(promptLabelHeader:string) {
    return Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source:CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto:'Seleccione una imagen',
      promptLabelPicture:'Toma una foto '
    });


  };

  //Alerta 
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }



  //loading
  loading(){
    return this.loadinCtrl.create({spinner: 'crescent'});
  }

  //toast
  async presentToast(opts?: ToastOptions) { //funcion para mostrar un toast
    const toast = await this.toastCtrl.create(opts); //creamos el toast
    toast.present(); //mostramos el toast
  }
  

  ///ROUTERLINK
  routerLink(url:string){
    return this.router.navigateByUrl(url);
  }

  guardarEnLocalStorage(key:string,value:any){
    return localStorage.setItem(key,JSON.stringify(value));
  }

  obtenerDeLocalStorage(key:string){
    return JSON.parse(localStorage.getItem(key));
  }

  //modal 
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCrtl.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  
  }

  dismissmodal(data?:any){  
    return this.modalCrtl.dismiss(data);
  }




}
