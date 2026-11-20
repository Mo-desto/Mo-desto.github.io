const root = document.documentElement;
const tilt = document.getElementById("tilt");
const card = document.getElementById("card");
const tabs = document.getElementById("tabs");
const indicator = document.getElementById("tabIndicator");
const panel = document.getElementById("panel");
const themeToggle = document.getElementById("themeToggle");
const clock = document.getElementById("clock");
const logo = document.getElementById("logo");
const mailCopy = document.getElementById("mailCopy");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const order = ["inicio", "servicios", "proceso", "proyectos", "contacto"];

let inicioHTML = "";
let active = "inicio";
let token = 0;
let copyTimer = 0;
let revealTimer = 0;

const icon = (body, size = 18, className = "") =>
  `<svg${className ? ` class="${className}"` : ""} viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const art = (body) =>
  `<svg class="art" viewBox="0 0 64 44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const I = {
  landing: `<rect x="3.5" y="4.5" width="17" height="14" rx="2"/><path d="M3.5 8.5h17"/><path d="M7 12h7"/><path d="M7 15.5h4.5"/>`,
  shop: `<path d="M5 9h14l-1.2 10.5H6.2L5 9z"/><path d="M9 9V7.4A3 3 0 0 1 15 7.4V9"/><path d="M9 13.5h6"/>`,
  calendar: `<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16"/><path d="M8 3.8v3M16 3.8v3"/><circle cx="9" cy="14" r="0.9" fill="currentColor" stroke="none"/><circle cx="12.5" cy="14" r="0.9" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="0.9" fill="currentColor" stroke="none"/>`,
  nodes: `<circle cx="6" cy="12" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><circle cx="18.5" cy="12" r="2.3"/><path d="M8 12h2.2M12 9v6M13.8 8.2 16.6 10.6M13.8 15.8 16.6 13.4"/>`,
  chart: `<path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3.5-4 3 2.5L18 8"/>`,
  window: `<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 8.5h17"/>`,
  arrow: `<path d="M7 17 17 7"/><path d="M9 7h8v8"/>`,
  send: `<path d="M4.5 12 19 5.5 13 19.5 11 13.2 4.5 12z"/><path d="M11 13.2 19 5.5"/>`,
  spinner: `<circle cx="12" cy="12" r="7" stroke-dasharray="22 40"/>`,
  check: `<path d="M5 12.5 9.2 16.5 19 7.5"/>`
};

const artLanding = art(`<rect x="1.5" y="1.5" width="61" height="41" rx="5"/><path d="M1.5 12h61"/><circle cx="8" cy="7" r="1.15" fill="currentColor" stroke="none"/><circle cx="13" cy="7" r="1.15" fill="currentColor" stroke="none" opacity="0.4"/><rect class="hot" x="8" y="18" width="22" height="3" rx="1.5"/><path class="draw" pathLength="1" d="M8 25h16"/><rect class="hot" x="8" y="30" width="14" height="6" rx="2"/><rect class="ghost" x="38" y="18" width="18" height="18" rx="3"/>`);
const artShop = art(`<rect x="3" y="4" width="18" height="16" rx="3"/><rect x="23" y="4" width="18" height="16" rx="3"/><rect class="hot" x="43" y="4" width="18" height="16" rx="3"/><rect x="3" y="24" width="18" height="16" rx="3"/><rect x="23" y="24" width="18" height="16" rx="3"/><path class="draw" pathLength="1" d="M8 32h8"/>`);
const artBook = art(`<rect x="8" y="3" width="48" height="38" rx="5"/><path d="M8 14h48"/><circle cx="18" cy="24" r="1.8" fill="currentColor" stroke="none"/><circle cx="32" cy="24" r="1.8" fill="currentColor" stroke="none" opacity="0.35"/><circle cx="46" cy="24" r="1.8" fill="currentColor" stroke="none" opacity="0.35"/><circle cx="32" cy="34" r="1.8" fill="currentColor" stroke="none"/><circle class="end" cx="46" cy="34" r="2.2"/><path class="draw" pathLength="1" d="M18 24 L32 34 L46 34"/>`);
const artNodes = art(`<circle cx="14" cy="22" r="4"/><circle cx="32" cy="12" r="4"/><circle cx="32" cy="32" r="4"/><circle class="hot" cx="50" cy="22" r="5"/><path class="draw" pathLength="1" d="M18 22H28M32 16V28M35.5 14.5 46 20.5M35.5 29.5 46 23.5"/>`);

