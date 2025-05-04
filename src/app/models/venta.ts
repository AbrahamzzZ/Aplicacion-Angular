import { ICliente } from "./cliente";
import { IDetalleVenta } from "./detalle-venta";
import { IOferta } from "./oferta";
import { IUsuario } from "./usuario";

export interface IVenta {
    id: number;
    numeroDocumento: string;
    oUsuario: IUsuario;
    oCliente: ICliente;
    oOferta?: IOferta | null;
    tipoDocumento: string;
    montoPago: number;
    montoCambio: number;
    montoTotal: number;
    descuento: number;
    detalleVenta: IDetalleVenta [];
    fecha_Venta: string;
}
