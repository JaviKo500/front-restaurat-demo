import { DetallePedido } from './detalle-pedido';
import { Mesa } from './mesa';
import { Persona } from './persona';
import { Estado } from './estado';
export class Pedido {
    id: number;
    listaProd: DetallePedido[] = [];
    mesa: Mesa;
    persona: Persona;
    estado: Estado;
    fecha: Date;
    hora: Date;
    total: number;
    public calcularTotal(): number {
        this.total = 0;
        this.listaProd.forEach((items: DetallePedido) => {
            console.log('cantidad ' + items.cantidad);
            this.total += items.calcularImporte();
        });
        return Math.floor(this.total * 100) / 100;
    }
}
