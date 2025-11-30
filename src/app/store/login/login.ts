import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  form: LoginRequest = { username: '', password: '' };
  error: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  submit() {
    // Validaciones
    if (!this.form.username.trim()) {
      this.error = 'El username es obligatorio';
      return;
    }

    if (!this.form.password) {
      this.error = 'La contraseña es obligatoria';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.form).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        window.location.href = '/store/inicio';
      },
      error: (err) => {
        this.error = err.message || 'Credenciales incorrectas';
        this.cargando = false;
      },
    });
  }
}
