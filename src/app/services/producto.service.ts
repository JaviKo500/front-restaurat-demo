import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BASE_URL } from '../../environments/configurations';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url: string = BASE_URL;
  constructor(private http: HttpClient, private router: Router) { }

  //llamar desde cada uno de los recursos protegidos

  public getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url + 'productos');
  }

  public getAllProductosCliente(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url + 'productos/disponible');
  }

  //producto por id

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(this.url + 'producto/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  //producto por categorial
  getProductoByCategoria(id: number): Observable<Producto[]> {
    delay(5000)
    return this.http.get<Producto[]>(this.url + 'productos/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  //producto por categorialcliente
  getProductoByCategoriaCliente(id: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url + 'productos/categoria/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  //guardar un producto
  saveProducto(producto: Producto): Observable<Producto> {
    return this.http.post(this.url + 'productos', producto).pipe(
      map((response: any) => response.producto),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  //gurdar imagen productp
  saveImgProducto(archivo: File, id): Observable<Producto> {
    let formDataImg = new FormData();
    formDataImg.append('archivo', archivo);
    formDataImg.append('id', id);
    return this.http.post(this.url + 'producto/img/upload', formDataImg).pipe(
      map((response: any) => response.mensaje),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  //actulizar estado
  updateProductoEstado(producto: Producto): Observable<any> {
    return this.http.put<any>(this.url + 'producto/' + producto.id, producto).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  //eliminar producto
  deleteProducto(id: number): Observable<Producto> {
    return this.http.delete<Producto>(this.url + 'productos/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
}
