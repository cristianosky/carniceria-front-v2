import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { FormProductoComponent } from './form-producto/form-producto.component';
import { ProductosService } from '../../services/productos/productos.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  
  busqueda: FormControl = new FormControl('', [Validators.maxLength(50)]);
  displayedColumns: string[] = ['position', 'nombre_producto', 'categoria', 'unidad_medida', 'fecha_ingreso', 'comentario', 'actions'];
  dataSource:any = [];


  constructor(private _dialog: MatDialog, private _ProductService: ProductosService) { }

  ngOnInit(): void {
    this.busqueda.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.getProducto(value);
    });

    this.getProducto();
  }

  openDialog(data?: any) {
    this._dialog.open(FormProductoComponent, {
      width: '500px',
      panelClass: 'custom-class',
      data
    }).afterClosed().subscribe(() => {
      this.getProducto();
    });
  }

  getProducto(q?: string) {
    this._ProductService.getProducto(q).subscribe((res: any) => {
      this.dataSource = res;      
    }, (err) => {
      console.error(err)
    });
  }

  deleteProducto(elemt: any) {
    Swal.fire({
      title: `¿Estas seguro que deseas eliminar ${elemt.nombre_producto}?`,
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._ProductService.deleteProducto(elemt.id_producto).subscribe((res: any) => {
          this.getProducto();
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

}
