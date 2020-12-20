import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (arg === '') return value;
    const pedidos = [];
    for (const pedido of value) {
      if (pedido.mesa.mesa.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        pedidos.push(pedido);
      }
      else if (pedido.persona.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        pedidos.push(pedido);
      }
      else if (pedido.persona.cedula.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        pedidos.push(pedido);
      };
    };
    return pedidos;
  }

}
