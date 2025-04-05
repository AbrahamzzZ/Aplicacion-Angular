import { IRol } from "./rol";

export interface IUsuario {
  id: number;
  codigo: string;
  nombre_Completo: string;
  correo_Electronico: string;
  clave: string;
  oRol: IRol;
  estado: boolean;
  fecha_Creacion: string;
}
