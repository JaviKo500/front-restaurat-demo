import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
// models
import { Categoria } from '../../models/categoria';
import { Mesa } from '../../models/mesa';
// services
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { MesaService } from '../../services/mesa.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    title = 'restaurantDemo';
    mesasItems: Mesa[] = [];
    categoriasItems: Categoria[] = [];
    constructor(private _categoriaService: CategoriaService, public authservice: AuthService,
                private mesaService: MesaService, private router: Router) {
    }
    ngOnInit(): void {
        this.cargarDatosCategoria();
        this.cargarDatosMesas();
    }

    logout(): void {
        this.authservice.logout();
        localStorage.removeItem("username");
        swal.fire('Logout', 'Has cerrado Sesión', 'success');
        swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Has cerrado sesión',
          text: 'Hasta luego',
          showConfirmButton: false,
          timer: 1700
        });
        this.router.navigate(['/login']);
    }

    cargarDatosCategoria(): void {
        this._categoriaService.getAllCategorias().subscribe(response => {
            this.categoriasItems = response;
        });
    }

    cargarDatosMesas(): void {
        this.mesaService.getAllMesas().subscribe(response => {
            this.mesasItems = response;
        });
    }
}
