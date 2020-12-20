import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cabecera } from '../models/cabecera';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class CabeceraService {
  url: string = BASE_URL;
  constructor(private http: HttpClient) { }

  getCabera(): Observable<Cabecera[]> {
    return this.http.get<Cabecera[]>(this.url + 'cabecera');
  }

  editarCabecera(cabecera: Cabecera): Observable<any> {
    return this.http.post<any>(this.url + 'cabecera/', cabecera).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

}
