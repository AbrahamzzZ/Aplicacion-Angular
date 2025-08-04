export interface INegocio {
    idNegocio: number;
    nombre: string;
    telefono: string;
    ruc: string;
    direccion: string;
    correoElectronico: string;
    logo?: string;
    imagenBase64?: string | Uint8Array | File | null;
}
