const HOLIDAY_CONFIG = {
  enabled: true,
  autoEnableInSeason: false
};

const root = document.documentElement;
const tilt = document.getElementById("tilt");
const card = document.getElementById("card");
const tabs = document.getElementById("tabs");
const indicator = document.getElementById("tabIndicator");
const panel = document.getElementById("panel");
const themeToggle = document.getElementById("themeToggle");
const clock = document.getElementById("clock");
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
        <p class="panel-text">Según lo que tu negocio necesita ahora.</p>
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

function holidayInSeason(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    month: "numeric",
    day: "numeric"
  }).formatToParts(date);
  const month = Number(parts.find((part) => part.type === "month").value);
  const day = Number(parts.find((part) => part.type === "day").value);
  return (month === 12 && day >= 1) || (month === 1 && day <= 6);
}

function holidayShouldEnable(config) {
  if (!config.enabled) return false;
  if (!config.autoEnableInSeason) return true;
  return holidayInSeason();
}

function mountHoliday() {
  if (!tilt || document.getElementById("holiday-roots-back")) return;
  if (!holidayShouldEnable(HOLIDAY_CONFIG)) return;
  document.body.classList.add("theme-holiday");
  tilt.insertAdjacentHTML("afterbegin", holidayBackMarkup());
  tilt.insertAdjacentHTML("beforeend", holidayFrontMarkup());
}

