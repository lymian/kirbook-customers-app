import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { PedidoRequest } from '../../models/pedido.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  items: any[] = [];
  total: number = 0;
  cargando: boolean = false;
  mensaje: string = '';

  // Modal state
  mostrarModal: boolean = false;
  mensajeModal: string = '';
  accionModal: (() => void) | null = null;

  constructor(private router: Router, private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.items = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.calcularTotal();
  }

  calcularPrecioFinal(item: any): number {
    if (item.descuento > 0) {
      return item.precio * (1 - item.descuento / 100);
    }
    return item.precio;
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => {
      const precioFinal = this.calcularPrecioFinal(item);
      return acc + (precioFinal * item.cantidad);
    }, 0);
  }

  incrementar(item: any) {
    if (item.cantidad < item.stock) {
      item.cantidad++;
      this.actualizarStorage();
    }
  }

  decrementar(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarStorage();
    }
  }

  eliminar(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    this.actualizarStorage();
  }

  actualizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.items));
    this.calcularTotal();
  }

  getImagen(id: number): string {
    return `http://localhost:8080/${id}.png`;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }

  realizarPedido() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.mostrarMensaje('Debes iniciar sesión para realizar un pedido', () => {
        this.router.navigate(['/store/login']);
      });
      return;
    }

    if (this.items.length === 0) {
      this.mostrarMensaje('El carrito está vacío');
      return;
    }

    this.cargando = true;
    const pedido: PedidoRequest = {
      detalles: this.items.map(item => ({
        libroId: item.id,
        cantidad: item.cantidad
      }))
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: (res) => {
        localStorage.removeItem('carrito');
        this.items = [];
        this.calcularTotal();
        this.cargando = false;
        this.mostrarMensaje('Pedido realizado con éxito', () => {
          this.router.navigate(['/store/inicio']);
        });
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('Error al realizar el pedido');
        this.cargando = false;
      }
    });
  }

  mostrarMensaje(mensaje: string, accion: (() => void) | null = null) {
    this.mensajeModal = mensaje;
    this.accionModal = accion;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    if (this.accionModal) {
      this.accionModal();
      this.accionModal = null;
    }
  }
}
