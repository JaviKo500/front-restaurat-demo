import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
// models
import { Role } from '../../../models/role';
import { Usuario } from '../../../models/usuario';
import { Sexo } from '../../../models/sexo';
// services
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})
export class FormUsuarioComponent implements OnInit {

  role: Role;
  usuario: Usuario = new Usuario();
  roles: Role[] = [];
  password2;
  generos: Sexo[] = [];
  msgs2: Message[];
  // nombre boton
    title: string;
    title2: string;
    boton: string;
    boton2: string;
  // conprobar password
  bandera: boolean;
  activar: boolean;
  ocultar: boolean;
  ocultar2: boolean;
  putPost: boolean;
  constructor(
    private usuarioService: UsuarioService,
    private activateRoute: ActivatedRoute,
    private router: Router) {
    this.title = 'Agregar usuario';
    this.title2 = 'Editar usuario';
    this.boton = 'Guardar usuario';
    this.boton2 = 'Guardar cambios';
    this.activar = false;
    this.ocultar = false;
    this.ocultar2 = false;
  }
  ngOnInit(): void {
    this.buscarParametrosByUrl();
    this.CargarRoles();
    this.cargarSexos();
  }
  cargarSexos(): void {
    this.usuarioService.getSexos().subscribe(sexos => {
      this.generos = sexos;
    });
  }
  CargarRoles(): void {
    this.usuarioService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  addMensaje(sms_alert: string): void {
    this.msgs2 = [{ severity: 'error', summary: '', detail: `${sms_alert}` }];
  }
  cambiarEstado(password): void {
    password.length >= 6 ? this.activar = true : this.activar = false;
  }

  confirmarPassword(password2): boolean {
    if (password2 === this.usuario.password) {
      this.bandera = true;
    } else {
      this.bandera = false;
    }
    return this.bandera;
  }

  verPassword1(id): void {
    let text: any = document.getElementById(id);
    if (this.ocultar) {
      text.type = 'password';
      this.ocultar = false;
    } else {
      text.type = 'text';
      this.ocultar = true;
    }
  }
  verPassword2(id): void {
    let text: any = document.getElementById(id);
    if (this.ocultar2) {
      text.type = 'password';
      this.ocultar2 = false;
    } else {
      text.type = 'text';
      this.ocultar2 = true;
    }
  }
  enviarDatosUsuario(): void {
    this.usuario.roles = [];
    this.usuario.roles.push(this.role);
    this.usuarioService.guardarUsuario(this.usuario).subscribe(response => {
      this.router.navigate(['/usuario']);
      this.usuario.id ? swal.fire('Usuario', 'Actualizado con exito', 'success') : swal.fire('Usuario', response, 'success');
    });
  }

  buscarParametrosByUrl(): void{
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.usuarioService.getUsuarioById(id).subscribe(usuario => {
          this.usuario = usuario;
          this.usuario.password = null;
        }, error => {
          console.log(error);
        });
      }
    });
  }
}