function holidayBackMarkup() {
  return `
    <svg id="holiday-roots-back" class="roots-back roots-top" viewBox="0 0 450 200" preserveAspectRatio="xMidYMin meet" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="holiday-back-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#052e16"/>
          <stop offset="50%" stop-color="#14532d"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <path class="vine-grow" d="M75 45 C40 15, 10 22, 4 58 C0 85, 18 110, 32 125" stroke="url(#holiday-back-wood)" stroke-width="9" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-1" d="M120 35 C95 8, 55 4, 30 20" stroke="#065f46" stroke-width="5" stroke-linecap="round"/>
    </svg>
    <div class="roots-back roots-side" aria-hidden="true">
      <svg viewBox="0 0 450 100" preserveAspectRatio="none" fill="none" focusable="false">
        <path class="vine-grow vine-delay-1" d="M18 0 C34 16, 8 34, 28 52 C10 68, 32 84, 16 100" stroke="url(#holiday-back-wood)" stroke-width="8" stroke-linecap="round"/>
        <path class="vine-grow vine-delay-2" d="M432 0 C414 18, 444 36, 420 54 C442 70, 416 86, 434 100" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
      </svg>
    </div>
    <svg class="roots-back roots-bottom" viewBox="0 360 450 240" preserveAspectRatio="xMidYMax meet" fill="none" aria-hidden="true" focusable="false">
      <path class="vine-grow vine-delay-2" d="M35 390 C4 415, 2 475, 32 510" stroke="url(#holiday-back-wood)" stroke-width="8.5" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-3" d="M110 540 C130 572, 185 576, 225 552 C265 576, 325 570, 345 540" stroke="url(#holiday-back-wood)" stroke-width="10" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-4" d="M170 550 C190 578, 255 578, 275 550" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
}

function holidayFrontMarkup() {
  return `
    <svg id="holiday-roots-front" class="roots-front roots-top" viewBox="0 0 450 200" preserveAspectRatio="xMidYMin meet" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id="holiday-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="holiday-front-vine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#166534"/>
          <stop offset="50%" stop-color="#15803d"/>
          <stop offset="100%" stop-color="#22c55e"/>
        </linearGradient>
        <linearGradient id="holiday-dark-branch" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="100%" stop-color="#16a34a"/>
        </linearGradient>
        <radialGradient id="holiday-ball-ruby" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#fca5a5"/>
          <stop offset="28%" stop-color="#ef4444"/>
          <stop offset="75%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </radialGradient>
        <radialGradient id="holiday-ball-gold" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="30%" stop-color="#facc15"/>
          <stop offset="75%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#451a03"/>
        </radialGradient>
        <radialGradient id="holiday-ball-sapphire" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#bfdbfe"/>
          <stop offset="30%" stop-color="#3b82f6"/>
          <stop offset="75%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#172554"/>
        </radialGradient>
      </defs>
      <path class="vine-grow" d="M12 72 C24 34, 62 24, 108 38 C142 48, 162 42, 182 32" stroke="url(#holiday-front-vine)" stroke-width="5.5" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-1" d="M68 32 C54 55, 42 82, 48 112 C52 128, 62 135, 68 138" stroke="url(#holiday-dark-branch)" stroke-width="3.2" stroke-linecap="round"/>
      <g class="needle-pop n-d1" stroke="#22c55e" stroke-width="2" stroke-linecap="round">
        <path d="M92 35 L86 24 M96 36 L102 25 M128 42 L124 31 M134 43 L142 33"/>
        <path d="M52 72 L41 68 M50 86 L39 85"/>
      </g>
      <path class="vine-grow vine-delay-1" d="M432 82 C424 42, 385 24, 345 36 C322 43, 310 58, 316 78 C322 96, 342 104, 355 102" stroke="url(#holiday-front-vine)" stroke-width="5" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-2" d="M398 42 C416 68, 416 105, 396 132" stroke="#15803d" stroke-width="3" stroke-linecap="round"/>
      <g class="needle-pop n-d2" stroke="#4ade80" stroke-width="1.8" stroke-linecap="round">
        <path d="M368 32 L372 21 M355 34 L350 23 M406 88 L417 85"/>
      </g>
      <g filter="url(#holiday-glow)">
        <circle cx="34" cy="44" r="3.5" fill="#fde047" class="fairy-light fl-1"/>
        <circle cx="108" cy="38" r="3.8" fill="#ef4444" class="fairy-light fl-2"/>
        <circle cx="182" cy="32" r="3" fill="#60a5fa" class="fairy-light fl-3"/>
        <circle cx="345" cy="36" r="3.5" fill="#fde047" class="fairy-light fl-1"/>
        <circle cx="316" cy="78" r="3.2" fill="#4ade80" class="fairy-light fl-2"/>
        <circle cx="25" cy="190" r="2" fill="#fde047" class="sparkle-float"/>
        <circle cx="428" cy="180" r="2" fill="#93c5fd" class="sparkle-float sf-2"/>
      </g>
      <g class="ornament-swing o-1">
        <line x1="22" y1="90" x2="22" y2="100" stroke="#facc15" stroke-width="1.5"/>
        <rect x="18.5" y="98" width="7" height="4.5" rx="1.5" fill="#eab308"/>
        <circle cx="22" cy="112" r="12.5" fill="url(#holiday-ball-ruby)"/>
        <ellipse cx="17.5" cy="107" rx="3.5" ry="2" transform="rotate(-30 17.5 107)" fill="#ffffff" opacity="0.75"/>
      </g>
      <g class="ornament-swing o-2">
        <line x1="152" y1="42" x2="152" y2="54" stroke="#facc15" stroke-width="1.3"/>
        <rect x="149.5" y="52" width="5" height="3.5" rx="1" fill="#fde047"/>
        <circle cx="152" cy="64" r="8.5" fill="url(#holiday-ball-gold)"/>
        <ellipse cx="149" cy="60.5" rx="2.5" ry="1.4" transform="rotate(-30 149 60.5)" fill="#ffffff" opacity="0.8"/>
      </g>
      <g class="ornament-swing o-3">
        <line x1="396" y1="132" x2="396" y2="145" stroke="#93c5fd" stroke-width="1.5"/>
        <rect x="392.5" y="143" width="7" height="4" rx="1.5" fill="#cbd5e1"/>
        <circle cx="396" cy="158" r="11" fill="url(#holiday-ball-sapphire)"/>
        <ellipse cx="392" cy="153.5" rx="3" ry="1.8" transform="rotate(-30 392 153.5)" fill="#ffffff" opacity="0.8"/>
      </g>
    </svg>
    <div class="roots-front roots-side" aria-hidden="true">
      <svg viewBox="0 0 450 100" preserveAspectRatio="none" fill="none" focusable="false">
        <path class="vine-grow vine-delay-2" d="M6 0 C26 14, 4 32, 22 50 C6 66, 24 82, 12 100" stroke="url(#holiday-front-vine)" stroke-width="4.5" stroke-linecap="round"/>
        <path class="vine-grow vine-delay-3" d="M444 0 C422 16, 446 34, 426 52 C446 68, 420 84, 438 100" stroke="#16a34a" stroke-width="3.2" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="roots-side-lights" aria-hidden="true">
      <span class="fairy-light fl-2" style="left:2%;top:22%;background:#60a5fa;color:#60a5fa"></span>
      <span class="fairy-light fl-1" style="left:5%;top:58%;background:#fde047;color:#fde047"></span>
      <span class="fairy-light fl-3" style="right:3%;top:30%;background:#ef4444;color:#ef4444"></span>
      <span class="fairy-light fl-2" style="right:6%;top:72%;background:#4ade80;color:#4ade80"></span>
    </div>
    <svg class="roots-front roots-bottom" viewBox="0 360 450 240" preserveAspectRatio="xMidYMax meet" fill="none" aria-hidden="true" focusable="false">
      <path class="vine-grow vine-delay-3" d="M42 362 C36 385, 42 408, 54 422" stroke="#15803d" stroke-width="2.6" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-3" d="M75 562 C62 532, 68 505, 92 496 C110 490, 124 502, 134 512" stroke="url(#holiday-front-vine)" stroke-width="5.2" stroke-linecap="round"/>
      <path class="vine-grow vine-delay-3" d="M375 562 C388 532, 380 502, 354 494 C338 489, 326 498, 318 508" stroke="url(#holiday-front-vine)" stroke-width="5.2" stroke-linecap="round"/>
      <g class="needle-pop n-d3" stroke="#22c55e" stroke-width="2" stroke-linecap="round">
        <path d="M72 522 L60 518 M82 504 L76 493 M378 522 L390 518 M366 502 L372 491"/>
      </g>
      <g class="ornament-swing o-4">
        <line x1="318" y1="508" x2="318" y2="520" stroke="#facc15" stroke-width="1.5"/>
        <rect x="314.5" y="518" width="7" height="4.5" rx="1.5" fill="#eab308"/>
        <circle cx="318" cy="534" r="12" fill="url(#holiday-ball-gold)"/>
        <ellipse cx="313.5" cy="529" rx="3.2" ry="1.8" transform="rotate(-30 313.5 529)" fill="#ffffff" opacity="0.8"/>
      </g>
      <g class="ornament-swing o-5">
        <line x1="54" y1="422" x2="54" y2="434" stroke="#facc15" stroke-width="1.4"/>
        <rect x="51" y="432" width="6" height="4" rx="1.2" fill="#eab308"/>
        <circle cx="54" cy="445" r="9.5" fill="url(#holiday-ball-ruby)"/>
        <ellipse cx="50.5" cy="441" rx="2.6" ry="1.5" transform="rotate(-30 50.5 441)" fill="#ffffff" opacity="0.75"/>
      </g>
      <g filter="url(#holiday-glow)">
        <circle cx="92" cy="496" r="3.8" fill="#fde047" class="fairy-light fl-1"/>
        <circle cx="134" cy="512" r="3" fill="#ef4444" class="fairy-light fl-2"/>
        <circle cx="354" cy="494" r="3.8" fill="#60a5fa" class="fairy-light fl-3"/>
        <circle cx="318" cy="508" r="3" fill="#fde047" class="fairy-light fl-1"/>
        <circle cx="225" cy="565" r="2.2" fill="#fde047" class="sparkle-float sf-3"/>
      </g>
    </svg>`;
}

mountHoliday();
