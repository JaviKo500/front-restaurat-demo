import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
// models
import { MovimientoCaja } from '../../../models/movimientoCaja';
import { Pedido } from '../../../models/pedido';
// services
import { MovimientoService } from '../../../services/movimiento.service';

@Component({
  selector: 'app-movimiento-caja',
  templateUrl: './movimiento-caja.component.html',
  styleUrls: ['./movimiento-caja.component.css']
})
export class MovimientoCajaComponent implements OnInit {
  sortOrder: number;
  sortField: string;
  sortKey: string;
  // instancias
  movimientosCaja: MovimientoCaja[];
  movimientoCaja: MovimientoCaja = new MovimientoCaja();
  pedido: Pedido = new Pedido();
  fechaIni: Date;
  modalRef: NgbModalRef;
  constructor(private modalService: NgbModal, private movimientoService: MovimientoService) { }

  ngOnInit(): void {
    this.ListarMovimientos();
  }

  ListarMovimientos(): void {
    this.movimientoService.getMovimientosFecha(new Date()).subscribe(movimientos => {
      this.movimientosCaja = movimientos;
    });
  }

  movimientosEntreFechas(): void {
    if (this.fechaIni != null) {
      this.movimientoService.getMovimientosFecha(this.fechaIni).subscribe(movimientos => {
        this.movimientosCaja = movimientos;
      });
    } else {
      swal.fire('Error de fecha', 'se debe seleccionar una fecha', 'warning');
    }
  }

  detallePedidoModal(pedi: Pedido, modal): void {
    this.pedido = pedi;
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
  }

  detalleMovimientos(modal): void {
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true, size: 'xl' });
  }

  cerrarModal(): void {
    this.modalRef.close();
    this.pedido = new Pedido();
  }
}
