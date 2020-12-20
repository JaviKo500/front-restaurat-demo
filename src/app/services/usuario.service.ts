import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Role } from '../models/role';
import { Usuario } from '../models/usuario';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Sexo } from '../models/sexo';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: string = BASE_URL;
  constructor(private http: HttpClient) { }

  public getSexos(): Observable<Sexo[]> {
    return this.http.get<Sexo[]>(this.url + 'usuarios/sexo');
  }

  public getUsuariosHabilitados(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + 'usuarios/habilitados');
  }

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.url + 'usuarios/roles');
  }

  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + 'usuarios');
  }

  public guardarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(this.url + 'usuario', usuario).pipe(
      map((response: any) => response.mensaje),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e)
      })
    )
  }

  public getUsuarioById(id: number): Observable<any> {
    return this.http.get(this.url + 'usuario/' + id).pipe(
      map((response: any) => response.usuario as Usuario),
      catchError(e => {
        swal.fire('Error', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  public updateUsarioStadoById(usuario: Usuario): Observable<any> {
    return this.http.put<any>(this.url + 'usuario/estado/' + usuario.id, usuario).pipe(
      catchError(e => {
        swal.fire(e.error.mesaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
  public updateUsarioById(usuario: Usuario): Observable<any> {
    return this.http.put<any>(this.url + 'usuario/' + usuario.id, usuario).pipe(
      catchError(e => {
        swal.fire(e.error.mesaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
}
