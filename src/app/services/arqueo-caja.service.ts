import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ArqueoCaja } from '../models/arqueo-caja';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class ArqueoCajaService {
  url: string = BASE_URL;
  constructor(private http: HttpClient) { }

  getArqueoId(id: number): Observable<ArqueoCaja> {
    return this.http.get<ArqueoCaja>(this.url + 'arqueo/' + id).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getArqueosHoy(fecha: Date): Observable<ArqueoCaja[]> {
    return this.http.get<ArqueoCaja[]>(this.url + 'arqueos/hoy/' + fecha).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getArqueosEntreFechas(fechaIni: Date, fechaFin: Date): Observable<ArqueoCaja[]> {
    return this.http.get<ArqueoCaja[]>(this.url + 'arqueos/' + fechaIni + '/' + fechaFin).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  saveArqueo(arqueo: ArqueoCaja): Observable<any> {
    return this.http.post<any>(this.url + 'arqueo', arqueo).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  cerrarAqueodeCaja(arqueo: ArqueoCaja): Observable<any> {
    return this.http.put<any>(this.url + 'arqueo/cierre/' + arqueo.id, arqueo).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  updateAqueodeCaja(arqueo: ArqueoCaja): Observable<any> {
    return this.http.put<any>(this.url + 'arqueo/update/' + arqueo.id, arqueo).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

}
