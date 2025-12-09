import { state, formatDateISO } from "./state.js";
import { el } from "./dom.js";

export function renderPagosView() {
  const card = el("div", { class: "card card-tight" }, [
    el("div", { class: "card-header" }, [
      el("div", { class: "card-title" }, [
        "Pagos",
        el("span", { class: "chip" }, [
          el("span", { class: "chip-dot" }),
          "Pendientes y pagados"
        ])
      ]),
      el("div", { class: "pagos-toggle" }, [
        el(
          "button",
          {
            class: state.pagosFilter === "pendientes" ? "active" : "",
            onclick: () => {
              state.pagosFilter = "pendientes";
              window.dispatchEvent(new Event("nuba-rerender"));
            }
          },
          "Pendientes"
        ),
        el(
          "button",
          {
            class: state.pagosFilter === "pagados" ? "active" : "",
            onclick: () => {
              state.pagosFilter = "pagados";
              window.dispatchEvent(new Event("nuba-rerender"));
            }
          },
          "Pagados"
        )
      ])
    ]),
    el("div", { class: "scroll-area" }, [renderPagosList(state.pagosFilter)])
  ]);

  return card;
}

function renderPagosList(filter) {
  const todayISO = formatDateISO(state.today);
  const list = state.pagos.filter((p) =>
    filter === "pendientes" ? p.estado === "pendiente" : p.estado === "pagado"
  );

  if (list.length === 0) {
    return el(
      "div",
      { class: "empty-state" },
      filter === "pendientes"
        ? "No hay pagos pendientes."
        : "No hay pagos registrados como pagados."
    );
  }

  return el(
    "div",
    null,
    list.map((p) => {
      const perro = state.perros.find((pet) => pet.id === p.perroId);
      const vencido = p.estado === "pendiente" && p.vence < todayISO;
      const statusClass = vencido
        ? "vencido"
        : p.estado === "pendiente"
        ? "pendiente"
        : "pagado";
      const statusLabel = vencido
        ? "Vencido"
        : p.estado === "pendiente"
        ? "Pendiente"
        : "Pagado";

      return el("div", { class: "payment-item" }, [
        el("div", { class: "payment-main" }, [
          el("div", { class: "payment-name" }, perro ? perro.nombre : "Perro"),
          el("div", { class: "payment-meta" }, [
            `Vence: ${p.vence.split("-").reverse().join("/")}`,
            " · ",
            el("span", { class: `payment-status-pill ${statusClass}` }, [
              statusLabel
            ])
          ])
        ]),
        el("div", { style: "text-align:right;" }, [
          el("div", { class: "payment-amount" }, `$${p.monto.toFixed(0)}`),
          filter === "pendientes"
            ? el(
                "button",
                {
                  class: "btn-primary btn-small",
                  onclick: () => {
                    p.estado = "pagado";
                    window.dispatchEvent(new Event("nuba-rerender"));
                  }
                },
                "Marcar pagado"
              )
            : null
        ])
      ]);
    })
  );
}