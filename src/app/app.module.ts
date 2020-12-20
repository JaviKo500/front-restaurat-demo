import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeES from '@angular/common/locales/es';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeES, 'es');
// Primeng
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
// pipes
import { FilterPipe } from './pipes/filter.pipe';
// componentes
import { AppComponent } from './app.component';
import { ProductoService } from './services/producto.service';
import { ProductoComponent } from './components/producto/producto.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { MesaComponent } from './components/mesa/mesa.component';
import { FormularioProductoComponent } from './components/formulario-producto/formulario-producto.component';
import { MenucategoriaComponent } from './components/menucategoria/menucategoria.component';
import { LoginComponent } from './components/login/login.component';
import { TokenInterceptor } from './models/interceptors/token.interceptor';
import { AuthInterceptor } from './models/interceptors/auth.interceptor';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { FormUsuarioComponent } from './components/usuario/form-usuario/form-usuario.component';
import { MovimientoCajaComponent } from './components/caja/movimiento-caja/movimiento-caja.component';
import { HeaderComponent } from './components/header/header.component';
import { CajaComponent } from './components/caja/caja.component';
import { ListarCajasComponent } from './components/caja/listar-cajas/listar-cajas.component';
import { FormArqueoCajaComponent } from './components/caja/form-arqueo-caja/form-arqueo-caja.component';
import { CabeceraFacturaComponent } from './components/cabecera-factura/cabecera-factura.component';
import { CalendarModule } from 'primeng/calendar';
//deploy config
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    PedidosComponent,
    MesaComponent,
    FormularioProductoComponent,
    MenucategoriaComponent,
    LoginComponent,
    UsuarioComponent,
    FormUsuarioComponent,
    HeaderComponent,
    CajaComponent,
    ListarCajasComponent,
    FormArqueoCajaComponent,
    MovimientoCajaComponent,
    FilterPipe,
    CabeceraFacturaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    QRCodeModule,
    PDFExportModule,
    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    InputTextareaModule,
    TabViewModule,
    MessageModule,
    MessagesModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    ToggleButtonModule,
    MultiSelectModule,
    TooltipModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  providers: [ProductoService, MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
