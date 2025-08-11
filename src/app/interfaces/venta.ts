import { IDetalleVenta } from "./detalle-venta";

export interface IVenta {
    id: number;
    numero_Documento: string;
    id_Usuario: number;
    id_Cliente: number;
    tipo_Documento: string;
    monto_Pago: number;
    monto_Cambio: number;
    monto_Total: number;
    descuento: number;
    detalles: IDetalleVenta [];
}