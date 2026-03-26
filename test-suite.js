/**
 * Test Suite para NUBA Guardería Canina
 * Verifica funcionalidad de fechas y lógica relacionada
 * Ejecutar: node test-suite.js
 */

const today = new Date(2026, 2, 25); // 2026-03-25 (índice mes empieza en 0)

// ===== Utility Functions =====
const formatDateISO = (date) => date.toISOString().split("T")[0];

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isDateInRange = (date, desde, hasta) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = typeof desde === 'string' ? new Date(desde) : desde;
  const end = typeof hasta === 'string' ? new Date(hasta) : hasta;
  return d >= start && d <= end;
};

const isDateVencido = (venceDate, compareDate) => {
  const vence = typeof venceDate === 'string' ? new Date(venceDate) : venceDate;
  const compare = typeof compareDate === 'string' ? new Date(compareDate) : compareDate;
  return vence < compare;
};

// ===== Test Data =====
const testState = {
  today: today,
  perros: [
    { id: 1, nombre: "Luna", cliente: "María Pérez" },
    { id: 2, nombre: "Max", cliente: "Carlos Gómez" },
    { id: 3, nombre: "Toby", cliente: "Lucía Fernández" }
  ],
  hospedajes: [
    // Hospedaje activo hoy
    {
      id: 1,
      perroId: 1,
      habitacion: "Suite 1",
      desde: "2026-03-24",
      hasta: "2026-03-27",
      estado: "activo"
    },
    // Hospedaje próximo
    {
      id: 2,
      perroId: 2,
      habitacion: "Hab. 3",
      desde: "2026-03-28",
      hasta: "2026-04-02",
      estado: "programado"
    },
    // Hospedaje pasado
    {
      id: 3,
      perroId: 3,
      habitacion: "Suite 2",
      desde: "2026-03-10",
      hasta: "2026-03-15",
      estado: "completado"
    }
  ],
  pagos: [
    // Pago pendiente sin vencer
    {
      id: 1,
      perroId: 1,
      monto: 300000,
      vence: "2026-03-26",
      estado: "pendiente",
      notas: "Vence mañana"
    },
    // Pago vencido
    {
      id: 2,
      perroId: 2,
      monto: 360000,
      vence: "2026-03-20",
      estado: "pendiente",
      notas: "Vencido hace 5 días"
    },
    // Pago pagado
    {
      id: 3,
      perroId: 3,
      monto: 180000,
      vence: "2026-03-15",
      estado: "pagado"
    }
  ],
  tareas: [
    // Tarea de hoy
    {
      id: 1,
      titulo: "Paseo Luna",
      fecha: "2026-03-25",
      asignadoA: "Ana",
      estado: "pendiente"
    },
    // Tarea de mañana
    {
      id: 2,
      titulo: "Baño Max",
      fecha: "2026-03-26",
      asignadoA: "Luis",
      estado: "pendiente"
    },
    // Tarea pasada
    {
      id: 3,
      titulo: "Limpieza Suite 2",
      fecha: "2026-03-20",
      asignadoA: "Equipo",
      estado: "hecha"
    }
  ]
};

// ===== Test Results =====
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, testName, description) {
  if (condition) {
    passedTests++;
    testResults.push({
      status: "✓ PASS",
      test: testName,
      description: description
    });
  } else {
    failedTests++;
    testResults.push({
      status: "✗ FAIL",
      test: testName,
      description: description
    });
  }
}

// ===== TEST SUITE =====

console.log("\n========================================");
console.log("NUBA Guardería Canina - Test Suite");
console.log("========================================\n");

console.log(`Fecha de referencia (today): ${formatDateISO(today)}`);
console.log("Iniciando pruebas...\n");

// Test 1: Fecha de hoy se inicializa correctamente
assert(
  isSameDay(testState.today, today),
  "Initialización de fecha",
  "today debe ser 2026-03-25"
);

// === HOSPEDAJES ===
console.log("\n--- Pruebas de Hospedajes ---");

const hospedajesHoy = testState.hospedajes.filter(h => {
  return isDateInRange(today, new Date(h.desde), new Date(h.hasta));
});

