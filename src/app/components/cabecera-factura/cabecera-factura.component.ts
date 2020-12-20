import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
// models
import { Cabecera } from '../../models/cabecera';
// services
import { CabeceraService } from '../../services/cabecera.service';

@Component({
  selector: 'app-cabecera-factura',
  templateUrl: './cabecera-factura.component.html',
  styleUrls: ['./cabecera-factura.component.css']
})
export class CabeceraFacturaComponent implements OnInit {

  cabecera: Cabecera = new Cabecera();

  constructor(private cabeceraService: CabeceraService) { }

  ngOnInit(): void {
    this.cabeceraService.getCabera().subscribe(cabecera => {
      this.cabecera = cabecera[0];
    });
  }

  actualizar(): void {
    this.cabeceraService.editarCabecera(this.cabecera).subscribe(res => {
      swal.fire('Cabecera', 'Actualizado', 'success');
    });
  }

}
