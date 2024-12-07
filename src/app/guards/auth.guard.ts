import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  firebaseSvc=inject(FirebaseService); // cargamos el servicio de firebase
  utilsSvc=inject(UtilsService); // cargamos el servicio de utils


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable <boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    let user=localStorage.getItem('user'); // obtenemos el usuario

    return new Promise((resolve) =>{ // si el usuario esta logueado, se retorna true
      this.firebaseSvc.obtenerUsuario().onAuthStateChanged((auth) => { // se verifica si el usuario esta logueado
        if(auth){
          if(user) resolve(true);
        }
        else{
          this.firebaseSvc.cerrarSesion(); // si no esta logueado, se loguea el usuario
          resolve(false);
        }
      })
    })
  }
}
