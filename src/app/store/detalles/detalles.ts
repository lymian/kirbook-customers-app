import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../services/libro';
import { Libro } from '../../models/libro.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './detalles.html',
  styleUrls: ['./detalles.css'],
})
export class Detalles implements OnInit {
  libro!: Libro;
  cargando: boolean = true;
  error: string = '';
  cantidadEnCarrito: number = 0;
  cantidad: number = 1;
  mostrarModal: boolean = false;
  mensajeModal: string = '';

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.libroService.obtenerLibroPorId(id).subscribe({
        next: (data) => {
          this.libro = data;
          this.verificarCarrito();
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el libro';
          this.cargando = false;
        },
      });
    } else {
      this.error = 'ID de libro inválido';
      this.cargando = false;
    }
  }

  /** Devuelve la URL de la imagen, o default si no existe */
  getImagen(): string {
    return this.libro ? `https://firebasestorage.googleapis.com/v0/b/kirbook.firebasestorage.app/o/${this.libro.id}.png?alt=media` : '';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }

  verificarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const item = carrito.find((item: any) => item.id === this.libro.id);
    this.cantidadEnCarrito = item ? item.cantidad : 0;
  }

  incrementarCantidad() {
    if (this.cantidad < this.libro.stock) {
      this.cantidad++;
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  agregarAlCarrito() {
    if (this.libro.stock <= 0) {
      this.mostrarMensaje('No hay stock disponible');
      return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const index = carrito.findIndex((item: any) => item.id === this.libro.id);

    let nuevaCantidadTotal = this.cantidad;
    if (index !== -1) {
      nuevaCantidadTotal += carrito[index].cantidad;
    }

    if (nuevaCantidadTotal > this.libro.stock) {
      this.mostrarMensaje(`No puedes agregar más. Stock máximo: ${this.libro.stock}. Ya tienes ${this.cantidadEnCarrito} en el carrito.`);
      return;
    }

    if (index !== -1) {
      carrito[index].cantidad = nuevaCantidadTotal;
    } else {
      const itemCarrito = { ...this.libro, cantidad: this.cantidad };
      carrito.push(itemCarrito);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.cantidadEnCarrito = nuevaCantidadTotal;
    this.mostrarMensaje('Libro agregado al carrito');
  }

  mostrarMensaje(mensaje: string) {
    this.mensajeModal = mensaje;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