const STEPS = [
  {
    kicker: "01 — Descubrimiento",
    title: "Entender el negocio",
    text: "Reviso el rubro, la operación y qué tiene que pasar después del primer contacto."
  },
  {
    kicker: "02 — Diseño UI/UX",
    title: "Ordenar el recorrido",
    text: "Defino la estructura, la jerarquía y el camino hasta la acción. Sin piezas de más."
  },
  {
    kicker: "03 — Desarrollo",
    title: "Construir la pieza",
    text: "Desarrollo el sitio o el sistema con código claro, rápido y simple de usar."
  },
  {
    kicker: "04 — Lanzamiento",
    title: "Publicar y acompañar",
    text: "Lo publico, compruebo que funcione en el día a día y sigo cerca para los ajustes."
  }
];

const views = {
  servicios() {
    return `
      <div class="rise lead">
        <h2 class="panel-title">Servicios</h2>
        <p class="panel-text">Cuatro formas de trabajar, según lo que tu negocio necesita ahora.</p>
      </div>
      ${service("Landing pages", "Una página con un solo objetivo: que te escriban, reserven o compren. Mensaje claro, carga rápida y una acción principal.", I.landing, artLanding)}
      ${service("E-commerce", "Catálogo y checkout con la lógica de tu negocio. Una tienda que se siente propia, no una plantilla genérica.", I.shop, artShop)}
      ${service("Sistema de turnos", "Reservas online para consultorios, estudios, talleres y cualquier rubro que trabaja con agenda.", I.calendar, artBook)}
      ${service("Web a medida", "Cuando hace falta un panel, un flujo o una pieza que no entra en una plantilla. Hecho para cómo trabaja tu equipo.", I.nodes, artNodes)}
    `;
  },
  proceso() {
    return `
      <div class="rise lead">
        <h2 class="panel-title">Proceso</h2>
        <p class="panel-text">Cuatro etapas, de la idea al sitio publicado. Tocá cada una: la línea marca el avance.</p>
      </div>
      <div class="process rise">
        <div class="rail" role="tablist" aria-label="Etapas del proceso">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
            <line class="rail-base" x1="12.5" y1="10" x2="87.5" y2="10"></line>
            <line class="rail-draw" x1="12.5" y1="10" x2="87.5" y2="10" pathLength="100"></line>
          </svg>
          <div class="nodes">
            ${STEPS.map((step, index) => `<button class="node${index === 0 ? " is-on" : ""}" type="button" role="tab" data-step="${index}" aria-selected="${index === 0 ? "true" : "false"}" tabindex="${index === 0 ? "0" : "-1"}" aria-label="${index + 1}. ${step.title}">${index + 1}</button>`).join("")}
          </div>
        </div>
        <div class="process-copy" aria-live="polite">
          <p class="kicker">${STEPS[0].kicker}</p>
          <h3>${STEPS[0].title}</h3>
          <p>${STEPS[0].text}</p>
        </div>
      </div>
    `;
  },
  proyectos() {
    return `
      <div class="rise lead">
        <h2 class="panel-title">Proyectos</h2>
        <p class="panel-text">Piezas reales, de distintos rubros. Cada una resuelve una operación concreta.</p>
      </div>
      <div class="project-list">
        ${project("Rinde", "Calculadora de costos para indumentaria.", I.chart, "/rinde/")}
        ${project("Ciaratex", "Ecommerce Maquineria", I.shop, "https://ciaratex.modestt.com.ar", true)}
        ${project("Celina Tech", "HTML, CSS, JavaScript y SQL.", I.window)}
        ${project("Sistema Conable", "Node, JavaScript y SQL.", I.nodes)}
      </div>
    `;
  },
  contacto() {
    return `
      <div class="rise lead">
        <h2 class="panel-title">Contacto</h2>
        <p class="panel-text">Completá el formulario y contame qué necesitás. Te respondo a la brevedad.</p>
      </div>
      <form class="contact-form rise" id="contactForm">
        <div class="form-group">
          <label for="contactName">Nombre</label>
          <input id="contactName" name="name" type="text" autocomplete="name" maxlength="80" placeholder="Tu nombre" required>
        </div>
        <div class="form-group">
          <label for="contactEmail">Email</label>
          <input id="contactEmail" name="email" type="email" autocomplete="email" inputmode="email" maxlength="120" placeholder="tu@email.com" required>
        </div>
        <fieldset class="type-field">
          <legend>Tipo de proyecto</legend>
          <div class="type-picker">
            ${["Landing Page", "E-commerce", "Sistema de Turnos", "Web a medida"].map((label, index) => `
              <label>
                <input type="radio" name="projectType" value="${label}" ${index === 0 ? "required" : ""}>
                <span>${label}</span>
              </label>
            `).join("")}
          </div>
        </fieldset>
        <div class="form-group">
          <label for="contactMessage">Mensaje</label>
          <textarea id="contactMessage" name="message" maxlength="4000" placeholder="Hola Modest, tengo un negocio de… y quiero consultarte por…" required></textarea>
        </div>
        <p class="form-note" role="status"></p>
        <button class="btn btn-send magnetic" type="submit">
          <span class="btn-ico">${icon(I.send, 16)}</span>
          <span class="btn-label">Enviar consulta</span>
        </button>
        <p class="panel-text alt-line">Si preferís, <a class="inline-link" href="https://wa.me/5491149404743?text=Hola%20Modest%2C%20quiero%20consultar%20por%20un%20proyecto%20web" target="_blank" rel="noopener noreferrer">escribime por WhatsApp</a>.</p>
      </form>
    `;
  }
};

