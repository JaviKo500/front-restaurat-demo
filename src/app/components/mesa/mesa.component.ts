import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
// models
import { Mesa } from '../../models/mesa';
// services
import { MesaService } from '../../services/mesa.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})
export class MesaComponent implements OnInit {

  // codigo qr
  elementType = 'img';
  level = 'M';
  qrdata = '';
  scale = 1;
  width = 256;
  // termina atributos

  mesa: Mesa = new Mesa();
  mesas: Mesa[];
  private modalRef: NgbModalRef;

  filterPost = '';
  constructor(private mesaService: MesaService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listarMesas();
  }

  listarMesas(): void {
    this.mesaService.getAllMesas().subscribe(mesas => {
      this.mesas = mesas;
    });
  }

  mesaModal(modal): void {
    this.modalRef = this.modalService.open(modal, { centered: true });
  }
  mesaModalEditar(mesa: Mesa, modal): void {
    if (mesa) {
      this.mesa = mesa;
      this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
    }
  }

  qrModal(mes: Mesa, modal): void {
    this.qrdata = (mes.url + mes.mesa.replace(/ /g, '%20'));
    this.modalRef = this.modalService.open(modal, { centered: true });
  }

  guardarMesa(): void {
    this.mesaService.saveMesa(this.mesa).subscribe(mesa => {
      this.mesa = mesa;
      this.listarMesas();
      this.mesa = new Mesa();
      this.cerrarModal();
      swal.fire({
        position: 'center',
        icon: 'success',
        title: 'la mesa se creo satisfactoriamente',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
  cerrarModal(): void {
    this.mesa = new Mesa();
    this.modalRef.close();
  }
}
