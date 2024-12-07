// import { Injectable } from '@angular/core';
// import { jsPDF } from 'jspdf';
// import { ItemsDbAndTotalPrice } from '../pages/main/caja/caja.page';
// import 'jspdf-autotable'; // Importar autoTable

// @Injectable({
//   providedIn: 'root',
// })
// export class PdfService {
//   constructor() {}

//   private companyData = {
//     nombre: 'Dina',
//     ruc: '235343263SDT2342',
//     direccion: 'Av Manog DB 123',
//     email: 'dina@gmail.com',
//     web: 'www.dina.com',
//   };

//   generateReport(data: ItemsDbAndTotalPrice[], precioTotal: number) {
//     // Crear una nueva instancia de jsPDF
//     const doc = new jsPDF();

//     // Agregar el logo de la empresa, nombre y detalles
//     doc.setFontSize(16);
//     doc.text(this.companyData.nombre, 20, 20);
//     doc.setFontSize(10);
//     doc.text(`RUC: ${this.companyData.ruc}`, 20, 30);
//     doc.text(`Dirección: ${this.companyData.direccion}`, 20, 35);
//     doc.text(`Email: ${this.companyData.email}`, 20, 40);
//     doc.text(`Web: ${this.companyData.web}`, 20, 45);

//     // Salto de línea para separar la cabecera de la lista de productos
//     doc.setFontSize(14);
//     doc.text('Reporte de Productos', 20, 60);

//     // Cabecera de la tabla de productos
//     const headers = [
//       'Orden', // Nueva columna de orden
//       'Producto',
//       'Proveedor',
//       'Talla',
//       'Ubicación Estante',
//       'Cantidad', // Nueva columna de cantidad
//       'Precio Unitario',
//       'Precio Total',
//     ];

//     // Mapeo de los datos con número de orden y currentNumber
//     const productData = data.map((item, index) => [
//       index + 1, // Números de orden
//       item.name,
//       item.proveedor,
//       item.talla,
//       item.ubicacionEstante,
//       item.currentNumber, // Columna de cantidad
//       `$${item.price.toFixed(2)}`,
//       `$${item.precioTotal.toFixed(2)}`,
//     ]);

//     // Dibujar la tabla con autoTable
//     (doc as any).autoTable({
//       head: [headers],
//       body: productData,
//       startY: 70,
//       margin: { top: 10 },
//       theme: 'grid', // Puedes usar 'striped' si prefieres un diseño en rayas
//     });

//     // Agregar precio total
//     doc.setFontSize(12);
//     doc.text(`Precio Total: $${precioTotal.toFixed(2)}`, 20, 10);

//     // Generar el PDF
//     doc.save('reporte_productos.pdf');
//   }
// }
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ItemsDbAndTotalPrice } from '../pages/main/caja/caja.page';
import 'jspdf-autotable'; // Importar autoTable

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';


