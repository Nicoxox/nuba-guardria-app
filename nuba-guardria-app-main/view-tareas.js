import { state, formatDateISO } from "./state.js";
import { el } from "./dom.js";

export function renderTareasView() {
  const card = el("div", { class: "card card-tight" }, [
    el("div", { class: "card-header" }, [
      el("div", { class: "card-title" }, [
        "Tareas del equipo",
        el("span", { class: "chip" }, [
          el("span", { class: "chip-dot" }),
          "Paseos, baños, limpieza"
        ])
      ]),
      el(
        "button",
        {
          class: "btn-ghost",
          onclick: () => {
            state.modal = { type: "tarea" };
            window.dispatchEvent(new Event("nuba-rerender"));
          }
        },
        "+ nueva"
      )
    ]),
    el("div", { class: "task-filters" }, [
      el(
        "button",
        {
          class: `btn-ghost ${state.tareasFilter === "todas" ? "active-filter" : ""}`,
          onclick: () => {
            state.tareasFilter = "todas";
            window.dispatchEvent(new Event("nuba-rerender"));
          }
        },
        "Todas"
      ),
      el(
        "button",
        {
          class: `btn-ghost ${state.tareasFilter === "pendientes" ? "active-filter" : ""}`,
          onclick: () => {
            state.tareasFilter = "pendientes";
            window.dispatchEvent(new Event("nuba-rerender"));
          }
        },
        "Pendientes"
      ),
      el(
        "button",
        {
          class: `btn-ghost ${state.tareasFilter === "hoy" ? "active-filter" : ""}`,
          onclick: () => {
            state.tareasFilter = "hoy";
            window.dispatchEvent(new Event("nuba-rerender"));
          }
        },
        "Hoy"
      )
    ]),
    el("div", { class: "scroll-area" }, [renderTareasList()])
  ]);

  return card;
}

function renderTareasList() {
  const todayISO = formatDateISO(state.today);

  let list = state.tareas.slice();
  if (state.tareasFilter === "pendientes") {
    list = list.filter((t) => t.estado !== "hecha");
  } else if (state.tareasFilter === "hoy") {
    list = list.filter((t) => t.fecha === todayISO);
  }

  if (list.length === 0) {
    return el(
      "div",
      { class: "empty-state" },
      "No hay tareas para este filtro."
    );
  }

  return el(
    "div",
    null,
    list.map((t) => {
      const statusClass = t.estado;
      const statusLabel =
        t.estado === "pendiente"
          ? "Pendiente"
          : t.estado === "en-curso"
          ? "En curso"
          : "Hecha";

      return el("div", { class: "task-item" }, [
        el(
          "button",
          {
            class: "task-checkbox",
            onclick: () => {
              if (t.estado === "hecha") {
                t.estado = "pendiente";
              } else {
                t.estado = "hecha";
              }
              window.dispatchEvent(new Event("nuba-rerender"));
            }
          },
          t.estado === "hecha" ? "✓" : ""
        ),
        el("div", { class: "task-main" }, [
          el("div", { class: "task-title" }, t.titulo),
          el("div", { class: "task-meta" }, [
            el("span", null, [
              `Fecha: ${t.fecha.split("-").reverse().join("/")}`,
              " · ",
              `Asignado a ${t.asignadoA}`
            ]),
            el("span", { class: `task-status-pill ${statusClass}` }, statusLabel)
          ])
        ])
      ]);
    })
  );
}