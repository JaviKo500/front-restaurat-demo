import { Sexo } from './sexo';
import { Role } from './role';
export class Usuario {
    id: number;
    cedula: string;
    nombre: string;
    email: string;
    sexo: Sexo;
    telefono: string;
    username: string;
    password: string;
    estado: boolean;
    roles: Role[] = [];
}
