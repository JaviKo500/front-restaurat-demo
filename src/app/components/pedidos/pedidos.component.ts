import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DecimalPipe } from '@angular/common';
import swal from 'sweetalert2';
//pipe
import { DatePipe } from '@angular/common'
// models
import { Pedido } from 'src/app/models/pedido';
import { Estado } from '../../models/estado';
import { MedioPago } from 'src/app/models/medio-pago';
import { Cabecera } from '../../models/cabecera';
import { Persona } from '../../models/persona';
// services
import { PedidoService } from '../../services/pedido.service';
import { MedioPagoService } from '../../services/medio-pago.service';
import { CabeceraService } from '../../services/cabecera.service';
//reportes
import { PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from 'pdfmake/build/pdfMake';
PdfMakeWrapper.setFonts(pdfFonts);
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [DecimalPipe, DatePipe]
})

export class PedidosComponent implements OnInit {
  fecha: Date;
  cabecera: Cabecera = new Cabecera();
  mediosPago: MedioPago[] = [];
  pedidos: Pedido[] = [];
  pedidosres: Pedido[];
  pedido: Pedido = new Pedido();
  estados: Estado[] = [];
  estadoEntregado: Estado;
  private modalRef: NgbModalRef;
  pago: MedioPago = new MedioPago();
  persona: Persona = new Persona();
  filterPedidos = '';
  constructor(public pedidoService: PedidoService, private modalService: NgbModal,
    private messageService: MessageService, private medioPagoService: MedioPagoService,
    private cabeceraService: CabeceraService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.listarPedidos();
    this.listarMedioPago();
    this.listarEstados();
    this.cargarCabecera();
  }
  // buscar por fechas
  formatoFecha(): void {
    if (this.fecha) {
      this.pedidoService.getPedidoFecha(this.fecha).subscribe(pedidos => {
        this.pedidos = pedidos;
        if (this.pedidos == null) {
          this.messageService.add({ severity: 'warn', summary: 'Pedidos', detail: 'No existen pedidos' });
        }
      });
    } else {
      swal.fire('Error de fecha', 'se debe seleccionar una fecha', 'warning');
    }
  }

  cambiarStatus(pedi: Pedido): void {
    this.pedidoService.actualizarEstado(pedi, 'null').subscribe(pedido => {
      this.messageService.add({ severity: 'success', summary: 'Estado modificado', detail: pedido.mensaje });
      this.listarPedidos();
    }, err => {
      this.listarPedidos();
    });
  }

  finalizarPedido(pedi: Pedido): void {
    if (this.pago.tipoPago === null || this.pago.tipoPago === undefined) {
      swal.fire('Metodo de pago', 'Seleccione un metodo de pago', 'warning');
    } else {
      pedi.estado = this.estadoEntregado;
      this.pedidoService.actualizarEstado(pedi, this.pago.tipoPago).subscribe(pedido => {
        this.messageService.add({ severity: 'success', summary: 'Estado modificado', detail: 'Entregado' });
        this.listarPedidos();
        this.cerrarModal();
        this.pago = new MedioPago();
      }, err => {
        this.listarPedidos();
      });
    }
  }

  listarPedidos(): void {
    //swal.showLoading();
    this.pedidoService.getPedidoFecha(new Date()).subscribe(pedidos => {
      this.pedidos = pedidos;
      this.pedidosres = pedidos;
      this.filtrarPedidos('Proceso');
      if (this.pedidos == null) {
        this.messageService.add({ severity: 'warn', summary: 'Pedidos', detail: 'No existen pedidos' });
      }
      // swal.close();
    });
  }

  detallePedidoModal(pedi: Pedido, modal): void {
    if (pedi) {
      this.pedido = pedi;
      this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
    }
  }

  listarEstados(): void {
    this.pedidoService.getAllEstados().subscribe(estados => {
      for (let i = 0; i < estados.length; i++) {
        if (estados[i].nomEstado !== 'Entregado') {
          this.estados.push(estados[i]);
        }
        if (estados[i].nomEstado === 'Entregado') {
          this.estadoEntregado = estados[i];
        }
      }
    });
  }

  listarMedioPago(): void {
    this.medioPagoService.getAllMediosPago().subscribe(medios => {
      for (let i = 0; i < medios.length; i++) {
        if (medios[i].tipoPago !== 'Ninguno') {
          this.mediosPago.push(medios[i]);
        }
      }
    });
  }

  comstatus(e1: Estado, e2: Estado): boolean {
    if (e1 === undefined && e2 === undefined) {
      return true;
    }
    return e1 == null || e2 == null ? false : e1.id === e2.id;
  }

  filtrarPedidos(value: string): void {
    this.refrecar();
    this.pedidos = this.pedidosres;
    let lista: Pedido[] = [];
    if (value === 'Anulado') {
      lista = this.filtrarPedidosLogica('Anulado');
    }
    if (value === 'Entregado') {
      lista = this.filtrarPedidosLogica('Entregado');
    }
    if (value === 'Proceso') {
      lista = this.filtrarPedidosLogica('Proceso');
    }
    this.pedidos = lista;
  }

  cargarCabecera(): void {
    this.cabeceraService.getCabera().subscribe(cabecera => {
      this.cabecera = cabecera[0];
    });
  }

  refrecar(): void {
    this.pedidoService.getPedidoFecha(new Date()).subscribe(pedidos => {
      this.pedidosres = pedidos;
    });
  }

  filtrarPedidosLogica(value: string): Pedido[] {
    let lista: Pedido[] = [];
    if (this.pedidos != null) {
      if (value === 'Proceso') {
        this.pedidos.forEach((ped: Pedido) => {
          if (ped.estado.nomEstado !== 'Entregado' && ped.estado.nomEstado !== 'Anulado') {
            lista.push(ped);
          }
        });
      } else {
        this.pedidos.forEach((ped: Pedido) => {
          if (ped.estado.nomEstado === value) {
            lista.push(ped);
          }
        });
      }
    }
    return lista;
  }

  abrirTipoPago(modal): void {
    this.modalRef = this.modalService.open(modal, { centered: true });
  }
  reciboPedidoModal(pedi: Pedido, modal): void {
    if (pedi) {
      this.persona.cedula = pedi.persona.cedula;
      this.persona.nombre = pedi.persona.nombre;
      this.pedido = pedi;
      this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
    }
  }
  cerrarModal(): void {
    this.modalRef.close();
  }

  //formato de fecha
  formatFecha(date: Date): string {
    let valor: string = this.datepipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
    return valor
  }

  //reportes
  generarPdf() {
    ///////////
    swal.showLoading()
    /////////////

    var body: any = [['Cedula Cli', 'Nombre Cli', '# mesa', 'hora solicitud', 'estado', 'Total']]
    this.pedidos.forEach((pe: Pedido) => {
      body.push([pe.persona.cedula, pe.persona.nombre, pe.mesa.mesa, this.formatFecha(pe.hora),
      pe.estado.nomEstado, pe.total]);
    });
    var dd = {
      pageOrientation: 'landscape',
      content: [
        { text: 'REPORTE DE PEDIDOS', bold: true, fontSize: 25, style: 'header', alignment: 'center' },
        ' ',
        { text: 'Fecha: ' + this.formatFecha(new Date()), bold: true, style: 'subheader' },
        ' ',
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*'],
            body: body
          }
        }
      ]
    };
    swal.close()
    pdfMake.createPdf(dd).open();
  }
}

