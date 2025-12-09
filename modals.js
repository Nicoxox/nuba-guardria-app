import { state, formatDateISO } from "./state.js";
import { el } from "./dom.js";

export function renderModal() {
  const close = () => {
    state.modal = null;
    window.dispatchEvent(new Event("nuba-rerender"));
  };

  const backdrop = el(
    "div",
    {
      class: "modal-backdrop",
      onclick: (e) => {
        if (e.target === e.currentTarget) close();
      }
    },
    [renderModalContent(close)]
  );

  return backdrop;
}

function renderModalContent(close) {
  if (!state.modal) return el("div");
  if (state.modal.type === "hospedaje") return renderHospedajeModal(close);
  if (state.modal.type === "tarea") return renderTareaModal(close);
  return el("div");
}

function renderHospedajeModal(close) {
  const sheet = el("div", { class: "modal-sheet" });
  const desdeInput = el("input", {
    type: "date",
    value: state.modal.date || formatDateISO(state.today)
  });
  const hastaInput = el("input", {
    type: "date",
    value: state.modal.date || formatDateISO(state.today)
  });

  const perroSelect = el(
    "select",
    null,
    state.perros.map((p) => el("option", { value: p.id }, p.nombre))
  );

  const habInput = el("input", {
    type: "text",
    placeholder: "Suite / Habitación"
  });

  const save = () => {
    const perroId = parseInt(perroSelect.value, 10);
    const desde = desdeInput.value;
    const hasta = hastaInput.value;
    const habitacion = habInput.value || "Hab. 1";
    if (!perroId || !desde || !hasta) {
      alert("Completa perro y fechas.");
      return;
    }
    state.hospedajes.push({
      id: Date.now(),
      perroId,
      desde,
      hasta,
      habitacion,
      estado: "programado"
    });
    close();
  };

  sheet.appendChild(
    el("div", { class: "modal-header" }, [
      el("div", { class: "modal-title" }, "Nuevo hospedaje"),
      el(
        "button",
        {
          class: "btn-icon",
          onclick: close
        },
        "✕"
      )
    ])
  );

  sheet.appendChild(
    el("div", { class: "modal-body" }, [
      el("div", { class: "modal-field" }, [
        el("label", null, "Perro"),
        perroSelect
      ]),
      el("div", { class: "modal-field" }, [
        el("label", null, "Desde"),
        desdeInput
      ]),
      el("div", { class: "modal-field" }, [
        el("label", null, "Hasta"),
        hastaInput
      ]),
      el("div", { class: "modal-field" }, [
        el("label", null, "Habitación"),
        habInput
      ]),
      el("div", { class: "modal-actions" }, [
        el("button", { class: "btn-ghost", onclick: close }, "Cancelar"),
        el("button", { class: "btn-primary", onclick: save }, "Guardar")
      ])
    ])
  );

  return sheet;
}

function renderTareaModal(close) {
  const sheet = el("div", { class: "modal-sheet" });
  const tituloInput = el("input", {
    type: "text",
    placeholder: "Título de la tarea"
  });
  const fechaInput = el("input", {
    type: "date",
    value: formatDateISO(state.today)
  });
  const personaInput = el("input", {
    type: "text",
    placeholder: "Asignado a (nombre)"
  });

  const save = () => {
    const titulo = tituloInput.value.trim();
    const fecha = fechaInput.value;
    const asignadoA = personaInput.value.trim() || "Equipo";

    if (!titulo || !fecha) {
      alert("Completa el título y la fecha.");
      return;
    }

    state.tareas.push({
      id: Date.now(),
      titulo,
      fecha,
      asignadoA,
      estado: "pendiente"
    });
    close();
  };

  sheet.appendChild(
    el("div", { class: "modal-header" }, [
      el("div", { class: "modal-title" }, "Nueva tarea"),
      el(
        "button",
        {
          class: "btn-icon",
          onclick: close
        },
        "✕"
      )
    ])
  );

  sheet.appendChild(
    el("div", { class: "modal-body" }, [
      el("div", { class: "modal-field" }, [
        el("label", null, "Título"),
        tituloInput
      ]),
      el("div", { class: "modal-field" }, [
        el("label", null, "Fecha"),
        fechaInput
      ]),
      el("div", { class: "modal-field" }, [
        el("label", null, "Asignado a"),
        personaInput
      ]),
      el("div", { class: "modal-actions" }, [
        el("button", { class: "btn-ghost", onclick: close }, "Cancelar"),
        el("button", { class: "btn-primary", onclick: save }, "Guardar")
      ])
    ])
  );

  return sheet;
}