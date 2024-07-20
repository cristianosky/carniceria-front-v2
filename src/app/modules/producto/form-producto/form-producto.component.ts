import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ProductosService } from '../../../services/productos/productos.service';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.scss']
})
export class FormProductoComponent implements OnInit {

  formProducto: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private _ProductosService: ProductosService, 
    public dialogRef: MatDialogRef<FormProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    this.formProducto = this.fb.group({
      nombre_producto: [ data ? data.nombre_producto : '', [Validators.required, Validators.maxLength(50)]],
      categoria: [ data ? data.categoria : '', [Validators.required, Validators.maxLength(50)]],
      unidad_medida: [ data ? data.unidad_medida : '', [Validators.required, Validators.maxLength(50)]],
      comentario: [ data ? data.comentario : '', [Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
  }

  guardar() {
    if(this.formProducto.invalid) {
      return;
    }
    this.isLoading = true;
    this._ProductosService.addProducto(this.formProducto.value).subscribe((res: any) => {
      this.isLoading = false;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Producto creado con exito!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
      this.dialogRef.close();
    }, (err) => {
      console.error(err);
      this.isLoading = false;
    });
  }

  update() {
    if(this.formProducto.invalid) {
      return;
    }
    this.isLoading = true;
    this._ProductosService.updateProducto(this.formProducto.value, this.data.id_producto).subscribe((res: any) => {
      this.isLoading = false;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Producto actualizado con exito!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
      this.dialogRef.close();
    }, (err) => {
      console.error(err);
      this.isLoading = false;
    });
  }
}
