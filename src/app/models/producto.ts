export interface IProducto{
    id: number;
    codigo: string;
    descripcion: string;
    nombre: string;
    categoria: string;
    pais_origen: string;
    stock: number;
    precio_venta: number;
    estado: boolean;
}