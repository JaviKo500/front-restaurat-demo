import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Pedido } from '../models/pedido';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Estado } from '../models/estado';
import { AuthService } from './auth.service';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  url: string = BASE_URL;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAllPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url + 'pedidos').pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getAllEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.url + 'estado').pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getPedidoFecha(fecha: Date): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url + 'pedidos/' + fecha).pipe(
      map((response: any) => response.pedidos as Pedido[]),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    )
  }

  getPedidoId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(this.url + 'pedido/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getClientePedidoId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(this.url + 'cliente/pedido/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  guardarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post(this.url + 'pedido', pedido).pipe(
      map((response: any) => response.pedido as Pedido),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  actualizarEstado(pedido: Pedido, tipoPago: string): Observable<any> {
    let username = localStorage.getItem("username");

    if (username != null) {
      return this.http.put<any>(this.url + 'pedido/estado/' + username + '/' + tipoPago, pedido).pipe(
        catchError(e => {
          if (e.status == 423) {
            this.authService.logout();
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
    } else {
      this.authService.logout();
    }
  }

  actualizarAnularPedido(pedido: Pedido): Observable<any> {
    return this.http.put<any>(this.url + 'pedido/estado/anular/' + pedido.id, pedido).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getEstatusPedido(id: number): Observable<any> {
    return this.http.get<any>(`${this.url + 'estado/pedido'}/${id}`).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    );
  }

}
