import { IProducto } from "./producto";

export interface IOferta{
    id: number;
    codigo: string;
    nombre: string;
    oProducto: IProducto;
    descripcion: string;
    fecha_Inicio: string;
    fecha_Fin: string;
    descuento: number;
    estado: boolean;
}
