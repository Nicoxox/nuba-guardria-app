import { state, loadState } from "./state.js";
import { el } from "./dom.js";
import { renderCalendarioView } from "./view-calendario.js";
import { renderPerrosView } from "./view-perros.js";
import { renderPagosView } from "./view-pagos.js";
import { renderTareasView } from "./view-tareas.js";
import { renderModal } from "./modals.js";

function renderApp(root) {
  root.innerHTML = "";
  const shell = el("div", { class: "app-shell" });

  shell.appendChild(renderHeader());
  shell.appendChild(renderTabs());
  shell.appendChild(renderContent());

  root.appendChild(shell);

  if (state.modal) {
    root.appendChild(renderModal());
  }
}

function renderHeader() {
  const todayCount = state.hospedajes.filter((h) => {
    const todayISO = state.today.toISOString().split("T")[0];
    return todayISO >= h.desde && todayISO <= h.hasta;
  }).length;

  return el("header", { class: "app-header" }, [
    el("div", { class: "logo-group" }, [
      el("div", { class: "logo-icon" }, [
        el("div", { class: "paw" }, [
          el("div", { class: "paw-toe" }),
          el("div", { class: "paw-toe" }),
          el("div", { class: "paw-toe" })
        ])
      ]),
      el("div", { class: "logo-text-block" }, [
        el("span", { class: "logo-text-main" }, "NUBA"),
        el("span", { class: "logo-text-sub" }, "Guardería Canina")
      ])
    ]),
    el("div", { class: "badge-pill" }, [
      el("span", { class: "badge-dot" }),
      `${todayCount} hospedajes hoy`
    ])
  ]);
}

function renderTabs() {
  const tabs = [
    { id: "calendario", label: "Calendario" },
    { id: "perros", label: "Perros" },
    { id: "pagos", label: "Pagos" },
    { id: "tareas", label: "Tareas" }
  ];

  const counts = {
    calendario: state.hospedajes.filter((h) => h.estado === "activo").length,
    perros: state.perros.length,
    pagos: state.pagos.filter((p) => p.estado === "pendiente").length,
    tareas: state.tareas.filter((t) => t.estado !== "hecha").length
  };

  return el(
    "nav",
    { class: "app-tabs" },
    tabs.map((tab) =>
      el(
        "button",
        {
          class: `tab-pill ${state.activeTab === tab.id ? "active" : ""}`,
          onclick: () => {
            state.activeTab = tab.id;
            renderApp(document.getElementById("app"));
          }
        },
        [
          el("span", null, [
            tab.label,
            el("span", { class: "tab-badge" }, counts[tab.id] || 0)
          ])
        ]
      )
    )
  );
}

function renderContent() {
  const content = el("main", { class: "app-content" });
  let view;
  switch (state.activeTab) {
    case "calendario":
      view = renderCalendarioView();
      break;
    case "perros":
      view = renderPerrosView();
      break;
    case "pagos":
      view = renderPagosView();
      break;
    case "tareas":
      view = renderTareasView();
      break;
    default:
      view = el("div");
  }
  content.appendChild(view);
  return content;
}

// Initial setup
window.addEventListener("DOMContentLoaded", async () => {
  if (typeof loadState === 'function') {
    try {
      await loadState();
    } catch (e) {
      console.warn('loadState failed or not available', e);
    }
  }
  state.selectedDate = state.selectedDate ? new Date(state.selectedDate) : new Date(state.today);
  renderApp(document.getElementById("app"));
});

// Listen for re-render events
window.addEventListener("nuba-rerender", () => {
  const root = document.getElementById("app");
  if (root) {
    renderApp(root);
  }
});