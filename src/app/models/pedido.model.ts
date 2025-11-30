export interface DetallePedidoDTO {
    libroId: number;
    cantidad: number;
}

export interface PedidoRequest {
    detalles: DetallePedidoDTO[];
}

export interface DetallePedidoResponse {
    id: number;
    idPedido: number;
    libroId: number;
    libroTitulo: string;
    cantidad: number;
    precioUnitario: number;
    descuentoAplicado: number;
    subtotal: number;
}

export interface PedidoResponse {
    id: number;
    fecha: string;
    fechaFinalizado: string | null;
    estado: string;
    total: number;
    clienteId: number;
    usernameCliente: string;
    nombreCliente: string;
    apellidoCliente: string;
    numeroCliente: number;
    detalles: DetallePedidoResponse[];
}
