import { IProducto } from "./producto";

export interface IDetalleVenta {
    idProducto: number;
    oProducto?: IProducto;
    Precio_Venta: number;
    cantidad: number;
    SubTotal: number;
    descuento: number;
}