function service(title, text, glyph, graphic) {
  return `
    <article class="service rise">
      <span class="service-ico">${icon(glyph, 18)}</span>
      <div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
      ${graphic}
    </article>
  `;
}

function project(title, text, glyph, href, external) {
  const body = `
    <span class="service-ico">${icon(glyph, 18)}</span>
    <span class="project-copy"><strong>${title}</strong><small>${text}</small></span>
    ${href ? `<span class="arrow">${icon(I.arrow, 16)}</span>` : `<span class="project-gap" aria-hidden="true"></span>`}
  `;
  if (!href) return `<div class="project rise">${body}</div>`;
  const extra = external ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a class="project rise" href="${href}"${extra}>${body}</a>`;
}

const moon = icon(`<path d="M15.5 3.8A7.8 7.8 0 1 0 20.2 15 6.2 6.2 0 0 1 15.5 3.8z"/>`, 24);
const sun = icon(`<circle cx="12" cy="12" r="3.25"/><path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M5.8 5.8l1.3 1.3M16.9 16.9l1.3 1.3M18.2 5.8l-1.3 1.3M7.1 16.9l-1.3 1.3"/>`, 24);

function setThemeUI() {
  const dark = root.classList.contains("dark");
  themeToggle.innerHTML = dark ? sun : moon;
  themeToggle.setAttribute("aria-label", dark ? "Usar tema claro" : "Usar tema oscuro");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", dark ? "#0B0D12" : "#F3F5F8");
}

function toggleTheme() {
  const dark = root.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  setThemeUI();
}

function renderClock() {
  const formatted = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(new Date());
  const next = `${formatted} ART`;
  if (clock.textContent !== next) clock.textContent = next;
  clock.dateTime = new Date().toISOString();
}

function placeIndicator(instant) {
  const button = tabs.querySelector(".tab.active");
  if (!button) return;
  if (instant) indicator.style.transition = "none";
  tabs.style.setProperty("--indicator-x", `${button.offsetLeft}px`);
  tabs.style.setProperty("--indicator-y", `${button.offsetTop}px`);
  tabs.style.setProperty("--indicator-w", `${button.offsetWidth}px`);
  tabs.style.setProperty("--indicator-h", `${button.offsetHeight}px`);
  if (instant) {
    indicator.getBoundingClientRect();
    indicator.style.transition = "";
  }
  tabs.classList.add("is-set");
}

function revealTab(button) {
  const left = button.offsetLeft - (tabs.clientWidth - button.offsetWidth) / 2;
  tabs.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" });
}

function holdSwap() {
  window.clearTimeout(revealTimer);
  revealTimer = window.setTimeout(() => panel.classList.remove("swap-in"), reduced ? 0 : 1200);
}

function markup(name) {
  return name === "inicio" ? inicioHTML : views[name]();
}

function select(name, button, focusForm) {
  if (!button || name === active) return;
  const my = ++token;
  const shift = order.indexOf(name) > order.indexOf(active) ? "16px" : "-16px";
  panel.style.setProperty("--shift", shift);
  tabs.querySelectorAll(".tab").forEach((tab) => {
    const on = tab === button;
    tab.classList.toggle("active", on);
    tab.setAttribute("aria-selected", on ? "true" : "false");
  });
  panel.setAttribute("aria-labelledby", button.id);
  placeIndicator(false);
  revealTab(button);
  active = name;
  window.clearTimeout(revealTimer);
  if (!panel.classList.contains("swap-out")) {
    panel.classList.remove("swap-in");
    panel.classList.add("swap-out");
  }

  window.setTimeout(() => {
    if (my !== token) return;
    panel.innerHTML = markup(name);
    panel.classList.remove("swap-out");
    panel.classList.add("swap-in");
    holdSwap();
    if (name === "proceso") mountProcess(panel);
    bindMagnetic(panel);
    if (focusForm) panel.querySelector("#contactName")?.focus();
  }, reduced ? 0 : 200);
}

function mountProcess(scope) {
  const draw = scope.querySelector(".rail-draw");
  const copy = scope.querySelector(".process-copy");
  const rail = scope.querySelector(".rail");
  const nodes = [...scope.querySelectorAll(".node")];
  let current = 0;

  const set = (index) => {
    if (index === current) return;
    current = index;
    nodes.forEach((node, i) => {
      node.classList.toggle("is-on", i === index);
      node.classList.toggle("is-done", i < index);
      node.setAttribute("aria-selected", i === index ? "true" : "false");
      node.tabIndex = i === index ? 0 : -1;
    });
    draw.style.strokeDashoffset = String(100 - (index / 3) * 100);
    const step = STEPS[index];
    copy.innerHTML = `<p class="kicker">${step.kicker}</p><h3>${step.title}</h3><p>${step.text}</p>`;
    if (!reduced) {
      copy.classList.remove("tick");
      copy.getBoundingClientRect();
      copy.classList.add("tick");
    }
  };

  nodes.forEach((node) => {
    node.addEventListener("click", () => set(Number(node.dataset.step)));
  });

  rail.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? Math.min(3, current + 1) : Math.max(0, current - 1);
    set(next);
    nodes[next].focus();
  });
}

