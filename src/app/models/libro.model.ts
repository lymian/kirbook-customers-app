export interface Libro {
    id: number;
    titulo: string;
    sinopsis: string;
    fechaPublicacion: string;
    precio: number;
    estado: boolean;
    descuento: number;
    stock: number;
    autorId: number;
    autorNombre: string;
    categoriaId: number;
    categoriaNombre: string;
}
