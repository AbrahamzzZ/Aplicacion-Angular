import { ICategoria } from "./categoria";

export interface IProducto {
    id: number;
    codigo: string;
    descripcion: string;
    nombre: string;
    oCategoria: ICategoria;
    pais_Origen: string;
    stock: number;
    precio_Compra: number;
    precio_Venta: number;
    estado: boolean;
}
