import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
//pipe
import { DatePipe } from '@angular/common'
// models
import { ArqueoCaja } from '../../models/arqueo-caja';
import { Pedido } from '../../models/pedido';
// services
import { ArqueoCajaService } from '../../services/arqueo-caja.service';
//reportes
import { PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from 'pdfmake/build/pdfMake';
PdfMakeWrapper.setFonts(pdfFonts);
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  providers: [DatePipe]
})
export class CajaComponent implements OnInit {
  modalRef: NgbModalRef;
  arqueosCajas: ArqueoCaja[] = [];
  fechaIni: Date;
  fechaFin: Date;
  sortOrder: number;
  sortField: string;
  sortKey: string;
  arqueo: ArqueoCaja = new ArqueoCaja();
  label = 'Cerrar caja';
  pedido: Pedido = new Pedido();
  constructor(private arqueoService: ArqueoCajaService, private modalService: NgbModal, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.cargarArqueosDelDia();
  }

  cargarArqueosEntreFechas(): void {
    if (this.fechaIni != null && this.fechaFin != null) {
      // hacer la peticion
      this.arqueoService.getArqueosEntreFechas(this.fechaIni, this.fechaFin).subscribe(arqueos => {
        this.arqueosCajas = arqueos;
      });
    } else {
      swal.fire('Busqueda por fechas!', 'Debe seleccionar ambas fechas correctamente!', 'warning');
    }
  }

  cargarArqueosDelDia(): void {
    this.arqueoService.getArqueosHoy(new Date()).subscribe(arqueos => {
      this.arqueosCajas = arqueos;
    });
  }

  cerrarArqueoCaja(arqueoCaja: ArqueoCaja): void {
    swal.fire({
      title: '¿Esta seguro de cerrar la caja?',
      text: 'Si cierra la caja no se podra volver abrir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.arqueoService.cerrarAqueodeCaja(arqueoCaja).subscribe(response => {
          swal.fire(
            'Cerrado!',
            'Su caja se cerro con exito.',
            'success'
          );
          this.cargarArqueosDelDia();
        });
      }
    });
  }

  detalleMovimientos(arq: ArqueoCaja, modal): void {
    this.arqueo = arq;
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true, size: 'xl' });
  }

  detallePedidoModal(pedi: Pedido, modal): void {
    this.pedido = pedi;
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
  }

  cerrarModal(): void {
    this.modalRef.close();
  }

  formatFecha(date: Date): string {
    let valor: string = this.datepipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
    return valor
  }

  //reportes  
  generarPdf() {
    swal.showLoading();
    var body: any = [['Encargado', 'caja', 'Monto Inicial', 'Monto Final', 'Fecha apertura', 'Fecha Cierre', 'Descripción']]
    this.arqueosCajas.forEach((ar: ArqueoCaja) => {
      body.push([ar.usuario.nombre, ar.caja.nombreCaja, ar.montoInicial, ar.montoFinal,
      this.formatFecha(ar.fechaApertura), this.formatFecha(ar.fechaCierre), ar.descripcion]);
    });
    var dd = {
      pageOrientation: 'landscape',
      content: [
        { text: 'REPORTE DE ARQUEOS DE CAJA', bold: true, fontSize: 25, style: 'header', alignment: 'center' },
        ' ',
        { text: 'Fecha: ' + this.formatFecha(new Date()), bold: true, style: 'subheader' },
        ' ',
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', '*', '*', '*'],
            body: body
          }
        }
      ]
    };
    swal.close();
    pdfMake.createPdf(dd).open();
  }

}
