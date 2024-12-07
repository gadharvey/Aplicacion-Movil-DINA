import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {title: 'Inicio',url:'/main/home',icon:'home-outline'},
    {title: 'Perfil',url:'/main/profile',icon:'person-outline'},

    //PROBANDO CAJA
    {title: 'Caja',url:'/main/caja',icon:'archive-outline'},
  ]

  router = inject(Router);

  firebaseSvc=inject(FirebaseService); // cargamos el servicio de firebase
  utilsSvc=inject(UtilsService); // cargamos el servicio de utils

  constructor() { }

  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event:any)=>{
      if(event?.url) this.currentPath=event.url;
    })
  }

  user():User{
    return this.utilsSvc.obtenerDeLocalStorage('user');
  }

  //Cerrar sesion
  cerrarSesion(){
    this.firebaseSvc.cerrarSesion();
  }

  ////PROBANDO MODE OSCURO

  toggleDarkMode(event: any) {
    const isDarkMode = event.detail.checked;
  
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

}
