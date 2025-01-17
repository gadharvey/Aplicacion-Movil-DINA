import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';


@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  firebaseSvc=inject(FirebaseService); // cargamos el servicio de firebase
  utilsSvc=inject(UtilsService); // cargamos el servicio de utils


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable <boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    let user=localStorage.getItem('user');

    return new Promise((resolve) =>{
      this.firebaseSvc.obtenerUsuario().onAuthStateChanged((auth) => {
        if(!auth) resolve(true);
        else{
          this.utilsSvc.routerLink('/main/home');
          resolve(false);
        }
      })

    })
  }
}

