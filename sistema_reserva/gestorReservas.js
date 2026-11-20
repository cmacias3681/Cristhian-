/*import { ErrorReserva } from "./errores.js";

//Crear la clase GestorReservas y exportarla (export class GestorReservas):

export class GestorReservas {
    construtor(reservasIniciales = [], callback = null) {
        this.reserva = [...reservasIniciales];
        this.callback = callback;
    }


    // CREACION DEL METODO DE RESERVA CON UN NPROMISE VALIDADO
    //Si sala === "Auditorio" y horas > 4, llama a reject(new ErrorReserva(...))

    confirmarReserva({ usuario, sala, horas }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (sala === "Auditorio" && horas > 4) {
                    reject(
                        new ErrorReserva(
                            "El Auditorio permite máximo 4 horas seguidas",
                            "LIMITE_AUDITORIO",
                            { usuario, sala, horas }
                        )
                    );
                    return;
                }
                const reservaConfirmada = { usuario, sala, horas };
                this.reservas.push(reservaConfirmada);
                resolve(reservaConfirmada);
            }, 100);

        });


        async function procesarLotes(solicitudes) {
            if (!Array.isArray(solicitudes)) {
                throw new ErrorReserva("EL LOTE INGRESADO DEBE SER UN ARRAY", solicitudes);
            }

            const resultado = [];
            const salasValidas = ["Auditorio", "Sala Norte", "Sala Sur"];
            for (const solicitud of solicitudes) {
                try {
                    if (!solicitud || typeof solicitud !== "object") {
                        throw new ErrorReserva(
                            "La solicitud debe ser un objeto válido",
                            "SOLICITUD_INVALIDA",
                            solicitud
                        );
                    }

                    const { usuario, sala, horas } = solicitud;

                    if (typeof usuario !== "string" || usuario.trim() === "") {
                        throw new ErrorReserva(
                            "El usuario es obligatorio",
                            "USUARIO_INVALIDO",
                            solicitud
                        );
                    }

                    if (!salasValidas.includes(sala)) {
                        throw new ErrorReserva("Sala no válida", "SALA_INVALIDA", solicitud);
                    }

                    if (typeof horas !== "number" || Number.isNaN(horas) || horas <= 0) {
                        throw new ErrorReserva(
                            "Las horas deben ser un número mayor que 0",
                            "HORAS_INVALIDAS",
                            solicitud
                        );
                    }

                    const reserva = await this.confirmarReserva({
                        usuario: usuario.trim(),
                        sala,
                        horas
                    });

                    resultados.push({ ok: true, reserva });
                    if (this.callback) {
                        this.callback({ estado: "CONFIRMADA", reserva });
                    }
                } catch (error) {
                    resultados.push({ ok: false, error, solicitud });
                    if (this.callback) {
                        this.callback({ estado: "RECHAZADA", error, solicitud });
                    }
                }
            }

            const exitosas = resultados.filter((item) => item.ok);
            const fallidas = resultados.filter((item) => !item.ok);
            const horasConfirmadas = exitosas.reduce(
                (total, item) => total + item.reserva.horas,
                0
            );

            return {
                totalProcesado: resultados.length,
                horasConfirmadas,
                reservasExitosas: exitosas.map((item) => item.reserva),
                reservasFallidas: fallidas.map((item) => ({
                    error: item.error,
                    solicitud: item.solicitud
                }))
            };
        }

}

}

*/

import { ErrorReserva } from "./errores.js";

const SALAS_VALIDAS = ["Auditorio", "Sala Norte", "Sala Sur"];

export class GestorReservas {
  constructor(reservasIniciales = [], callback = null) {
    this.reservas = [...reservasIniciales];
    this.callback = typeof callback === "function" ? callback : null;
  }

  confirmarReserva({ usuario, sala, horas }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sala === "Auditorio" && horas > 4) {
          reject(
            new ErrorReserva(
              "El Auditorio permite máximo 4 horas seguidas",
              "LIMITE_AUDITORIO",
              { usuario, sala, horas }
            )
          );
          return;
        }

        const reservaConfirmada = { usuario, sala, horas };
        this.reservas.push(reservaConfirmada);
        resolve(reservaConfirmada);
      }, 100);
    });
  }

  async procesarLote(solicitudes) {
    if (!Array.isArray(solicitudes)) {
      throw new ErrorReserva(
        "El lote ingresado debe ser un array",
        "LOTE_INVALIDO",
        solicitudes
      );
    }

    const resultados = [];

    for (const solicitud of solicitudes) {
      try {
        if (!solicitud || typeof solicitud !== "object") {
          throw new ErrorReserva(
            "La solicitud debe ser un objeto válido",
            "SOLICITUD_INVALIDA",
            solicitud
          );
        }

        const { usuario, sala, horas } = solicitud;

        if (typeof usuario !== "string" || usuario.trim() === "") {
          throw new ErrorReserva(
            "El usuario es obligatorio",
            "USUARIO_INVALIDO",
            solicitud
          );
        }

        if (!SALAS_VALIDAS.includes(sala)) {
          throw new ErrorReserva(
            "Sala no válida",
            "SALA_INVALIDA",
            solicitud
          );
        }

        if (typeof horas !== "number" || Number.isNaN(horas) || horas <= 0) {
          throw new ErrorReserva(
            "Las horas deben ser un número mayor que 0",
            "HORAS_INVALIDAS",
            solicitud
          );
        }

        const reserva = await this.confirmarReserva({
          usuario: usuario.trim(),
          sala,
          horas
        });

        resultados.push({ ok: true, reserva });
        if (this.callback) {
          this.callback({ estado: "CONFIRMADA", reserva });
        }
      } catch (error) {
        resultados.push({ ok: false, error, solicitud });
        if (this.callback) {
          this.callback({ estado: "RECHAZADA", error, solicitud });
        }
      }
    }

    const exitosas = resultados.filter((item) => item.ok);
    const fallidas = resultados.filter((item) => !item.ok);
    const horasConfirmadas = exitosas.reduce(
      (total, item) => total + item.reserva.horas,
      0
    );

    return {
      totalProcesado: resultados.length,
      horasConfirmadas,
      reservasExitosas: exitosas.map((item) => item.reserva),
      reservasFallidas: fallidas.map((item) => ({
        error: item.error,
        solicitud: item.solicitud
      }))
    };
  }
}

