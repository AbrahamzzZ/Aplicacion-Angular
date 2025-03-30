export class Metodos {
  static generarCodigo(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  static getFechaCreacion(): string {
    const fechaObj = new Date().toISOString();
    return fechaObj;
  }
}
