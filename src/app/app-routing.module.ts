import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Guard
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
// components
import { ProductoComponent } from './components/producto/producto.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { MesaComponent } from './components/mesa/mesa.component';
import { FormularioProductoComponent } from './components/formulario-producto/formulario-producto.component';
import { MenucategoriaComponent } from './components/menucategoria/menucategoria.component';
import { LoginComponent } from './components/login/login.component';
import { FormUsuarioComponent } from './components/usuario/form-usuario/form-usuario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { HeaderComponent } from './components/header/header.component';
import { CajaComponent } from './components/caja/caja.component';
import { ListarCajasComponent } from './components/caja/listar-cajas/listar-cajas.component';
import { FormArqueoCajaComponent } from './components/caja/form-arqueo-caja/form-arqueo-caja.component';
import { MovimientoCajaComponent } from './components/caja/movimiento-caja/movimiento-caja.component';
import { CabeceraFacturaComponent } from './components/cabecera-factura/cabecera-factura.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'menu', component: HeaderComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'menu/categoria/:id', component: MenucategoriaComponent },
  {
    path: 'productos/agregar', component: FormularioProductoComponent,
    canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] }
  },
  {
    path: 'productos/editar/:id', component: FormularioProductoComponent,
    canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] }
  },
  {
    path: 'pedidos', component: PedidosComponent,
    canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_CAJERO'] }
  },
  { path: 'mesas', component: MesaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'productos/:mes', component: ProductoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'usuario/form', component: FormUsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  {
    path: 'usuario/edit/:id', component: FormUsuarioComponent,
    canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] }
  },
  { path: 'arqueo/lista', component: CajaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  {
    path: 'caja/movimientos', component: MovimientoCajaComponent,
    canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_CAJERO'] }
  },
  { path: 'caja/lista', component: ListarCajasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'caja/arqueo', component: FormArqueoCajaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'caja/edit/:id', component: FormArqueoCajaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'cabecera', component: CabeceraFacturaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
