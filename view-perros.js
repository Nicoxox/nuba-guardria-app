import { state } from "./state.js";
import { el } from "./dom.js";

export function renderPerrosView() {
  const card = el("div", { class: "card card-tight" }, [
    el("div", { class: "card-header" }, [
      el("div", { class: "card-title" }, [
        "Perros registrados",
        el("span", { class: "chip" }, [
          el("span", { class: "chip-dot" }),
          "Perfil, notas, historial"
        ])
      ]),
      el(
        "button",
        {
          class: "btn-ghost",
          onclick: () => {
            alert(
              "Alta rápida de perro (demo): esta versión es un prototipo visual."
            );
          }
        },
        "+ nuevo"
      )
    ]),
    el("div", { class: "scroll-area" }, [
      el(
        "div",
        { class: "pet-list" },
        state.perros.map((p) => renderPetItem(p))
      )
    ])
  ]);
  return card;
}

function renderPetItem(p) {
  const initials = p.nombre.charAt(0);
  const activos = state.hospedajes.filter(
    (h) => h.perroId === p.id && h.estado === "activo"
  ).length;
  const pendientes = state.pagos.filter(
    (pay) => pay.perroId === p.id && pay.estado === "pendiente"
  ).length;

  return el("div", { class: "pet-item" }, [
    el("div", { class: "pet-avatar" }, initials),
    el("div", { class: "pet-main" }, [
      el("div", { class: "pet-name" }, p.nombre),
      el("div", { class: "pet-notes" }, p.notas),
      el("div", { class: "pet-tags" }, [
        p.etiquetas.map((tag) => el("span", { class: "pet-tag" }, tag)),
        activos
          ? el("span", { class: "pet-tag" }, `Hospedajes activos: ${activos}`)
          : null,
        pendientes
          ? el(
              "span",
              { class: "pet-tag" },
              `Pagos pendientes: ${pendientes}`
            )
          : null
      ])
    ])
  ]);
}