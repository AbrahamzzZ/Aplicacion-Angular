import { INegocio } from "../interfaces/negocio";

export interface ISucursal {
    id: number;
    oNegocio: INegocio;
    codigo: string;
    nombre: string;
    direccion: string;
    latitud: number;
    longitud: number;
    ciudad: string;
    estado: boolean;
}
