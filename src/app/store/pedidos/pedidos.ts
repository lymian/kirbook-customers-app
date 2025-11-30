import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { PedidoResponse } from '../../models/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {
  pedidos: PedidoResponse[] = [];
  cargando: boolean = false;
  error: string = '';
  usuarioLogueado: boolean = false;
  estadoSeleccionado: string = 'pendiente';

  constructor(private router: Router, private pedidoService: PedidoService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.usuarioLogueado = true;
      this.cargando = true;
      this.obtenerPedidos();
    } else {
      this.usuarioLogueado = false;
    }
  }

  obtenerPedidos() {
    this.pedidoService.obtenerPedidosCliente().subscribe({
      next: (data) => {
        this.pedidos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los pedidos';
        this.cargando = false;
      }
    });
  }

  cambiarEstado(estado: string) {
    this.estadoSeleccionado = estado;
  }

  get pedidosFiltrados(): PedidoResponse[] {
    return this.pedidos.filter(p => p.estado.toLowerCase() === this.estadoSeleccionado.toLowerCase());
  }

  getImagen(id: number): string {
    return `http://localhost:8080/${id}.png`;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }
}
