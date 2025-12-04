import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoRequest, PedidoResponse } from '../models/pedido.model';

@Injectable({
    providedIn: 'root'
})
export class PedidoService {
    private apiUrl = 'https://kirbook.api.lymian.xyz/pedidos';

    constructor(private http: HttpClient) { }

    crearPedido(pedido: PedidoRequest): Observable<any> {
        return this.http.post<any>(this.apiUrl, pedido);
    }

    obtenerPedidosCliente(): Observable<PedidoResponse[]> {
        return this.http.get<PedidoResponse[]>(`${this.apiUrl}/cliente`);
    }
}
