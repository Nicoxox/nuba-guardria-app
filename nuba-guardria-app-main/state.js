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

// ===== Persistence helpers (Firestore compat via global `firebase`) =====
const getSerializableState = () => ({
  activeTab: state.activeTab,
  today: formatDateISO(state.today),
  calendarMonthOffset: state.calendarMonthOffset,
  selectedDate: state.selectedDate ? formatDateISO(state.selectedDate) : null,
  pagosFilter: state.pagosFilter,
  tareasFilter: state.tareasFilter,
  selectedPerroId: state.selectedPerroId || null,
  tarifa: state.tarifa || null,
  perros: state.perros,
  hospedajes: state.hospedajes,
  pagos: state.pagos,
  tareas: state.tareas
});

export async function saveState() {
  if (typeof firebase === "undefined" || !firebase.firestore) return;
  try {
    const db = firebase.firestore();
    await db.collection("nuba").doc("app-state").set(getSerializableState());
  } catch (e) {
    console.error("saveState to Firebase failed", e);
  }
}

export async function loadState() {
  if (typeof firebase === "undefined" || !firebase.firestore) return;
  try {
    const db = firebase.firestore();
    const unsubscriber = db.collection("nuba").doc("app-state").onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const obj = snapshot.data();
        if (obj) {
          state.activeTab = obj.activeTab || state.activeTab;
          state.today = obj.today ? new Date(obj.today) : state.today;
          state.calendarMonthOffset = obj.calendarMonthOffset || state.calendarMonthOffset;
          state.selectedDate = obj.selectedDate ? new Date(obj.selectedDate) : state.selectedDate;
          state.pagosFilter = obj.pagosFilter || state.pagosFilter;
          state.tareasFilter = obj.tareasFilter || state.tareasFilter;
          state.selectedPerroId = obj.selectedPerroId || state.selectedPerroId;
          if (obj.tarifa) state.tarifa = obj.tarifa;
          if (Array.isArray(obj.perros)) state.perros = obj.perros;
          if (Array.isArray(obj.hospedajes)) state.hospedajes = obj.hospedajes;
          if (Array.isArray(obj.pagos)) state.pagos = obj.pagos;
          if (Array.isArray(obj.tareas)) state.tareas = obj.tareas;
          window.dispatchEvent(new Event("nuba-rerender"));
        }
      }
    });
    return unsubscriber;
  } catch (e) {
    console.error("loadState from Firebase failed", e);
  }
}