import { Caja } from './caja';
import { Usuario } from './usuario';
import { MovimientoCaja } from './movimientoCaja';
export class ArqueoCaja {
    id: number;
    caja: Caja;
    montoInicial: number;
    ingresos: number;
    montoFinal: number;
    diferencia: number;
    descripcion: string;
    fechaApertura: Date;
    fechaCierre: Date;
    usuario: Usuario;
    movimientos: MovimientoCaja[] = [];
    estado: boolean;
}
