import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormInventarioComponent } from './form-inventario/form-inventario.component';
import Swal from 'sweetalert2';
import { debounceTime } from 'rxjs';
import { ProductosService } from '../../services/productos/productos.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  busquedaInventario: FormControl = new FormControl('', [Validators.maxLength(50)]);
  displayedColumnsInventario: string[] = ['position', 'nombre_producto', 'cantidad', 'precio_unitario', 'fecha_ingreso', 'actions'];
  dataInventario:any = [];

  constructor(private _dialog: MatDialog, private _ProductService: ProductosService) { }

  ngOnInit(): void {
    this.busquedaInventario.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.getInventario(value);
    });

    this.getInventario();
  }

  getInventario(q?:string) {
    this._ProductService.getInventario(q).subscribe((res: any) => {
      this.dataInventario = res;
    }, (err) => {
      console.error(err)
    });
  }


  openDialogInvenraio(data?: any) {
    this._dialog.open(FormInventarioComponent, {
      width: '500px',
      panelClass: 'custom-class',
      data
    }).afterClosed().subscribe(() => {
      this.getInventario();
    });
  }

  deleteInventario(elemt: any) {
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
        this._ProductService.deleteInventario(elemt.id_inventario).subscribe((res: any) => {
          this.getInventario();
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
