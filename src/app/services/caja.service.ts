import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Caja } from '../models/caja';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private url: string = BASE_URL;
  constructor(private http: HttpClient) { }

  public getCajas(): Observable<Caja[]> {
    return this.http.get<Caja[]>(this.url + 'caja');
  }

  public getCajasHabilitadas(): Observable<Caja[]> {
    return this.http.get<Caja[]>(this.url + 'caja/habilitada');
  }


  public SaveCaja(caja: Caja): Observable<any> {
    return this.http.post<any>(this.url + 'caja', caja).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  public editarCaja(caja: Caja): Observable<any> {
    return this.http.put<any>(this.url + 'editar/caja/' + caja.id, caja).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  public editarEstadoCaja(caja: Caja): Observable<any> {
    return this.http.put<any>(this.url + 'estado/caja/' + caja.id, caja).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