@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() { }

  private companyData = {
    logo: 'assets/icon/dina.png',
    nombre: 'Bernardina Soto Allcca',
    ruc: '235343263SDT2342',
    direccion: 'Mercado Modelo de Andahuaylas 2° piso puesto 54',
    email: 'dina@gmail.com',
    web: 'www.dina.com',
    fecha_de_emision: new Date().toLocaleDateString(),
    hora_de_emision: new Date().toLocaleTimeString(),
  };

  // generateReport(data: ItemsDbAndTotalPrice[], precioTotal: number) {
  //   // Crear una nueva instancia de jsPDF
  //   const doc = new jsPDF();

  //   // Agregar el logo de la empresa, nombre y detalles
  //   doc.setFontSize(16);
  //   //agregar logo
  //   doc.addImage(this.companyData.logo, 'PNG', 20, 20, 50, 50);
  //   doc.text(this.companyData.nombre, 20, 20);
  //   doc.setFontSize(10);
  //   doc.text(`RUC: ${this.companyData.ruc}`, 20, 30);
  //   doc.text(`Dirección: ${this.companyData.direccion}`, 20, 35);
  //   doc.text(`Email: ${this.companyData.email}`, 20, 40);
  //   doc.text(`Web: ${this.companyData.web}`, 20, 45);

  //   // Salto de línea para separar la cabecera de la lista de productos
  //   doc.setFontSize(14);
  //   doc.text('Reporte de Productos', 20, 60);

  //   // Cabecera de la tabla de productos
  //   const headers = [
  //     'Orden', // Nueva columna de orden
  //     'Producto',
  //     'Proveedor',
  //     'Talla',
  //     'Ubicación Estante',
  //     'Cantidad', // Nueva columna de cantidad
  //     'Precio Unitario',
  //     'Precio Total',
  //   ];

  //   // Mapeo de los datos con número de orden y currentNumber
  //   const productData = data.map((item, index) => [
  //     index + 1, // Números de orden
  //     item.name,
  //     item.proveedor,
  //     item.talla,
  //     item.ubicacionEstante,
  //     item.currentNumber, // Columna de cantidad
  //     `S/ ${item.price.toFixed(2)}`,
  //     `S/ ${item.precioTotal.toFixed(2)}`, // Precio Total de cada producto
  //   ]);

  //   // Dibujar la tabla con autoTable
  //   (doc as any).autoTable({
  //     head: [headers],
  //     body: productData,
  //     startY: 70,
  //     margin: { top: 10 },
  //     theme: 'grid', // Puedes usar 'striped' si prefieres un diseño en rayas
  //     didDrawPage: function (data) {
  //       // Obtener la posición Y final de la tabla
  //       const yPosition = data.cursor.y;
  //       // Agregar el precio total global después de la tabla
  //       doc.setFontSize(12);
  //       doc.text(
  //         `Precio Total Global: S/ ${precioTotal.toFixed(2)}`,
  //         20,
  //         yPosition + 10
  //       );
  //     },
  //   });

  //   // Generar el PDF
  //   doc.save('reporte_productos.pdf');
  // }

  //////////////////////////////////11111111111111111111111111111111111111111111111111111111

  // generateReport(data: ItemsDbAndTotalPrice[], precioTotal: number) {
  //   // Crear una nueva instancia de jsPDF
  //   const doc = new jsPDF();

  //   // Agregar el logo en la esquina superior derecha
  //   const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
  //   doc.addImage(this.companyData.logo, 'PNG', pageWidth - 70, 10, 50, 50); // Ajustar posición del logo

  //   // Agregar el nombre de la empresa y otros detalles
  //   doc.setFontSize(16);
  //   doc.text(this.companyData.nombre, 20, 20);
  //   doc.setFontSize(10);
  //   doc.text(`RUC: ${this.companyData.ruc}`, 20, 30);
  //   doc.text(`Dirección: ${this.companyData.direccion}`, 20, 35);
  //   doc.text(`Email: ${this.companyData.email}`, 20, 40);
  //   doc.text(`Web: ${this.companyData.web}`, 20, 45);
  //   doc.text(`Fecha de Emisión: ${this.companyData.fecha_de_emision}`, 20, 50);
  //   doc.text(`Hora de Emisión: ${this.companyData.hora_de_emision}`, 20, 55);

  //   // Salto de línea para separar la cabecera de la lista de productos
  //   doc.setFontSize(18);
  //   doc.text('Reporte de Productos', 20, 65);

  //   // Cabecera de la tabla de productos
  //   const headers = [
  //     'Orden',
  //     'Producto',
  //     'Proveedor',
  //     'Talla',
  //     'Ubicación Estante',
  //     'Cantidad',
  //     'Precio Unitario',
  //     'Precio Total',
  //   ];

  //   // Mapeo de los datos con número de orden y currentNumber
  //   const productData = data.map((item, index) => [
  //     index + 1,
  //     item.name,
  //     item.proveedor,
  //     item.talla,
  //     item.ubicacionEstante,
  //     item.currentNumber,
  //     `S/ ${item.price.toFixed(2)}`,
  //     `S/ ${item.precioTotal.toFixed(2)}`,
  //   ]);

  //   // Dibujar la tabla con autoTable
  //   (doc as any).autoTable({
  //     head: [headers],
  //     body: productData,
  //     startY: 70,
  //     margin: { top: 10 },
  //     theme: 'grid',
  //     didDrawPage: function (data) {
  //       const yPosition = data.cursor.y;
  //       doc.setFontSize(12);
  //       doc.text(
  //         `Precio Total Global: S/ ${precioTotal.toFixed(2)}`,
  //         20,
  //         yPosition + 10
  //       );
  //     },
  //   });

  //   // Generar el PDF
  //   doc.save('reporte_productos.pdf');
  // }

  ///////////////////////////////////111111111111111111111111111111111111111111111

  async generateReport(data: ItemsDbAndTotalPrice[], precioTotal: number) {

    try {
      // Crear una nueva instancia de jsPDF
      const doc = new jsPDF();

      // Agregar el logo en la esquina superior derecha
      const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
      doc.addImage(this.companyData.logo, 'PNG', pageWidth - 70, 10, 50, 50); // Ajustar posición del logo

      // Agregar el nombre de la empresa y otros detalles
      doc.setFontSize(16);
      doc.text(this.companyData.nombre, 20, 20);
      doc.setFontSize(10);
      doc.text(`RUC: ${this.companyData.ruc}`, 20, 30);
      doc.text(`Dirección: ${this.companyData.direccion}`, 20, 35);
      doc.text(`Email: ${this.companyData.email}`, 20, 40);
      doc.text(`Web: ${this.companyData.web}`, 20, 45);
      doc.text(`Fecha de Emisión: ${this.companyData.fecha_de_emision}`, 20, 50);
      doc.text(`Hora de Emisión: ${this.companyData.hora_de_emision}`, 20, 55);

      // Salto de línea para separar la cabecera de la lista de productos
      doc.setFontSize(18);
      doc.text('Reporte de Salida de Productos', 20, 65);

      // Cabecera de la tabla de productos
      const headers = [
        'Orden',
        'Producto',
        'Proveedor',
        'Talla',
        'Ubicación Estante',
        'Cantidad',
        'Precio Unitario',
        'Precio Total',
      ];

      // Mapeo de los datos con número de orden y currentNumber
      const productData = data.map((item, index) => [
        index + 1,
        item.name,
        item.proveedor,
        item.talla,
        item.ubicacionEstante,
        item.currentNumber,
        `S/ ${item.price.toFixed(2)}`,
        `S/ ${item.precioTotal.toFixed(2)}`,
      ]);

      // Dibujar la tabla con autoTable
      (doc as any).autoTable({
        head: [headers],
        body: productData,
        startY: 70,
      });

      // Generar el PDF
      doc.setFontSize(12);
      doc.text(`Precio Total Global: S/ ${precioTotal.toFixed(2)}`, 20, doc.internal.pageSize.getHeight() - 10);

      const pdfBlob = doc.output('blob');
      const info = await Device.getInfo();

      if(info.platform === 'web'){
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      }else if(info.platform === 'android' || info.platform === 'ios'){
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(',')[1]; // Obtener el contenido del archivo

          if (base64data){
            const fileName= `reporte_productos_${Date.now()}.pdf`;

            await Filesystem.writeFile({
              path: fileName,
              data: base64data,
              directory: Directory.Documents,
            });

            await Toast.show({
              text: "Archivo guardado como ${fileName}",
              duration: 'long',
            });

            const fileUri = await Filesystem.getUri({
              path: fileName, // Ruta del archivo
              directory: Directory.Documents, // Directorio donde se encuentra el archivo
            })

            await Share.share({
              title: 'Compartir reporte',
              text: 'Aquí está el reporte de tu venta electrónica.',
              url: fileUri.uri, // URL del archivo
              dialogTitle: 'Compartir con:', // Título del diálogo de compartir
            });
          }
        };
      }

    }catch(error){
      console.log('Error al generar el reporte:',error);

      await Toast.show({
        text: "Error al guardar el reporte.",
        duration: 'long', // Tiempo de visualización del mensaje de error
      });

    }

    



  }


}
