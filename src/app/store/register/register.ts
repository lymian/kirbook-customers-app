import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, LoginRequest } from '../../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  form: RegisterRequest = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    numero: '',
    correo: '',
  };

  confirmarPassword: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  submit() {
    // Validaciones antes de enviar
    if (!this.form.username.trim()) {
      this.error = 'El username es obligatorio';
      return;
    }

    if (!this.form.password) {
      this.error = 'La contraseña es obligatoria';
      return;
    }

    if (this.form.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.form.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    if (!this.form.apellido.trim()) {
      this.error = 'El apellido es obligatorio';
      return;
    }

    if (!this.form.numero.trim() || !/^\d+$/.test(this.form.numero)) {
      this.error = 'Ingrese un número válido';
      return;
    }

    if (!this.form.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.correo)) {
      this.error = 'Ingrese un correo válido';
      return;
    }

    // Limpiar errores y enviar
    this.cargando = true;
    this.error = '';

    this.authService.register(this.form).subscribe({
      next: () => {
        // Login automático
        const loginData: LoginRequest = {
          username: this.form.username,
          password: this.form.password,
        };
        this.authService.login(loginData).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            window.location.href = '/store/inicio';
          },
          error: (err) => {
            this.error = 'Registro correcto, pero login falló: ' + err.message;
            this.cargando = false;
          },
        });
      },
      error: (err) => {
        this.error = err.message;
        this.cargando = false;
      },
    });
  }
}
