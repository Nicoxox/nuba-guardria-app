import { state, formatDateISO, addMonths, getMonthDays, isSameDay } from "./state.js";
import { el } from "./dom.js";

export function renderCalendarioView() {
  const container = el("div", { class: "calendar-card card" });

  const monthDate = addMonths(state.today, state.calendarMonthOffset);
  const monthLabel = monthDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
  });

  const header = el("div", { class: "calendar-header" }, [
    el("div", null, [
      el(
        "div",
        { class: "calendar-month" },
        monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
      ),
      el("div", { class: "card-subtitle" }, "Hospedajes por día")
    ]),
    el("div", { class: "calendar-nav" }, [
      el(
        "button",
        {
          onclick: () => {
            state.calendarMonthOffset -= 1;
            const root = document.getElementById("app");
            if (root) {
              // re-render handled in app.js via global renderApp
              window.dispatchEvent(new Event("nuba-rerender"));
            }
          }
        },
        "‹"
      ),
      el(
        "button",
        {
          onclick: () => {
            state.calendarMonthOffset = 0;
            window.dispatchEvent(new Event("nuba-rerender"));
          }
        },
        "•"
      ),
      el(
        "button",
        {
          onclick: () => {
            state.calendarMonthOffset += 1;
            window.dispatchEvent(new Event("nuba-rerender"));
          }
        },
        "›"
      )
    ])
  ]);

  const weekdaysRow = ["L", "M", "X", "J", "V", "S", "D"].map((d) =>
    el("div", { class: "calendar-weekday" }, d)
  );

  const days = getMonthDays(monthDate.getFullYear(), monthDate.getMonth());
  const selectedDate = state.selectedDate || state.today;

  const daysNodes = days.map((d) => {
    if (!d) return el("div");
    const dayISO = formatDateISO(d);
    const staysOnDay = state.hospedajes.filter(
      (h) => dayISO >= h.desde && dayISO <= h.hasta
    );
    const hasStays = staysOnDay.length > 0;
    const isToday = isSameDay(d, state.today);
    const isSelected =
      isSameDay(d, selectedDate) && state.calendarMonthOffset === 0
        ? true
        : isSameDay(d, selectedDate);

    const classes = ["calendar-day"];
    if (isToday) classes.push("is-today");
    if (hasStays) classes.push("has-stays");
    if (isSelected) classes.push("selected");

    return el(
      "button",
      {
        class: classes.join(" "),
        onclick: () => {
          state.selectedDate = d;
          window.dispatchEvent(new Event("nuba-rerender"));
        }
      },
      [
        el("div", { class: "calendar-day-inner" }, [
          el("span", { class: "calendar-day-number" }, d.getDate())
        ]),
        hasStays
          ? el(
              "div",
              { class: "calendar-day-badge" },
              staysOnDay.length > 9 ? "9+" : staysOnDay.length
            )
          : null
      ]
    );
  });

  const grid = el("div", { class: "calendar-grid" }, [
    ...weekdaysRow,
    ...daysNodes
  ]);

  container.appendChild(header);
  container.appendChild(grid);

  const selectedISO = formatDateISO(state.selectedDate || state.today);
  const dayStays = state.hospedajes.filter(
    (h) => selectedISO >= h.desde && selectedISO <= h.hasta
  );

  const summaryRow = el("div", { class: "day-summary" }, [
    el("span", null, [
      "Día ",
      el("strong", null, selectedISO.split("-").reverse().join("/"))
    ]),
    el("div", { class: "small-pill-row" }, [
      el("span", { class: "small-pill" }, [
        "Hospedajes: ",
        el("strong", null, dayStays.length.toString())
      ])
    ])
  ]);

  container.appendChild(summaryRow);

  const listCard = el(
    "div",
    { class: "card card-tight", style: "margin-top:6px;" },
    [
      el("div", { class: "card-header" }, [
        el("div", { class: "card-title" }, [
          "Hospedajes del día",
          el("span", { class: "chip" }, [
            el("span", { class: "chip-dot" }),
            "Programado / Activo / Completado"
          ])
        ]),
        el(
          "button",
          {
            class: "btn-ghost",
            onclick: () => {
              state.modal = { type: "hospedaje", date: selectedISO };
              window.dispatchEvent(new Event("nuba-rerender"));
            }
          },
          "+ nuevo"
        )
      ]),
      el("div", { class: "scroll-area" }, [
        dayStays.length === 0
          ? el("div", { class: "empty-state" }, "No hay hospedajes para este día.")
          : dayStays.map(renderStayItem)
      ])
    ]
  );

  const wrapper = el("div");
  wrapper.appendChild(container);
  wrapper.appendChild(listCard);
  return wrapper;
}

function renderStayItem(h) {
  const perro = state.perros.find((p) => p.id === h.perroId);
  const initials = perro ? perro.nombre.charAt(0) : "?";
  const statusClass = h.estado;
  const statusLabel =
    h.estado === "activo"
      ? "Activo"
      : h.estado === "completado"
      ? "Completado"
      : "Programado";

  return el("div", { class: "stay-item" }, [
    el("div", { class: "stay-avatar" }, initials),
    el("div", { class: "stay-main" }, [
      el("div", { class: "stay-name" }, perro ? perro.nombre : "Perro"),
      el(
        "div",
        { class: "stay-meta" },
        `Hab. ${h.habitacion} · ${h.desde.split("-").reverse().join("/")}` +
          ` – ${h.hasta.split("-").reverse().join("/")}`
      )
    ]),
    el("div", null, [
      el("span", { class: `stay-status ${statusClass}` }, statusLabel)
    ])
  ]);
}