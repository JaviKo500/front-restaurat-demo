import { TipoPago } from './tipoPago';
import { Usuario } from './usuario';
import { Pedido } from './pedido';
export class MovimientoCaja {
    id: number;
    monto: number;
    usuario: Usuario;
    tipoPago: TipoPago;
    descripcion: string;
    fechaMovimiento: Date;
    estado: boolean;
    pedido: Pedido;
}