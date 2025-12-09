import { state, saveState } from "./state.js";
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
    el("div", { class: "pet-avatar" }, p.foto ? el("img", { src: p.foto, style: "width:40px;height:40px;border-radius:50%;object-fit:cover;" }) : initials),
    el("div", { class: "pet-main" }, [
      el("div", { class: "pet-name" }, p.nombre),
      el("div", { class: "pet-notes" }, p.cliente ? `Cliente: ${p.cliente}` : p.notas),
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
    ]),
    el("div", null, [
      el(
        "button",
        {
          class: "btn-ghost",
          onclick: () => {
            alert('Ver perfil (pendiente modal en versión modular)');
          }
        },
        "Ver Perfil"
      ),
      el(
        "button",
        {
          class: "btn-ghost",
          style: "color: red;",
          onclick: () => {
            if (confirm(`¿Eliminar a ${p.nombre}?`)) {
              state.perros = state.perros.filter((x) => x.id !== p.id);
              saveState();
              window.dispatchEvent(new Event('nuba-rerender'));
            }
          }
        },
        "Eliminar"
      )
    ])
  ]);
}