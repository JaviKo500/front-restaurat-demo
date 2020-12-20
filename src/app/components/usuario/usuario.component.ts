import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
// models
import { Usuario } from '../../models/usuario';
// services
import { UsuarioService } from '../../services/usuario.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  sortOrder: number;
  sortField: string;
  sortKey: string;

  constructor(private messageService: MessageService,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listaUsuarios();
  }

  listaUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }


  onSortChange(event): void {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  actualizarUsuario(usuario: Usuario): void {
    this.usuarioService.updateUsarioStadoById(usuario).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Usuario', detail: res.mensaje });
    }, error => {
      console.log(error);
    });
  }
}
