import { Categoria } from './categoria';
export class Producto {
    id: number;
    proNombre: string;
    precio: number;
    categoria: Categoria;
    descripcion: string;
    imagen: string;
    estado:boolean;
}
