import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router'; // parametros por url
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // modales
import swal from 'sweetalert2';
// models
import { Categoria } from '../../models/categoria';
import { Producto } from '../../models/producto';
import { BASE_URL } from '../../../environments/configurations';
// services
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css'],
  providers: [MessageService]
})
export class FormularioProductoComponent implements OnInit {
  // categorias
  categoria: Categoria = new Categoria();
  categorias: Categoria[];
  // Productos
  producto: Producto = new Producto();
  cate: string;
  // img
  imgProducto: File;
  img_url: any[];
  URL = BASE_URL;
  bandera = false;
  banderaEditarImg = false;
  // modalService
  private modalCategoria: NgbModalRef;
  formData: any;
  // mensajes
  msgs2: Message[];
  constructor(
    private messageService: MessageService,
    private _productoService: ProductoService,
    private _categoriaService: CategoriaService,
    private activateRoute: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this._productoService.getProducto(id).subscribe(producto => {
          this.producto = producto;
        });
      }
    });
    this.cargarCategorias();
  }
  // listar CategoriaService
  cargarCategorias(): void {
    this._categoriaService.getAllCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }
  enviarDatosCategorias(formCategoria): void {
    let bandera = false;
    // verificamos si existe alguna categoria antes de guardar
    for (let item of this.categorias) {
      if (item.nombreCat === this.categoria.nombreCat) {
        bandera = true;
        swal.fire('peligro', ' La categoría: ' + this.categoria.nombreCat + ', ya existe ingrese otra', 'warning');
        break;
      }
    }
    if (!bandera) {
      this._categoriaService.saveCategoria(this.categoria).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Categoría', detail: res['mensaje'] });
        this.cargarCategorias();
        this.cerrarModal(formCategoria);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Categoría', detail: error['mensaje'] });
        this.cerrarModal(formCategoria);
      });
    }
  }



  // leer imagen
  onChange(event): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.img_url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.bandera = true;
    }
    this.imgProducto = event.target.files[0];
    if (this.imgProducto.type.indexOf('image') < 0) {
      this.imgProducto = null;
      this.bandera = false;
      swal.fire('Error', 'Solo imágenes', 'error');
    }
  }
  cargarImagenProducto(id: number, formData: any): void {
    this._productoService.saveImgProducto(this.imgProducto, id).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Producto', detail: 'Producto correctamente guardado' });
      this.imgProducto = null;
      formData.reset();
      this.img_url = null;
      this.router.navigateByUrl('/productos');
    }, error => {
      this._productoService.deleteProducto(id).subscribe(res => {
      });
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      this.imgProducto = null;
    });
  }

  addMensaje(sms_alert: string): void {
    this.msgs2 = [{ severity: 'error', summary: 'Error', detail: `${sms_alert}` }];
  }
  enviarDatosProducto(formProducto): void {
    if (this.imgProducto) {
      this._productoService.saveProducto(this.producto).subscribe(res => {
        this.cargarImagenProducto(Number(res), formProducto);

      });
    } else {
      if (!this.producto.imagen) {
        swal.fire('Advertencia', 'Debe seleccionar su imagen', 'warning');
      } else {
        this._productoService.saveProducto(this.producto).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Producto', detail: 'Producto actualizado' });
          this.banderaEditarImg = true;
          formProducto.reset();
          this.router.navigateByUrl('/productos');
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.mensaje });
        });
      }
    }
  }
  // modal para agrgarc ategoria
  categoriaModal(modal): void {
    this.modalCategoria = this.modalService.open(modal, { centered: true });
  }

  cerrarModal(formData): void {
    formData.reset();
    this.modalCategoria.close();
  }
}
