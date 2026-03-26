import { state, formatDateISO } from "./state.js";
import { state, formatDateISO, saveState } from "./state.js";
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
          el("div", { style: "text-align:right; display:flex; flex-direction:column; gap:6px; align-items:flex-end;" }, [
            (function(){
              const montoEntregado = typeof p.montoEntregado === 'number' ? p.montoEntregado : (p.montoEntregado ? Number(p.montoEntregado) : 0);
              const montoRestante = p.monto - montoEntregado;
              return el("div", null, [
                el("div", { class: "payment-amount" }, [
                  `Gs ${Number(p.monto).toLocaleString('es-PY')}`,
                  montoEntregado > 0 ? el("span", { style: "color:green; font-size:13px; margin-left:8px;" }, `- Gs ${Number(montoEntregado).toLocaleString('es-PY')} entregado`) : null,
                  el("div", { style: "font-size:13px; color:#555;" }, `Restante: Gs ${Number(montoRestante).toLocaleString('es-PY')}`)
                ]),
                el("input", {
                  type: "number",
                  min: 0,
                  max: p.monto,
                  value: montoEntregado,
                  style: "width:90px; margin-top:4px;",
                  onchange: (e) => {
                    p.montoEntregado = Number(e.target.value) || 0;
                    saveState();
                    window.dispatchEvent(new Event('nuba-rerender'));
                  }
                }),
                el("div", null, [
                  filter === "pendientes"
                    ? el(
                        "button",
                        {
                          class: "btn-primary btn-small",
                          onclick: () => {
                            p.estado = "pagado";
                            saveState();
                            window.dispatchEvent(new Event('nuba-rerender'));
                          }
                        },
                        "Marcar pagado"
                      )
                    : null,
                  el(
                    "button",
                    {
                      class: "btn-ghost",
                      onclick: () => {
                        alert('Editar pago (pendiente implementar modal en versión modular)');
                      }
                    },
                    "Editar"
                  ),
                  el(
                    "button",
                    {
                      class: "btn-ghost",
                      style: "color: red;",
                      onclick: () => {
                        if (confirm(`¿Eliminar pago de Gs ${Number(p.monto).toLocaleString('es-PY')}?`)) {
                          state.pagos = state.pagos.filter((x) => x.id !== p.id);
                          saveState();
                          window.dispatchEvent(new Event('nuba-rerender'));
                        }
                      }
                    },
                    "Eliminar"
                  )
                ])
              ]);
            })()
          ])
      ]);
    })
  );
}