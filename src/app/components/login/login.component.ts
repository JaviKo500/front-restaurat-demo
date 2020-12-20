import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import swal from 'sweetalert2';
// models
import { Usuario } from '../../models/usuario';
// services
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Iniciar sesión';
  usuario: Usuario;
  msgs2: Message[];
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      // swal.fire('Login', 'Su sesión sigue abierta!', 'info');
      swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Información',
        text: 'Su sesión sigue abierta!!',
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/productos']);
    }
  }

  login(): void {
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error login',
        text: 'Username o Password vacios!',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/productos']);
      localStorage.setItem('username', usuario.username);
      // swal.fire('Login', 'Ha inciado sesión ' + usuario.username + ' con éxito!', 'success');
      swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Bienvenido: ' + usuario.username ,
        showConfirmButton: false,
        timer: 1500
      });
    }, error => {
      if (error.status === 400) {
        // swal.fire('Login', 'Usuario o clave incorrecto!', 'warning');
        swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Error login',
          text: 'Usuario o clave incorrecto',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  addMensaje(sms_alert: string): void {
    this.msgs2 = [{ severity: 'error', summary: 'Error', detail: `${sms_alert}` }];
  }

}
