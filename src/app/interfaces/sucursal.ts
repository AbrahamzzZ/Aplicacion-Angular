import { INegocio } from "../interfaces/negocio";

export interface ISucursal {
    id_Sucursal: number;
    oNegocio: INegocio;
    codigo: string;
    nombre_Sucursal: string;
    direccion_Sucursal: string;
    latitud: number;
    longitud: number;
    ciudad_Sucursal: string;
    estado: boolean;
}
