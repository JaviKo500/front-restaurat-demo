import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedioPago } from '../models/medio-pago';
import { BASE_URL } from '../../environments/configurations';

@Injectable({
  providedIn: 'root'
})
export class MedioPagoService {

  url: string = BASE_URL;
  constructor(private http: HttpClient) { }

  getAllMediosPago(): Observable<MedioPago[]> {
    return this.http.get<MedioPago[]>(this.url + 'mediopagos');
  }
}