async function sendForm(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector(".btn-send");
  const note = form.querySelector(".form-note");
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  const projectType = String(data.get("projectType") || "");
  const original = button.innerHTML;

  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  note.classList.remove("is-error");
  note.textContent = "";
  button.innerHTML = `<span class="btn-ico">${icon(I.spinner, 16, "spin")}</span><span class="btn-label">Enviando</span>`;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, projectType })
    });
    let data = {};
    try { data = await response.json(); } catch (error) { data = {}; }
    if (!response.ok || !data.success) throw new Error(data.error || "Error al enviar");

    form.reset();
    note.textContent = "Listo. Recibí tu mensaje y te respondo a la brevedad.";
    button.innerHTML = `<span class="btn-ico">${icon(I.check, 16)}</span><span class="btn-label">Enviado</span>`;
    window.setTimeout(() => {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.innerHTML = original;
      bindMagnetic(form);
    }, 1600);
  } catch (error) {
    note.textContent = "No se pudo enviar. Intentá de nuevo en un momento.";
    note.classList.add("is-error");
    button.disabled = false;
    button.removeAttribute("aria-busy");
    button.innerHTML = original;
    bindMagnetic(form);
  }
}

function bindMagnetic(scope) {
  if (reduced || !finePointer) return;
  scope.querySelectorAll(".magnetic").forEach((el) => {
    if (el.dataset.bound === "1") return;
    el.dataset.bound = "1";
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.classList.add("is-magnet");
      el.style.transform = `translate3d(${clamp(x * 0.15, -6, 6)}px, ${clamp(y * 0.25, -4, 4)}px, 0)`;
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-magnet");
      el.style.transform = "";
    });
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const motion = {
  current: { rx: 0, ry: 0, sx: 50, sy: 18 },
  target: { rx: 0, ry: 0, sx: 50, sy: 18 },
  frame: 0,
  hot: false
};

function startMotion() {
  if (motion.frame) return;
  const step = () => {
    const c = motion.current;
    const t = motion.target;
    c.rx += (t.rx - c.rx) * 0.12;
    c.ry += (t.ry - c.ry) * 0.12;
    c.sx += (t.sx - c.sx) * 0.14;
    c.sy += (t.sy - c.sy) * 0.14;
    tilt.style.transform = `rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg)`;
    card.style.setProperty("--sx", `${c.sx.toFixed(2)}%`);
    card.style.setProperty("--sy", `${c.sy.toFixed(2)}%`);
    const idle = !motion.hot
      && Math.abs(t.rx - c.rx) < 0.02
      && Math.abs(t.ry - c.ry) < 0.02
      && Math.abs(t.sx - c.sx) < 0.08
      && Math.abs(t.sy - c.sy) < 0.08;
    if (idle) {
      motion.frame = 0;
      tilt.style.transform = "";
      tilt.classList.remove("is-live");
      return;
    }
    motion.frame = requestAnimationFrame(step);
  };
  tilt.classList.add("is-live");
  motion.frame = requestAnimationFrame(step);
}

function bindSpotlight() {
  if (reduced || !finePointer) return;
  const stage = document.querySelector(".stage");
  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = card.getBoundingClientRect();
    const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    motion.target.sx = px * 100;
    motion.target.sy = py * 100;
    motion.target.ry = (px - 0.5) * 6.5;
    motion.target.rx = (0.5 - py) * 5.5;
    motion.hot = true;
    card.classList.add("is-hot");
    startMotion();
  });
  stage.addEventListener("pointerleave", () => {
    motion.target.rx = 0;
    motion.target.ry = 0;
    motion.target.sx = 50;
    motion.target.sy = 18;
    motion.hot = false;
    card.classList.remove("is-hot");
    startMotion();
  });
}