assert(
  hospedajesHoy.length === 1,
  "Hospedajes activos hoy",
  `Debe haber 1 hospedaje activo hoy. Encontrados: ${hospedajesHoy.length}`
);

assert(
  hospedajesHoy[0]?.perroId === 1,
  "Hospedaje correcto hoy",
  "Luna debe estar hospedada hoy"
);

const hospedajesFuturos = testState.hospedajes.filter(h => {
  return new Date(h.desde) > today;
});

assert(
  hospedajesFuturos.length === 1,
  "Hospedajes programados",
  `Debe haber 1 hospedaje programado. Encontrados: ${hospedajesFuturos.length}`
);

// === PAGOS ===
console.log("\n--- Pruebas de Pagos ---");

const pagosVencidos = testState.pagos.filter(p => {
  return p.estado === "pendiente" && isDateVencido(p.vence, today);
});

assert(
  pagosVencidos.length === 1,
  "Detección de pagos vencidos",
  `Debe haber 1 pago vencido. Encontrados: ${pagosVencidos.length}`
);

assert(
  pagosVencidos[0]?.perroId === 2,
  "Pago vencido correcto",
  "Max debe tener un pago vencido"
);

const pagosPendientes = testState.pagos.filter(p => p.estado === "pendiente");

assert(
  pagosPendientes.length === 2,
  "Pagos pendientes",
  "Debe haber 2 pagos pendientes (1 vencido + 1 próximo a vencer)"
);

const pagoPróximoAVencer = testState.pagos.filter(p => {
  const daysUntilDue = (new Date(p.vence) - today) / (1000 * 60 * 60 * 24);
  return p.estado === "pendiente" && !isDateVencido(p.vence, today) && daysUntilDue <= 1;
});

assert(
  pagoPróximoAVencer.length === 1,
  "Pago próximo a vencer",
  "Debe haber 1 pago que vence en 1 día o menos"
);

// === TAREAS ===
console.log("\n--- Pruebas de Tareas ---");

const tareasHoy = testState.tareas.filter(t => {
  return t.fecha === formatDateISO(today) && t.estado !== "hecha";
});

assert(
  tareasHoy.length === 1,
  "Tareas de hoy",
  "Debe haber 1 tarea de hoy pendiente"
);

assert(
  tareasHoy[0]?.titulo.includes("Luna"),
  "Tarea correcta hoy",
  "La tarea de hoy debe ser para Luna"
);

const tareasFuturas = testState.tareas.filter(t => {
  return new Date(t.fecha) > today && t.estado !== "hecha";
});

assert(
  tareasFuturas.length === 1,
  "Tareas futuras",
  `Debe haber 1 tarea futura. Encontradas: ${tareasFuturas.length}`
);

// === FUNCIONALIDAD DE SINCRONIZACIÓN ===
console.log("\n--- Pruebas de Sincronización ---");

const dateFormatISO = formatDateISO(today);
assert(
  dateFormatISO === "2026-03-25",
  "Formato de fecha ISO",
  "Formato debe ser YYYY-MM-DD"
);

// Simular que la fecha se actualiza (como si pasara medianoche)
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const hospedajesMañana = testState.hospedajes.filter(h => {
  return isDateInRange(tomorrow, new Date(h.desde), new Date(h.hasta));
});

assert(
  hospedajesMañana.length === 1,
  "Hospedajes mañana",
  "Luna sigue hospedada mañana"
);

// ===== REPORT =====
console.log("\n========================================");
console.log("RESULTADOS DE PRUEBAS");
console.log("========================================\n");

testResults.forEach(result => {
  console.log(`${result.status} | ${result.test}`);
  console.log(`         ${result.description}\n`);
});

console.log("========================================");
console.log(`Pruebas Pasadas: ${passedTests}`);
console.log(`Pruebas Fallidas: ${failedTests}`);
console.log(`Total: ${passedTests + failedTests}`);
console.log("========================================\n");

if (failedTests === 0) {
  console.log("✓ Todas las pruebas pasaron correctamente");
  process.exit(0);
} else {
  console.log("✗ Algunas pruebas fallaron. Ver detalles arriba.");
  process.exit(1);
}
