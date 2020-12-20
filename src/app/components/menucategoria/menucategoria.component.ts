import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
// models
import { Producto } from 'src/app/models/producto';
// services
import { ProductoService } from '../../services/producto.service';
// configuratios
import { BASE_URL } from '../../../environments/configurations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menucategoria',
  templateUrl: './menucategoria.component.html',
  styleUrls: ['./menucategoria.component.css']
})
export class MenucategoriaComponent implements OnInit {

  //
  url = BASE_URL;
  productosByCategoria: Producto[];

  sortOrder: number;
  sortField: string;
  sortKey: string;
  selectedProducto: Producto;
  displayDialog: boolean;
  estadoProducto = true;
  constructor(private activateRoute: ActivatedRoute, private _productoService: ProductoService, private messageService: MessageService,
    public authservice: AuthService) { }

  ngOnInit(): void {
    this.cargarProductosPorCategoria();
  }

  cargarProductosPorCategoria(): void {
    this.activateRoute.params.subscribe(params => {
      let id_cat = params['id'];
      if (id_cat) {
        this._productoService.getProductoByCategoria(id_cat).subscribe((producto) => {
          this.productosByCategoria = producto;
        });
      }
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
  actualizarProducto(producto: Producto): void {
    this._productoService.updateProductoEstado(producto).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Categoría', detail: res.mensaje });
    }, error => {
      console.log(error);
    });
  }

}
