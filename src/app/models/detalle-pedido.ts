import { Producto } from './producto';
export class DetallePedido {
    id: number;
    producto: Producto;
    cantidad: number;
    public calcularImporte(): number {
        let total = this.cantidad * this.producto.precio;
        return Math.round(total * 100) / 100;
    }
}
