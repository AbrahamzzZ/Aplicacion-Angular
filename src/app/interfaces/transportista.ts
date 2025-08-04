export interface ITransportista {
  idTranportista: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correoElectronico: string;
  imagen: string;
  imagenBase64: string | Uint8Array | File | null;
  estado: boolean;
  fechaRegistro: string;
}
