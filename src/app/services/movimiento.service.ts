import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MovimientoCaja } from '../models/movimientoCaja';
import { catchError, map } from 'rxjs/operators';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  url: string = BASE_URL;
  constructor(private http: HttpClient) { }

  public getMovimientosFecha(fecha: Date): Observable<MovimientoCaja[]> {
    return this.http.get<MovimientoCaja[]>(this.url + 'movimientos/' + fecha).pipe(
      map((response: any) => response.movimientos as MovimientoCaja[]),
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
