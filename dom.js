export const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === "dataset" && v && typeof v === "object") {
      Object.entries(v).forEach(([dk, dv]) => (node.dataset[dk] = dv));
    } else {
      node.setAttribute(k, v);
    }
  });
  const append = (c) => {
    if (c == null) return;
    if (Array.isArray(c)) c.forEach(append);
    else if (typeof c === "string" || typeof c === "number") {
      node.appendChild(document.createTextNode(c));
    } else {
      node.appendChild(c);
    }
  };
  append(children);
  return node;
};