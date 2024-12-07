import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  user,
  authState,
} from '@angular/fire/auth';
import { User } from '../models/user.model';
import { getAuth } from 'firebase/auth';

import {
  Firestore,
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { get } from 'firebase/database';
import { UtilsService } from './utils.service';

///
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
  deleteObject,
} from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { Observable } from 'rxjs';
import { getDocs, where } from 'firebase/firestore';
import { ItemsDb, ItemsDbAndTotalPrice } from '../pages/main/caja/caja.page';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  ///
  storage = inject(Storage);

  utilsSvc = inject(UtilsService);

  constructor() {}

  /* -----START */

  async addItemToBox(item: any, path: string) {
    return addDoc(collection(getFirestore(), path), item);
  }

  gittingBoxWithIdUser(): Observable<ItemsDb[]> {
    const user = this.auth.currentUser.uid;

    let path = `users/${user}/box`;

    const collRef = collection(this.firestore, path);
    return new Observable((observer) => {
      getDocs(collRef)
        .then((qrySnapshot) => {
          const items = qrySnapshot.docs.map((doc) => {
            return { idDoc: doc.id, ...doc.data() } as ItemsDb;
          });

          observer.next(items);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////

  async deleteBoxItem2(pato2: string, item: ItemsDbAndTotalPrice) {
    const user = this.auth.currentUser.uid;
    let path = `users/${user}/box/${item.idDoc}`;

    const result = deleteDoc(doc(getFirestore(), path));

    await this.aumetnarCnatidad2(pato2, item);

    return result;
  }

  async deleteBoxItem(pato2: string, item: ItemsDbAndTotalPrice) {
    const user = this.auth.currentUser.uid;
    let path = `users/${user}/box/${item.idDoc}`;
  
    // Solo eliminar el producto de la caja sin modificar el inventario
    return deleteDoc(doc(getFirestore(), path));
  }

  // async deleteBoxItem(pato2: string, item: ItemsDbAndTotalPrice) {
  //   try {
  //     const user = this.auth.currentUser.uid;
  //     let path = `users/${user}/box/${item.idDoc}`;
      
  //     // Restaurar las unidades en el inventario principal
  //     const productPath = pato2; // Ruta del producto en inventario (pato2)
  //     const productRef = doc(getFirestore(), productPath);
  //     const productDoc = await getDoc(productRef);
  
  //     if (productDoc.exists()) {
  //       const data = productDoc.data();
  //       const currentStock = data['soldUnits'] || 0;
  
  //       // Restaurar el stock sumando las unidades eliminadas de la caja
  //       await updateDoc(productRef, {
  //         soldUnits: currentStock + item.currentNumber,
  //       });
  //     }
  
  //     // Eliminar el producto de la caja
  //     await deleteDoc(doc(getFirestore(), path));
      
  //     console.log('Producto eliminado de la caja y stock restaurado');
  //   } catch (error) {
  //     console.error('Error al eliminar el producto de la caja:', error);
  //   }
  // }

  // async deleteBoxItem(pato2: string, item: ItemsDbAndTotalPrice, restoreInventory: boolean = true) {
  //   try {
  //     const user = this.auth.currentUser.uid;
  //     let path = `users/${user}/box/${item.idDoc}`;
  
  //     if (restoreInventory) {
  //       // Restaurar unidades en el inventario solo si 'restoreInventory' es true
  //       const productPath = pato2; // Ruta del producto en inventario
  //       const productRef = doc(getFirestore(), productPath);
  //       const productDoc = await getDoc(productRef);
  
  //       if (productDoc.exists()) {
  //         const data = productDoc.data();
  //         const currentStock = data['soldUnits'] || 0;
  
  //         // Restaurar el stock sumando las unidades eliminadas de la caja
  //         await updateDoc(productRef, {
  //           soldUnits: currentStock + item.currentNumber,
  //         });
  //       }
  //     }
  
  //     // Eliminar el producto de la caja
  //     await deleteDoc(doc(getFirestore(), path));
  
  //     console.log('Producto eliminado de la caja.');
  //   } catch (error) {
  //     console.error('Error al eliminar el producto de la caja:', error);
  //   }
  // }

  // async deleteBoxItem(pato2: string, item: ItemsDbAndTotalPrice, restoreInventory: boolean = true) {
  //   try {
  //     const user = this.auth.currentUser.uid;
  //     let path = `users/${user}/box/${item.idDoc}`;
  
  //     if (restoreInventory) {
  //       const productPath = pato2;
  //       const productRef = doc(getFirestore(), productPath);
  //       const productDoc = await getDoc(productRef);
  
  //       if (productDoc.exists()) {
  //         const data = productDoc.data();
  //         const currentStock = data['soldUnits'] || 0;
  
  //         await updateDoc(productRef, {
  //           soldUnits: currentStock + item.currentNumber,
  //         });
  //       }
  //     }
  
  //     await deleteDoc(doc(getFirestore(), path));
  //     console.log('Producto eliminado de la caja.');
  //   } catch (error) {
  //     console.error('Error al eliminar el producto de la caja:', error);
  //   }
  // }
  
  // async deleteBoxItem(userId: string, pathProduct: string, item: ItemsDbAndTotalPrice) {
  //   const productRef = doc(this.firestore, pathProduct);
  //   const boxRef = doc(this.firestore, `users/${userId}/box/${item.idDoc}`);
  
  //   try {
  //     await deleteDoc(boxRef); // Eliminar el producto de la caja
  //   } catch (error) {
  //     console.error('Error al eliminar de la caja:', error);
  //   }
  // }
  
  
  // async deleteBoxItem(userId: string, pathProduct: string, item: ItemsDbAndTotalPrice) {
  //   const productRef = doc(this.firestore, pathProduct);
  //   const boxRef = doc(this.firestore, `users/${userId}/box/${item.idDoc}`);
  
  //   try {
  //     // Eliminar el producto de la caja
  //     await deleteDoc(boxRef);
  
  //     // Restaurar el inventario sumando las unidades
  //     const productDoc = await getDoc(productRef);
  //     if (productDoc.exists()) {
  //       const currentData = productDoc.data();
  //       const currentStock = currentData['soldUnits'] || 0;
  //       await updateDoc(productRef, {
  //         soldUnits: currentStock + item.currentNumber,
  //       });
  //     }
  
  //     console.log('Producto eliminado y stock restaurado');
  //   } catch (error) {
  //     console.error('Error al eliminar de la caja:', error);
  //   }
  // }
  
  



  ////////////////////////////////////////////////////////////////////////////////////

  async reducirCantidad(path: string, decrement: number) {
    try {
      const productRef = doc(getFirestore(), path);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        console.log('El producto no existe');
        return;
      }

      // Obtener la cantidad actual de unidades vendidas (soldUnits)
      const data = productDoc.data();

      const soldUnitDb = data['soldUnits'] || 0;

      // Calcula la nueva cantidad después de la reducción
      const newSoldUnits = soldUnitDb - decrement;

      // Verifica que el stock no sea negativo
      if (newSoldUnits < 0) {
        console.log('No hay suficiente stock para reducir');
        return;
      }

      // Actualiza el valor de 'soldUnits' en Firestore
      await updateDoc(productRef, {
        soldUnits: newSoldUnits,
      });

      console.log('Cantidad de producto reducida exitosamente');
    } catch (error) {
      console.error('Error al reducir la cantidad del producto:', error);
    }
  }

  async aumetnarCnatidad2(pato2: string, idItem: ItemsDbAndTotalPrice) {
    try {
      const itemRef = doc(getFirestore(), pato2);
      const itemBox = await getDoc(itemRef);

      if (!itemBox.exists()) {
        console.log('El producto no existe');
        return;
      }

      const dataItem = itemBox.data();

      const soldUnitDbItem = dataItem['soldUnits'] || 0;

      await updateDoc(itemRef, {
        soldUnits: soldUnitDbItem + idItem.currentNumber,
      });

      console.log('Cantidad de producto reducida exitosamente');
    } catch (error) {
      console.error('Error al reducir la cantidad del producto:', error);
    }
  }
  /* -----END */

  //============================ AUTENTICACION ============================

  //obtner usuario actual
  obtenerUsuario() {
    return getAuth();
  }

  //metodo para acceder
  async login(user: User) {
    const usuario = await signInWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    ); // se loguea el usuario
    return usuario; // se retorna el usuario
  }

  //metodo para registrarse
  async registrarse(user: User) {
    const usuario = await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    ); // se registra el usuario
    return usuario; //  se retorna el usuario
  }

  //actualizar usuario
  async updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName }); // se actualiza el usuario
  }

  //Enviar correo de recuperacion de contraseña
  recuperarContrasena(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //cerrar sesion
  cerrarSesion() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/login');
  }

  //============================ BASE DE DATOS ============================
  //setear documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //OBTENER DOCUMENTO

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //agregar un documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //Obtener un documento de una coleccion
  getCollectionData(path: string, collectionquery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionquery), { idField: 'id' });
  }
  //actualizar documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //eliminar documento
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //============================ ALMACENAMIENTO ============================

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  //Obtener ruta de la imagen con su url
  async obtenerUrlImagen(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  //eliminar archivo
  async eliminarArchivo(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
