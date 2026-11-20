//Tipos de error (errores.js): define una clase de error personalizada que extienda de Error y conserve información adicional 
// (como un código identificador y los detalles asociados al fallo).

export class ErrorReserva extends Error {
  constructor(mensaje, codigo, detalles) {
    super(mensaje);
    this.name = "ErrorReserva";
    this.codigo = codigo;
    this.detalles = detalles;
  }
}




