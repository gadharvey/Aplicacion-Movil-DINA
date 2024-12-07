import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductoComponent } from 'src/app/util/componente/add-update-producto/add-update-producto.component';
import { orderBy, where } from 'firebase/firestore';
// import { AddCajaComponent } from 'src/app/util/componente/add-caja/add-caja.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService); // cargamos el servicio de firebase
  utilsSvc = inject(UtilsService); // cargamos el servicio de utils

  productos: Product[] = [];
  loading: boolean = false;

  /////
  box: Product[] = []; // Lista de productos en la caja

  conta;

  constructor() {}

  ngOnInit() {}

  user(): User {
    return this.utilsSvc.obtenerDeLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProductos();
  }

  //refrescar
  doRefresh(event) {
    setTimeout(() => {
      this.getProductos();
      event.target.complete();
    }, 1000);
  }

  //Obtener Ganancias

  getGanancias() {
    return this.productos.reduce(
      (index, productos) => index + productos.price * productos.soldUnits,
      0
    );
  }

  //Obtener Productos
  getProductos() {
    let path = `users/${this.user().uid}/productos`;

    //
    this.loading = true;

    let query = [
      orderBy('soldUnits', 'desc'),
      // where('soldUnits','>',30)
    ];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.productos = res;

        this.loading = false;

        sub.unsubscribe();
      },
    });
  }

  //agregar o actualizar producto
  async addUpdateProducto(producto?: Product) {
    let recargar = await this.utilsSvc.presentModal({
      component: AddUpdateProductoComponent,
      cssClass: 'add-update-producto',
      componentProps: { producto },
    });

    if (recargar) this.getProductos();
  }

  //confirmacion de alerta
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres borrar el producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteproducto(product);
          },
        },
      ],
    });
  }

  //eliminar producto

  async deleteproducto(producto: Product) {
    ///
    let path = `users/${this.user().uid}/productos/${producto.id}`;
    ///

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.obtenerUrlImagen(producto.image);
    await this.firebaseSvc.eliminarArchivo(imagePath);

    this.firebaseSvc
      .deleteDocument(path)
      .then(async (res) => {
        this.productos = this.productos.filter((p) => p.id !== producto.id);

        this.utilsSvc.presentToast({
          message: 'Producto eliminado  exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .catch((err) => {
        console.log(err);

        this.utilsSvc.presentToast({
          message: 'Usuario o contraseña incorrectos',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  ///////////////

  increment(product: Product) {
    if (!product.currentNumber) {
      product.currentNumber = 0;
    }

    if (product.currentNumber < product.soldUnits) {
      product.currentNumber++;
      this.conta = product.currentNumber;
      console.log(this.conta);
    }
  }

  decrement(product: Product) {
    if (product.currentNumber && product.currentNumber > 0) {
      product.currentNumber--;
      this.conta = product.currentNumber;
      console.log(this.conta);
    }
  }

  async addToBox(product: any) {
    if (product.currentNumber > 0) {
      let path = `users/${this.user().uid}/box`;

      await this.firebaseSvc.addItemToBox(product, path);
      console.log('added');

      this.reducirCantidad(product);
    } else {
      console.log(
        'Por favor, seleccione una cantidad antes de agregar el producto.'
      );
    }
  }

  // addToBox(product: Product) {
  //   if (product.currentNumber && product.currentNumber > 0) {
  //     // Verificar si el producto ya está en la caja
  //     const existingProduct = this.box.find(p => p.id === product.id);

  //     if (existingProduct) {
  //       // Actualiza la cantidad si el producto ya existe en la caja
  //       existingProduct.currentNumber += product.currentNumber;
  //     } else {
  //       // Clona el producto con la cantidad actual y lo agrega a la caja
  //       this.box.push({ ...product });
  //     }

  //     // Reinicia el contador del producto en la lista principal
  //     product.currentNumber = 0;
  //   } else {
  //     alert('Seleccione una cantidad antes de agregar el producto a la caja.');
  //   }
  // }

  async reducirCantidad(producto: Product) {
    if (producto.currentNumber > 0) {
      let path = `users/${this.user().uid}/productos/${producto.id}`;

      await this.firebaseSvc.reducirCantidad(path, producto.currentNumber);

      this.getProductos();
    }

    // sevicipo de recudcir el prodcuto
  }
}
