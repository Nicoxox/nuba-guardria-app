export const state = {
  activeTab: "calendario",
  today: new Date(),
  calendarMonthOffset: 0,
  selectedDate: null,
  pagosFilter: "pendientes",
  tareasFilter: "todas",
  modal: null, // {type: 'hospedaje'|'tarea'}
  perros: [
    {
      id: 1,
      nombre: "Luna",
      notas: "Dieta hipoalergénica, muy sociable.",
      cliente: "María Pérez",
      etiquetas: ["Dieta", "Sociable"]
    },
    {
      id: 2,
      nombre: "Max",
      notas: "Ansiedad por separación. Prefiere habitación tranquila.",
      cliente: "Carlos Gómez",
      etiquetas: ["Ansiedad", "Habitación individual"]
    },
    {
      id: 3,
      nombre: "Toby",
      notas: "Toma medicación por la mañana. Muy juguetón.",
      cliente: "Lucía Fernández",
      etiquetas: ["Medicación", "Juguetón"]
    }
  ],
  hospedajes: [
    {
      id: 1,
      perroId: 1,
      habitacion: "Suite 1",
      desde: "2025-12-06",
      hasta: "2025-12-10",
      estado: "activo"
    },
    {
      id: 2,
      perroId: 2,
      habitacion: "Hab. 3",
      desde: "2025-12-07",
      hasta: "2025-12-12",
      estado: "programado"
    },
    {
      id: 3,
      perroId: 3,
      habitacion: "Suite 2",
      desde: "2025-12-05",
      hasta: "2025-12-07",
      estado: "completado"
    }
  ],
  pagos: [
    {
      id: 1,
      perroId: 1,
      monto: 180,
      vence: "2025-12-09",
      estado: "pendiente"
    },
    {
      id: 2,
      perroId: 2,
      monto: 240,
      vence: "2025-12-05",
      estado: "pendiente"
    },
    {
      id: 3,
      perroId: 3,
      monto: 120,
      vence: "2025-12-03",
      estado: "pagado"
    }
  ],
  tareas: [
    {
      id: 1,
      titulo: "Paseo Luna (mañana)",
      fecha: "2025-12-07",
      asignadoA: "Ana",
      estado: "pendiente"
    },
    {
      id: 2,
      titulo: "Baño Max",
      fecha: "2025-12-07",
      asignadoA: "Luis",
      estado: "en-curso"
    },
    {
      id: 3,
      titulo: "Limpieza Suite 2",
      fecha: "2025-12-06",
      asignadoA: "Equipo",
      estado: "hecha"
    }
  ]
};

export const formatDateISO = (date) => date.toISOString().split("T")[0];

export const addMonths = (date, offset) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + offset);
  return d;
};

export const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
  const days = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
};

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();