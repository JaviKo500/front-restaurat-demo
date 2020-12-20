import { Component, Host, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
// models
import { Producto } from '../../models/producto';
import { Pedido } from '../../models/pedido';
import { DetallePedido } from '../../models/detalle-pedido';
import { Categoria } from 'src/app/models/categoria';
import { Persona } from '../../models/persona';
import { BASE_URL } from '../../../environments/configurations';
// services
import { ProductoService } from '../../services/producto.service';
import { PedidoService } from '../../services/pedido.service';
import { MesaService } from '../../services/mesa.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
// components
import { PedidosComponent } from '../pedidos/pedidos.component';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [PedidosComponent]
})
export class ProductoComponent implements OnInit {

  //
  url = BASE_URL;
  productosSize: number;
  persona: Persona = new Persona();
  pedido_local: Pedido = new Pedido();
  statusMensaje = '';
  idPedido: any = null;
  productos: Producto[] = [];
  producto: Producto = new Producto();
  pedido: Pedido = new Pedido();
  private modalRef: NgbModalRef;
  categorias: Categoria[];
  cantidad = 1;
  constructor(private productoService: ProductoService, private modalService: NgbModal,
    private pedidoService: PedidoService, private mesaService: MesaService,
    private activateRoute: ActivatedRoute, private categoriaService: CategoriaService,
    public authService: AuthService) {

  }

  //

  ngOnInit(): void {

    this.listarProductos();
    this.cargarMesa();
    this.cargarCategorias();
    this.productosSize = this.pedido.listaProd.length;
    this.recuperarDelLocalStorage();
  }

  cargarMesa(): void {
    this.activateRoute.params.subscribe(params => {
      let nomMesa = params['mes'];
      if (nomMesa) {
        nomMesa = nomMesa.replace(/%20/g, " ");
        this.mesaService.findMesa(nomMesa).subscribe(mesa => {
          this.pedido.mesa = mesa;
        });
      }
    });
  }

  listarProductos(): void {
    //swal.showLoading();
    this.productoService.getAllProductosCliente().subscribe(productos => {
      this.productos = productos;
      // swal.close();
    });
  }

  listarProductosCategoria(id: number): void {
    swal.showLoading();
    this.productoService.getProductoByCategoriaCliente(id).subscribe(productos => {
      this.productos = productos;
      swal.close();
    });
  }

  productoModal(product: Producto, modal): void {
    this.cantidad = 1;
    this.producto = product;
    this.modalRef = this.modalService.open(modal, { centered: true });
  }
  pedidoModalEditar(modal): void {
    this.cargarPedidoEditar();
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
  }

  pedidoModal(modal): void {
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
  }

  pedidoPersonaModal(modal): void {
    this.modalRef = this.modalService.open(modal, { centered: true, scrollable: true });
  }
  statusModal(modal): void {
    this.IdPedidoLocalStorage();
    this.consultarStatus();
    this.modalRef = this.modalService.open(modal, { centered: true });
  }

  cargarPedidoEditar(): void {
    this.IdPedidoLocalStorage();
    if (this.idPedido != null) {
      this.pedidoService.getClientePedidoId(this.idPedido).subscribe(pedido => {
        this.pedido = new Pedido();
        this.pedido = pedido;
        this.productosSize = this.pedido.listaProd.length;
      }, err => {
        this.pedido = new Pedido();
        this.cargarMesa();
        this.cerrarModal();
      });
    }
    this.productosSize = this.pedido.listaProd.length;
  }

  consultarStatus(): void {
    if (this.idPedido != null) {
      this.pedidoService.getEstatusPedido(this.idPedido).subscribe(pedi => {
        this.statusMensaje = pedi.estado;
      });
      //  this.cerrarModal();
    } else {
      this.statusMensaje = 'No se a realizado ningun pedido';
    }
    this.cargarMesa();
    this.idPedido = null;
  }
  // eliminar del pedido
  eliminarProducto(id: number): void {
    this.pedido.listaProd = this.pedido.listaProd.filter((item: DetallePedido) => id !== item.producto.id);
    this.guardarEnLocalStorage(this.pedido);
    this.productosSize = this.pedido.listaProd.length;
  }

  // calcular total
  calcularTotal(): number {
    let total = 0;
    this.pedido.listaProd.forEach((items: DetallePedido) => {
      total += this.calcularImporte(items.cantidad, items.producto.precio);
    });
    return Math.floor(total * 100) / 100;
  }
  // calcular importe
  public calcularImporte(cantidad: number, precio: number): number {
    let total = cantidad * precio;
    return Math.round(total * 100) / 100;
  }

