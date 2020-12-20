import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

// models
import { Caja } from '../../../models/caja';
import { Usuario } from '../../../models/usuario';
import { ArqueoCaja } from '../../../models/arqueo-caja';
// services
import { CajaService } from '../../../services/caja.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ArqueoCajaService } from '../../../services/arqueo-caja.service';


@Component({
  selector: 'app-form-arqueo-caja',
  templateUrl: './form-arqueo-caja.component.html',
  styleUrls: ['./form-arqueo-caja.component.css']
})
export class FormArqueoCajaComponent implements OnInit {
  cajaAdd: Caja = new Caja();
  cajasHabilitadas: Caja[];
  usuario: Usuario = new Usuario();
  usuarios: Usuario[];
  arqueosCajas: ArqueoCaja[];
  arqueoCaja: ArqueoCaja = new ArqueoCaja();

  // nombre boton
  title: string;
  title2: string;
  btn_guardar: string;
  btn_editar: string;
  // primeng
  msgs2: Message[];
  // modalService
  private modalCaja: NgbModalRef;
  constructor(
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private cajaService: CajaService,
    private usuarioService: UsuarioService,
    private arqueoService: ArqueoCajaService
  ) {
    this.title = 'Abrir nuevo arqueo';
    this.title2 = 'Editar Arqueo';
    this.btn_guardar = 'Abrir arqueo';
    this.btn_editar = 'Guardar cambios';
  }

  ngOnInit(): void {
    this.buscarParametrosByUrl();
    this.cargarCajasHabilitadas();
    this.cargarUsuariosHabilitados();
  }

  cargarUsuariosHabilitados(): void {
    this.usuarioService.getUsuariosHabilitados().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  cargarCajasHabilitadas(): void {
    this.cajaService.getCajasHabilitadas().subscribe(cajas => {
      this.cajasHabilitadas = cajas;
    });
  }

  addMensaje(sms_alert: string): void {
    this.msgs2 = [{ severity: 'error', summary: '', detail: `${sms_alert}` }];
  }
  actualizarDatosArqueo(): void {
    this.arqueoService.updateAqueodeCaja(this.arqueoCaja).subscribe(response => {
      swal.fire(response.mensaje, '', 'success');
      this.router.navigate(['/arqueo/lista']);
    });
  }

  guardarCaja(): void {
    this.cajaService.SaveCaja(this.cajaAdd).subscribe(response => {
      swal.fire('Accion', response.mensaje, 'success');
      this.cargarCajasHabilitadas();
      this.cerrarModal();
    });
  }

  GuardarDatosArqueoCaja(): void {
    this.arqueoService.saveArqueo(this.arqueoCaja).subscribe(response => {
      swal.fire(response.mensaje, '', 'success');
      this.router.navigate(['/arqueo/lista']);
    });
  }
  // modal para agregar cajas
  cajaModal(modal): void {
    this.modalCaja = this.modalService.open(modal, { centered: true });
  }

  cerrarModal(): void {
    this.cajaAdd = new Caja();
    this.modalCaja.close();
  }

  buscarParametrosByUrl(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.arqueoService.getArqueoId(id).subscribe(arqueo => {
          this.arqueoCaja = arqueo;
        });
      }
    });
  }

}
