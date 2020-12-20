import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'primeng/api';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
// models
import { Caja } from '../../../models/caja';
// services
import { CajaService } from '../../../services/caja.service';

@Component({
  selector: 'app-listar-cajas',
  templateUrl: './listar-cajas.component.html',
  styleUrls: ['./listar-cajas.component.css']
})
export class ListarCajasComponent implements OnInit {
  cajas: Caja[];
  cajaAdd: Caja = new Caja();
  sortOrder: number;
  sortField: string;
  sortKey: string;

  // primeng
  msgs2: Message[];
  // modalService
  private modalCaja: NgbModalRef;
  constructor(private modalService: NgbModal, private cajaService: CajaService) {
  }

  ngOnInit(): void {
    this.listarCajas();
  }

  listarCajas(): void {
    this.cajaService.getCajas().subscribe(cajas => {
      this.cajas = cajas;
    });
  }
  // actualizr datos
  actualizarCaja(caja: Caja): void {
    this.cajaService.editarCaja(caja).subscribe(response => {
      swal.fire('Actualizado', response.mensaje, 'success');
      this.listarCajas();
      this.cerrarModal();
    });
  }
  // actualizar estado
  actualizarCajaEstado(caja: Caja): void {
    this.cajaService.editarEstadoCaja(caja).subscribe(response => {
      swal.fire('Actualizado', response.mensaje, 'success');
      this.listarCajas();
      this.cerrarModal();
    });
  }
  // guardar caja
  guardarCaja(): void {
    this.cajaService.SaveCaja(this.cajaAdd).subscribe(response => {
      swal.fire('Accion', response.mensaje, 'success');
      this.listarCajas();
      this.cerrarModal();
    });
  }
  addMensaje(sms_alert: string): void {
    this.msgs2 = [{ severity: 'error', summary: '', detail: `${sms_alert}` }];
  }
  // modal para agregar cajas
  cajaModal(modal): void {
    this.modalCaja = this.modalService.open(modal, { centered: true });
  }

  cerrarModal(): void {
    this.cajaAdd = new Caja();
    this.modalCaja.close();
  }
  cajaModalEditar(caja: Caja, modal): void {
    if (caja) {
      this.cajaAdd = caja;
      this.modalCaja = this.modalService.open(modal, { centered: true, scrollable: true });
    }
  }

}
