import { IRol } from "../interfaces/rol";

export interface IUsuario {
  id_Usuario: number;
  codigo: string;
  nombre_Completo: string;
  correo_Electronico: string;
  clave: string;
  oRol: IRol;
  nombre_Rol?: string;
  estado: boolean;
  fecha_Creacion: string;
}
