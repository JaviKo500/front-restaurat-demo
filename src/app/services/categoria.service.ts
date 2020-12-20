import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
//modelos
import { Categoria } from '../models/categoria';
import { BASE_URL } from '../../environments/configurations';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  url: string = BASE_URL;
  constructor(private http: HttpClient, private router: Router) { }

  //listar categorias
  public getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url + 'categorias');
  }
  //guardar categorias
  saveCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post(this.url + 'categoria', categoria).pipe(
      map((response: any) => response),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
