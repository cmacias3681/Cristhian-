import { GestorReservas } from "./gestorReservas.js";

function manejarEventoReserva(evento) {
  if (evento.estado === "CONFIRMADA") {
    const { usuario, sala, horas } = evento.reserva;
    console.log(`[OK] Reserva confirmada -> ${usuario} en ${sala} (${horas}h)`);
  } else {
    const { codigo, message } = evento.error;
    console.log(`[ERROR - ${codigo}] ${message}`);
  }
}

async function ejecutarPruebas() {
  try {
    const gestor = new GestorReservas([], manejarEventoReserva);

    const lotePruebas = [
      { usuario: "Laura", sala: "Sala Norte", horas: 3 },
      { usuario: "Diego", sala: "Auditorio", horas: 4 },
      { usuario: "Elena", sala: "Auditorio", horas: 5 }, // Supera el límite de 4h
      { usuario: "", sala: "Sala Sur", horas: 2 }, // Usuario incompleto
      { usuario: "Pablo", sala: "Sala Sur", horas: 1 }
    ];

    const resumen = await gestor.procesarLote(lotePruebas);

    console.log("\n--- Resumen final del lote ---");
    console.log(`Total procesado: ${resumen.totalProcesado}`);
    console.log(`Horas confirmadas: ${resumen.horasConfirmadas}`);
    console.log("Reservas exitosas:", resumen.reservasExitosas);
    console.log("Reservas fallidas:", resumen.reservasFallidas);

    console.log("\n--- Reservas guardadas en el gestor ---");
    console.log(gestor.reservas);
  } catch (errorGeneral) {
    console.error("Fallo general en main.js:", errorGeneral);
  }
}

ejecutarPruebas();