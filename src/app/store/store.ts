import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { ChatbotComponent } from '../components/chatbot.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ChatbotComponent],
  templateUrl: './store.html',
  styleUrls: ['./store.css'],
})
export class Store {
  menuOpen = false;
  usuario: any = null;

  constructor(private router: Router) {
    this.cargarUsuario();
  }

  /** Cargar usuario desde localStorage */
  cargarUsuario() {
    const usuarioStr = localStorage.getItem('usuario');
    this.usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  /** Cerrar sesión */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.router.navigate(['/store/inicio']);
  }
}