async function copyMail() {
  const mail = mailCopy.dataset.mail;
  try {
    await navigator.clipboard.writeText(mail);
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = mail;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  const label = mailCopy.querySelector(".mail-copy-label");
  mailCopy.classList.add("is-copied");
  label.textContent = "Copiado";
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    mailCopy.classList.remove("is-copied");
    label.textContent = mail;
  }, 1600);
}

themeToggle.addEventListener("click", toggleTheme);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  if (localStorage.getItem("theme")) return;
  root.classList.toggle("dark", event.matches);
  setThemeUI();
});
document.getElementById("goContact").addEventListener("click", () => {
  select("contacto", document.getElementById("tab-contacto"), true);
});

tabs.addEventListener("click", (event) => {
  const button = event.target.closest(".tab");
  if (!button) return;
  select(button.dataset.tab, button, false);
});

tabs.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const buttons = [...tabs.querySelectorAll(".tab")];
  const index = buttons.indexOf(document.activeElement);
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === "ArrowRight"
    ? (index + 1) % buttons.length
    : (index - 1 + buttons.length) % buttons.length;
  buttons[next].focus();
  select(buttons[next].dataset.tab, buttons[next], false);
});

panel.addEventListener("submit", (event) => {
  if (event.target.id === "contactForm") sendForm(event);
});

mailCopy.addEventListener("click", copyMail);

logo.addEventListener("mouseenter", () => {
  if (reduced) return;
  logo.classList.remove("is-draw");
  logo.getBoundingClientRect();
  logo.classList.add("is-draw");
});

window.addEventListener("resize", () => placeIndicator(true), { passive: true });

inicioHTML = panel.innerHTML.trim();
holdSwap();
placeIndicator(true);
bindMagnetic(document);
bindSpotlight();
setThemeUI();
renderClock();
window.setInterval(renderClock, 1000);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => placeIndicator(true));
}
