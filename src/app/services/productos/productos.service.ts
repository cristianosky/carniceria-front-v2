import { Injectable } from '@angular/core';
import { ApiService } from '../app.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private _appService: ApiService) { }

  getProducto(q?: string) {
    return this._appService.getQuery(`productos${q ? '?q=' + q : ''}`, 'get');
  }

  addProducto(producto: any) {
    return this._appService.getQuery('addproducto', 'post', producto);
  }

  updateProducto(producto: any, id: number) {
    return this._appService.getQuery(`productos/${id}`, 'put', producto);
  }

  deleteProducto(id: number) {
    return this._appService.getQuery(`productos/${id}`, 'delete');
  }

  getProductoAutoCompelte(q: string) {
    return this._appService.getQuery(`productos?q=${q}`, 'get').pipe(map((data: any) => data.map((producto: any) => producto)));
  }

  getInventario(q?:string) {
    return this._appService.getQuery(`inventario${q ? '?q=' + q : ''}`, 'get');
  }

  addInventario(inventario: any) {
    return this._appService.getQuery('addInventario', 'post', inventario);
  }

  updateInventario(inventario: any, id: number) {
    return this._appService.getQuery(`inventario/${id}`, 'put', inventario);
  }

  deleteInventario(id: number) {
    return this._appService.getQuery(`inventario/${id}`, 'delete');
  }

  addDetalleVenta(detalleVenta: any) {
    return this._appService.getQuery('addDetalleVenta', 'post', detalleVenta);
  }

  getDetalleFactura(id_ventas: any) {
    return this._appService.getQuery(`detalleVenta/${id_ventas}`, 'get');
  }

  eliminarDetalleVenta(id_ventas: any) {
    return this._appService.getQuery(`detalleVenta/${id_ventas}`, 'delete');
  }

  pagarVenta(id_ventas: any) {
    return this._appService.getQuery(`pagarVenta/${id_ventas}`, 'put');
  }
}