  // agregar un producto al pedido
  agregarProducto(prod: Producto): void {
    let nuevoPro = new DetallePedido();
    if (this.existeProducto(prod.id)) {
      this.incrementarCantidad(prod.id);
      swal.fire('Agregado', 'Se agregaron mas cantidades de este produto', 'success');
    } else {
      nuevoPro.cantidad = this.cantidad;
      nuevoPro.producto = prod;
      this.pedido.listaProd.push(nuevoPro);
      swal.fire('Agregado', nuevoPro.producto.proNombre, 'success');
    }
    this.productosSize = this.pedido.listaProd.length;
    this.guardarEnLocalStorage(this.pedido);
    this.cerrarModal();
  }
  // verificar si un producto existe en el pedido
  existeProducto(id: number): boolean {
    let band = false;
    this.pedido.listaProd.forEach((item: DetallePedido) => {
      if (id === item.producto.id) {
        band = true;
      }
    });
    return band;
  }
  // si existe un producto duplicado aumentar la cantidad
  incrementarCantidad(id: number): void {
    this.pedido.listaProd = this.pedido.listaProd.map((item: DetallePedido) => {
      if (id === item.producto.id) {
        item.cantidad += this.cantidad;
      }
      this.guardarEnLocalStorage(this.pedido);
      return item;
    });
  }
  // post del pedido hacia la bd
  realizarPedido(): void {
    this.pedido.persona = this.persona;
    this.pedido.total = this.calcularTotal();
    this.pedidoService.guardarPedido(this.pedido).subscribe(pedido => {
      // this.guardarEnLocalStorage(pedido);
      swal.fire('Enviado', `Por favor espere su pedido su id de pedido es: ${pedido.id}`, 'success');
      this.limpiarLocalStorage();
      this.guardarEnLocalStorageIdPedido(pedido.id);
    });
    this.pedido = new Pedido();
    this.persona = new Persona();
    this.cargarMesa();
    this.cerrarModal();
    this.productosSize = this.pedido.listaProd.length;
  }
  // modal de cantidad dentro del pedido
  UpCantidadModal(item: DetallePedido, modal): void {
    this.producto = item.producto;
    this.cantidad = item.cantidad;
    this.modalRef = this.modalService.open(modal, { centered: true });
  }
  // actualizar calidad dentro del pedido
  actualizarCantidadPedido(id: number): void {
    this.producto = new Producto();
    this.pedido.listaProd = this.pedido.listaProd.map((item: DetallePedido) => {
      if (id === item.producto.id) {
        item.cantidad = this.cantidad;
        swal.fire('Cantidad actualizada', '', 'info');
        this.guardarEnLocalStorage(this.pedido);
        this.cerrarModal();
      }
      return item;
    });
    this.cantidad = 1;
  }


  cerrarModal(): void {
    this.modalRef.close();
    this.persona = new Persona();
  }
  sumarCantidad(): void {
    this.cantidad++;
  }

  restarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  cargarCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  guardarEnLocalStorageIdPedido(id: number): void {
    const now = new Date();
    const item = {
      value: id,
      expiry: now.getTime() + 3600000,
    };
    localStorage.setItem('idPedido', JSON.stringify(item));
  }

  // recuperar id del pedido del lcoalstarage
  IdPedidoLocalStorage(): void {
    let idPedido = localStorage.getItem('idPedido');
    if (idPedido) {
      const item = JSON.parse(idPedido);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('idPedido');
      } else {
        this.idPedido = item.value;
      }
    }
  }

  // recuperar pedid del local storage
  recuperarDelLocalStorage(): void {
    let pedido_local = localStorage.getItem('pedido');
    if (pedido_local) {
      const item = JSON.parse(pedido_local);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('pedido');
      } else {
        this.pedido_local = item.value;
        if (this.pedido_local != null) {
          this.pedido.listaProd = this.pedido_local.listaProd;
          this.productosSize = this.pedido.listaProd.length;
        }
      }
    }
  }

  // guardar pedido en el local storage
  guardarEnLocalStorage(pedido: Pedido): void {
    const now = new Date();
    const item = {
      value: pedido,
      expiry: now.getTime() + 1800000,
    };
    localStorage.setItem('pedido', JSON.stringify(item));
    this.recuperarDelLocalStorage();
  }

  limpiarLocalStorage(): void {
    localStorage.removeItem('pedido');
  }

  cancelarPedido(): void {
    this.IdPedidoLocalStorage();
    if (this.idPedido != null) {
      swal.fire({
        title: '¿Desea anular su pedido?',
        text: 'Ya no podra modificar su pedido',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Anular!'
      }).then((result) => {
        if (result.isConfirmed) {
          let pedido: Pedido = new Pedido();
          pedido.id = this.idPedido;
          this.pedidoService.actualizarAnularPedido(pedido).subscribe(response => {
            swal.fire(response.estado, response.mensaje, 'info');
            this.pedido = new Pedido();
            this.cargarMesa();
            this.cerrarModal();
            this.productosSize = this.pedido.listaProd.length;
            this.idPedido = null;
          });
        }
      });
    } else {
      swal.fire('Información', 'No cuenta con pedidos recientes!', 'warning');
    }
  }
}
