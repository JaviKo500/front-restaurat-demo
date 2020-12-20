import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mesa } from '../models/mesa';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  url: string = BASE_URL;
  constructor(private http: HttpClient, private router: Router) { }

  public getAllMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.url + 'mesas');
  }
  public saveMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.url + 'mesa', mesa).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  public findMesa(nom: string): Observable<Mesa> {
    return this.http.get<Mesa>(this.url + 'mesa/' + nom).pipe(
      catchError(e => {
        this.router.navigate(['/productos']);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );

  }

}
