import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos/productos.service';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {
  productos: any = [];
  busqueda: FormControl = new FormControl('', [Validators.maxLength(50)]);
  isDivVisible:boolean = false;
  fecha = new Date();
  factura: any = JSON.parse(localStorage.getItem('factura') || '{}');
  productosFactura: any[] = [];

  constructor(private _ProductService: ProductosService) {
    this.busqueda.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.getInventario(value);
    });
  }

  ngOnInit(): void {
    this.getInventario();
    if(this.factura) {
      this.obtenerDetalleFactura(this.factura.id_venta);
    }
  }

  getInventario(q?:string) {
    this._ProductService.getInventario(q).subscribe((res: any) => {
      this.productos = res;
    }, (err) => {
      console.error(err)
    });
  }

  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
  }

  obtenerDetalleFactura(id_ventas:any) {
    this._ProductService.getDetalleFactura(id_ventas).subscribe((res:any) => {
      this.productosFactura = res;
    }, (err) => {
      console.error(err);
    });
  }

  async agregarProducto(producto:any) {
    const { value } = await Swal.fire({
      input: "text",
      inputLabel: `Agregar Cantidad (${producto.unidad_medida == 'lb' ? 'Libras' : 'Kilos'})`,
      inputPlaceholder: "5",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Agregar",
      inputValidator: (value:any) => {
        if (!value) {
          return "Debes ingresar una cantidad";
        }
        if (isNaN(Number(value))) {
          return "Debes ingresar un número";
        }
        if (parseInt(value) <= 0) {
          return "Debes ingresar un número mayor a 0";
        }
        return null;
      },
    });

    if (!value) {
      return;
    }

    let body = {
      id_venta: this.factura.id_venta || null,
      id_producto: producto.id_producto,
      cantidad: value,
      precio_unitario: producto.precio_unitario,
      id_inventario: producto.id_inventario
    }

    this._ProductService.addDetalleVenta(body).subscribe((res:any) => {
      this.productosFactura.push({
        cantidad: value,
        id_detalle: res.id_detalle_venta,
        id_producto: producto.id_producto,
        id_venta: this.factura?.id_venta || null,
        nombre_producto: producto.nombre_producto,
        precio_unitario: producto.precio_unitario,
        subtotal: Number(producto.precio_unitario) * Number(value)
      })

      // actualizar la cantidad en el inventario
      let inventario = this.productos.find((prod: any) => prod.id_producto == producto.id_producto);
      inventario.cantidad -= value;

      this.factura.total_venta = this.productosFactura.reduce((acc, producto) => acc + producto.subtotal, 0);


      if(res.venta){
        this.factura = res.venta;
      }
      localStorage.setItem('factura', JSON.stringify(this.factura));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Agregado con exito!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      })
    }, (err) => {
      console.error(err);
    });
    
    
  }

  eliminarProducto(detalle: any) {
    Swal.fire({
      title: `¿Estas seguro que deseas eliminar este producto?`,
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._ProductService.eliminarDetalleVenta(detalle.id_detalle).subscribe((res: any) => {
          this.productosFactura = this.productosFactura.filter((producto: any) => producto.id_detalle != detalle.id_detalle);
          if(res.deleteVenta){
            localStorage.removeItem('factura');
            this.factura = {};
            this.isDivVisible = false;
          }
          this.factura.total_venta = this.productosFactura.reduce((acc, producto) => acc + producto.subtotal, 0);
          localStorage.setItem('factura', JSON.stringify(this.factura));

          let producto = this.productos.find((prod: any) => prod.id_producto == detalle.id_producto);
          producto.cantidad += Number(detalle.cantidad);
          
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: '¡Producto eliminado con exito!',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
              popup: 'colored-toast'
            }
          });
        }, (err) => {
          console.error(err);
          Swal.fire(
            'Error!',
            'Ha ocurrido un error al borrar el producto.',
            'error'
          )
        });
      }
    })
  }

  pagarVenta() {
    this._ProductService.pagarVenta(this.factura.id_venta).subscribe((res: any) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Venta pagada con exito!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
      localStorage.removeItem('factura');
      this.factura = {};
      this.productosFactura = [];
      this.isDivVisible = false;
    }, (err) => {
      console.error(err);
      Swal.fire(
        'Error!',
        'Ha ocurrido un error al pagar la venta.',
        'error'
      )
    });
  }

}
