import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { PdfService } from 'src/app/services/pdf.service';
import jsPDF from 'jspdf';

// Interfaces
export interface ItemsDb {
  idDoc: string;
  id: string;
  currentNumber: number;
  proveedor: string;
  soldUnits: number;
  talla: string;
  ubicacionEstante: string;
  name: string;
  ubicacionSeccion: string;
  genero: string;
  price: number;
  image: string;
}

export interface ItemsDbAndTotalPrice extends ItemsDb {
  precioTotal: number;
}

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {
  firebaseSvc = inject(FirebaseService); // cargamos el servicio de firebase
  utilsSvc = inject(UtilsService); // cargamos el servicio de utils
  private _pdfService = inject(PdfService);

  items: ItemsDbAndTotalPrice[] | null = null;
  totalPrice: number = 0; // Total del carrito

  constructor() {
    this.gettinItems();
  }

  gettinItems() {
    this.firebaseSvc.gittingBoxWithIdUser().subscribe({
      next: (data) => {
        // Mapeamos los items y calculamos el precio total de cada uno
        this.items = data.map((item) => {
          const precioTotal = item.price * item.currentNumber;
          return { ...item, precioTotal };
        });

        // Calculamos el precio total de todos los items
        this.totalPrice = this.items.reduce(
          (sum, item) => sum + item.precioTotal,
          0
        );

        console.log(this.items);
        console.log('Precio Total: ', this.totalPrice);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {}

  // Método para obtener el usuario actual
  user(): User {
    return this.utilsSvc.obtenerDeLocalStorage('user');
  }

  async deleteBoxItem(item: ItemsDbAndTotalPrice) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let pathBox = `users/${this.user().uid}/box/${item.idDoc}`;
    let pathProduct = `users/${this.user().uid}/productos/${item.id}`;

    this.firebaseSvc
      // .deleteBoxItem(pathBox, pathProduct, item)
      .deleteBoxItem(pathProduct, item)
      .then(async (res) => {
        console.log('res', res);
        this.gettinItems();
        loading.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
      });
  }

  async deleteBoxItem2(item: ItemsDbAndTotalPrice) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let pathBox = `users/${this.user().uid}/box/${item.idDoc}`;
    let pathProduct = `users/${this.user().uid}/productos/${item.id}`;

    this.firebaseSvc
      // .deleteBoxItem(pathBox, pathProduct, item)
      .deleteBoxItem2(pathProduct, item)
      .then(async (res) => {
        console.log('res', res);
        this.gettinItems();
        loading.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
      });
  }


  // async deleteBoxItem(item: ItemsDbAndTotalPrice) {
  //   const loading = await this.utilsSvc.loading();
  //   await loading.present();
  
  //   const userId = this.user().uid; // Obtenemos el userId
  //   const pathProduct = `users/${userId}/productos/${item.id}`;
  
  //   this.firebaseSvc
  //     .deleteBoxItem(userId, pathProduct, item) // Pasamos el userId
  //     .then(() => {
  //       this.gettinItems();
  //       loading.dismiss();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       loading.dismiss();
  //     });
  // }
  




  ////////////////////////////////////////////////////////////////////////////////////
  // Función para generar el reporte
  // generateReport() {
  //   if (!this.items || this.items.length === 0) {
  //     this.utilsSvc.presentToast({
  //       message: 'El carrito está vacío.',
  //       duration: 2000,
  //     });
  //     return;
  //   }

  //   // lllamar serviio
  //   this._pdfService.generateReport(this.items, this.totalPrice);
  // }


  ////////////////////////11111111111

  async generateReport() {
    if (!this.items || this.items.length === 0) {
      this.utilsSvc.presentToast({
        message: 'El carrito está vacío.',
        duration: 2000,
      });
      return;
    }
  
    // Generar el reporte
    this._pdfService.generateReport(this.items, this.totalPrice);
  
    // Mostrar un mensaje de confirmación
    this.utilsSvc.presentToast({
      message: 'Reporte generado correctamente. Limpiando caja...',
      duration: 3000,
    });
  
    // Mostrar el loading spinner
    const loading = await this.utilsSvc.loading(); // Esperamos a que la promesa se resuelva
    await loading.present(); // Presentamos el spinner
  
    // Eliminar los productos de la caja
    const deletePromises = this.items.map((item) => {
      const pathProduct = `users/${this.user().uid}/productos/${item.id}`;
      return this.firebaseSvc.deleteBoxItem(pathProduct, item);
    });
  
    try {
      await Promise.all(deletePromises); // Esperamos a que todas las promesas se resuelvan
      this.items = [];
      this.totalPrice = 0;
      this.utilsSvc.presentToast({
        message: 'Productos eliminados de la caja.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al eliminar productos: ', error);
      this.utilsSvc.presentToast({
        message: 'Error al eliminar productos.',
        duration: 3000,
      });
    } finally {
      loading.dismiss(); // Cerramos el spinner
    }
  }


  // async generateReport() {
  //   if (!this.items || this.items.length === 0) {
  //     this.utilsSvc.presentToast({
  //       message: 'El carrito está vacío.',
  //       duration: 2000,
  //     });
  //     return;
  //   }
  
  //   // Crear el documento PDF
  //   const doc = new jsPDF();
  //   doc.text("Reporte de Compras", 20, 20);
  //   this.items.forEach((item, index) => {
  //     doc.text(`${item.name} - ${item.currentNumber} x ${item.price}`, 20, 30 + index * 10);
  //   });
  
  //   // Obtener el PDF como un Blob
  //   const pdfBlob = doc.output('blob'); // Obtener el PDF como un Blob
  
  //   // Crear una URL temporal para el Blob
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  
  //   // Abrir el PDF en una nueva ventana (esto redirige al navegador)
  //   window.open(pdfUrl, '_blank'); // Esto abrirá el PDF en una nueva pestaña del navegador
  
  //   // Mostrar un mensaje de confirmación
  //   this.utilsSvc.presentToast({
  //     message: 'Reporte generado correctamente.',
  //     duration: 3000,
  //   });
  // }
  



  //////////

  
  // async generateReport() {
  //   if (!this.items || this.items.length === 0) {
  //     this.utilsSvc.presentToast({
  //       message: 'El carrito está vacío.',
  //       duration: 2000,
  //     });
  //     return;
  //   }
  
  //   // Generar el reporte
  //   this._pdfService.generateReport(this.items, this.totalPrice);
  
  //   const loading = await this.utilsSvc.loading();
  //   await loading.present();
  
  //   try {
  //     const userId = this.user().uid;
  
  //     const deletePromises = this.items.map((item) => {
  //       const pathProduct = `users/${userId}/productos/${item.id}`;
  //       return this.firebaseSvc.deleteBoxItem(userId, pathProduct, item);
  //     });
  
  //     await Promise.all(deletePromises);
  
  //     this.items = [];
  //     this.totalPrice = 0;
  
  //     this.utilsSvc.presentToast({
  //       message: 'Reporte generado y productos eliminados.',
  //       duration: 3000,
  //     });
  //   } catch (error) {
  //     console.error('Error al generar el reporte o eliminar productos:', error);
  //     this.utilsSvc.presentToast({
  //       message: 'Error al eliminar productos.',
  //       duration: 3000,
  //     });
  //   } finally {
  //     loading.dismiss();
  //   }
  // }
  
  

}
