import { IDetalleCompra } from "./detalle-compra";
import { IProveedor } from "./proveedor";
import { ITransportista } from "./transportista";
import { IUsuario } from "./usuario";

export interface ICompra {
    id: number;
    numeroDocumento: string;
    oUsuario: IUsuario;
    oProveedor: IProveedor;
    oTransportista: ITransportista;
    tipoDocumento: string;
    montoTotal: string;
    detalleCompra: IDetalleCompra [];
    fecha_Compra: string;
}
