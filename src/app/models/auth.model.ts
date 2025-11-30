export interface Usuario {
    id: number;
    username: string;
    rol: string;
    nombre: string;
    apellido: string;
    numero: string;
    correo: string;
    estado: boolean;
}

export interface RegisterRequest {
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    numero: string;
    correo: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
}

export interface ErrorResponse {
    error: string;
}
