import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-producto',
  templateUrl: './add-update-producto.component.html',
  styleUrls: ['./add-update-producto.component.scss'],
})
export class AddUpdateProductoComponent  implements OnInit {

  @Input() producto: Product;

  form= new FormGroup({
    ///
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    proveedor: new FormControl('', [Validators.required]),
    price: new FormControl(null,[Validators.required,Validators.min(0)]),
    ubicacionSeccion: new FormControl('', [Validators.required]),
    ubicacionEstante: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    soldUnits : new FormControl(null,[Validators.required,Validators.min(0)]), 
    talla : new FormControl(null,[Validators.required,Validators.min(0)]),
  })

  firebaseSvc=inject(FirebaseService);
  utilsSvc=inject(UtilsService);

  ///
  user= {} as User;

  constructor() { }

  ngOnInit() {
    ///
    this.user=this.utilsSvc.obtenerDeLocalStorage('user');

    if(this.producto) this.form.setValue(this.producto);

  }

  ////Tomar/Seleccionar Foto
  async takeImage(){
    const dataUrl= (await this.utilsSvc.takePicture('Imagen de producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }
  
  ///
  ingresar(){
    if (this.form.valid){
      if (this.producto) this.actualizarproducto();
      else this.crearproducto();
    }

  }

  //Convertir valores de tipo string a number
  setNumberInputs(){
    let {soldUnits,price} = this.form.controls;

    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if(price.value) price.setValue(parseFloat(price.value));
  }
  
  //// CREAR producto
  async crearproducto(){
    
      ///
      let path = `users/${this.user.uid}/productos`;
      ///
      
      const loading= await this.utilsSvc.loading(); 
      await loading.present(); 

      
      ///
      let dataUrl=this.form.value.image;
      let imagePath=`${this.user.uid}/${Date.now()}`;
      let imageUrl= await this.firebaseSvc.uploadImage(imagePath,dataUrl);
      this.form.controls.image.setValue(imageUrl);
      delete this.form.value.id;
      ///



      this.firebaseSvc.addDocument(path,this.form.value).then(async res =>{

        this.utilsSvc.dismissmodal({success:true});
        
        this.utilsSvc.presentToast({
          message: 'Producto agregado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
        
      }).catch(err =>{ 
        console.log(err); 

        this.utilsSvc.presentToast({
          message: 'Usuario o contraseña incorrectos',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
      }).finally(() =>{ 
        loading.dismiss();
      })
    
  }

  //// Actualizar producto

  async actualizarproducto(){
    
      ///
      let path = `users/${this.user.uid}/productos/${this.producto.id}`;
      ///
      
      const loading= await this.utilsSvc.loading(); 
      await loading.present(); 

      
      ///Si cambio la imagen,subir la nueva y obtener la url
      if(this.form.value.image !== this.producto.image){

        let dataUrl=this.form.value.image;
        let imagePath= await this.firebaseSvc.obtenerUrlImagen(this.producto.image)
        let imageUrl= await this.firebaseSvc.uploadImage(imagePath,dataUrl);
        this.form.controls.image.setValue(imageUrl);

      }

      delete this.form.value.id;
      ///



      this.firebaseSvc.updateDocument(path,this.form.value).then(async res =>{

        this.utilsSvc.dismissmodal({success:true});
        
        this.utilsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
        
      }).catch(err =>{ 
        console.log(err); 

        this.utilsSvc.presentToast({
          message: 'Usuario o contraseña incorrectos',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
      }).finally(() =>{ 
        loading.dismiss();
      })
    
  }


}
