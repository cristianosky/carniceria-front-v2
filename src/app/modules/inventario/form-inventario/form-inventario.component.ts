import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductosService } from '../../../services/productos/productos.service';


@Component({
  selector: 'app-form-inventario',
  templateUrl: './form-inventario.component.html',
  styleUrls: ['./form-inventario.component.scss']
})
export class FormInventarioComponent implements OnInit{
  isLoading = false;
  myControl = new FormControl('', [Validators.required]);
  formInventario: FormGroup;
  filteredOptions!: Observable<any[]>;
  unidadDeMedida: string = '';

  constructor(
    private fb: FormBuilder,
    private _ProductoService: ProductosService,
    private currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<FormInventarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formInventario = this.fb.group({
        id_producto: [null],
        cantidad: [ data ? data.cantidad : null, [Validators.required]],
        precio_unitario: [ data ? data.precio_unitario : '', [Validators.required]],
      });
    }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((value) => {
        return this._ProductoService.getProductoAutoCompelte(typeof value == 'object' ? '' : value || '') 
      })
    );
  }

  displayFn(option:any): string {
    this.unidadDeMedida = option.unidad_medida;
    return option ? `${option.nombre_producto}` : '';
  }

  guardar() {
    const value : any = this.myControl.value;
    this.formInventario.patchValue({id_producto: value.id_producto});
    if(this.formInventario.invalid) {
      return;
    }
    
    this.isLoading = true;
    this._ProductoService.addInventario(this.formInventario.value).subscribe((data: any) => {
      this.isLoading = false;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Inventario creado con exito!',
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

  update() {}

}
