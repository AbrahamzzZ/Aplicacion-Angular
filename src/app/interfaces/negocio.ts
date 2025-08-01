export interface INegocio {
    id: number;
    nombre: string;
    telefono: string;
    ruc: string;
    direccion: string;
    correo_Electronico: string;
    logo?: string;
    imagenBase64?: string | Uint8Array | File | null;
}
