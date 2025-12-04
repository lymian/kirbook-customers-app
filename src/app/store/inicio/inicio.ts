import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LibroService } from '../../services/libro';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {
  librosDestacados: Libro[] = [];
  cargando: boolean = true;

  // Carousel
  banners: string[] = [
    'assets/banner01.png',
    'assets/banner02.png',
    'assets/banner03.png'
  ];
  currentBannerIndex: number = 0;
  intervalId: any;

  constructor(private libroService: LibroService, private router: Router) { }

  ngOnInit(): void {
    this.cargarLibrosDestacados();
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cargarLibrosDestacados() {
    this.libroService.obtenerLibrosActivos().subscribe({
      next: (libros) => {
        this.librosDestacados = libros.slice(0, 4);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar libros destacados', err);
        this.cargando = false;
      }
    });
  }

  // Carousel Logic
  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextBanner();
    }, 5000); // Change every 5 seconds
  }

  nextBanner() {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  prevBanner() {
    this.currentBannerIndex = (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }

  goToBanner(index: number) {
    this.currentBannerIndex = index;
    // Reset timer on manual interaction
    clearInterval(this.intervalId);
    this.startCarousel();
  }

  verDetalles(id: number) {
    this.router.navigate(['/store/detalles', id]);
  }

  getImagen(id: number): string {
    return `https://firebasestorage.googleapis.com/v0/b/kirbook.firebasestorage.app/o/${id}.png?alt=media`;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }
}
