let content = window.ABSOLUT_CONTENT || {};
let settings = content.settings || {};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

async function loadContent() {
  try {
    const response = await fetch("assets/content.json", { cache: "no-store" });
    if (!response.ok) return;
    content = await response.json();
    settings = content.settings || {};
    window.ABSOLUT_CONTENT = content;
  } catch (error) {
    // Local file previews can block fetch(); content.js remains the fallback.
  }
}

function initNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });
}

function applySettings() {
  const company = settings.companyName || "ООО «АБСОЛЮТ»";
  const tagline = settings.tagline || "строительная компания";
  const phoneDisplay = settings.phoneDisplay || "8 (800) 201-40-47";
  const phoneHref = settings.phoneHref || "88002014047";
  const primaryEmail = settings.primaryEmail || "absolut-23@mail.ru";
  const projectEmail = settings.projectEmail || "absolut-projekt@mail.ru";
  const address = settings.address || "";

  document.querySelectorAll(".brand strong").forEach((node) => { node.textContent = company; });
  document.querySelectorAll(".brand > span > span").forEach((node) => { node.textContent = tagline; });
  document.querySelectorAll("a[href^='tel:']").forEach((node) => {
    node.href = `tel:${phoneHref}`;
    node.textContent = phoneDisplay;
  });
  document.querySelectorAll("a[href='mailto:absolut-23@mail.ru'], a[data-primary-email]").forEach((node) => {
    node.href = `mailto:${primaryEmail}`;
    node.textContent = primaryEmail;
  });
  document.querySelectorAll("a[href='mailto:absolut-projekt@mail.ru'], a[data-project-email]").forEach((node) => {
    node.href = `mailto:${projectEmail}`;
    node.textContent = projectEmail;
  });
  document.querySelectorAll("[data-company-address]").forEach((node) => { node.textContent = address; });
  document.querySelectorAll("[data-contact-pills]").forEach((root) => {
    const socials = (settings.socials || []).map((item) => `<a href="${escapeHtml(item.url || "#")}">${escapeHtml(item.label)}</a>`).join("");
    root.innerHTML = `
      <a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(phoneDisplay)}</a>
      <a data-primary-email href="mailto:${escapeHtml(primaryEmail)}">${escapeHtml(primaryEmail)}</a>
      <a data-project-email href="mailto:${escapeHtml(projectEmail)}">${escapeHtml(projectEmail)}</a>
      ${socials}
    `;
  });
  document.querySelectorAll(".site-footer .footer-row").forEach((root) => {
    root.innerHTML = `<span>${escapeHtml(company)} · ИНН ${escapeHtml(settings.requisites?.inn || "2312298996")}</span><span>${escapeHtml(primaryEmail)} · ${escapeHtml(phoneDisplay)}</span>`;
  });
}

function initScrollProgress() {
  const bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${value}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initSpotlight() {
  document.querySelectorAll("[data-spotlight]").forEach((section) => {
    section.addEventListener("pointermove", (event) => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      section.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
}

let activeProjectFilter = "all";

function projectCard(project, index) {
  const facts = (project.facts || []).map((fact) => `<li>${escapeHtml(fact)}</li>`).join("");
  return `
    <article class="project-card ${index === 0 ? "project-card--wide" : ""}" data-category="${escapeHtml(project.category)}">
      <a class="project-card__image" href="projects.html" aria-label="${escapeHtml(project.title)}">
        <img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy">
      </a>
      <div class="project-card__body">
        <div class="card-meta">
          <span>${escapeHtml(project.category)}</span>
          <span>${escapeHtml(project.status)}</span>
        </div>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.meta)}</p>
        <div class="project-accent">${escapeHtml(project.accent || project.location)}</div>
        <ul>${facts}</ul>
      </div>
    </article>
  `;
}

function renderProjects() {
  document.querySelectorAll("[data-projects]").forEach((root) => {
    const allProjects = content.projects || [];
    const limit = Number(root.dataset.limit || allProjects.length);
    const projects = allProjects
      .filter((project) => activeProjectFilter === "all" || project.category === activeProjectFilter)
      .slice(0, limit);
    root.innerHTML = projects.map(projectCard).join("");
  });
}

function initProjectFilters() {
  const root = document.querySelector("[data-project-filters]");
  if (!root) return;

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    activeProjectFilter = button.dataset.filter;
    root.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    renderProjects();
  });
}

function renderSocialProjects() {
  document.querySelectorAll("[data-social-projects]").forEach((root) => {
    const allProjects = content.socialProjects || [];
    const limit = Number(root.dataset.limit || allProjects.length);
    root.innerHTML = allProjects.slice(0, limit).map((project) => `
      <article class="social-card ${project.image ? "" : "social-card--text"}">
        ${project.image ? `<img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy">` : ""}
        <div class="social-card__body">
          <span>${escapeHtml(project.type)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.meta)}</p>
        </div>
      </article>
    `).join("");
  });
}

function renderPartners() {
  document.querySelectorAll("[data-partners]").forEach((root) => {
    root.innerHTML = (content.partners || []).map((partner) => {
      const name = Array.isArray(partner) ? partner[0] : partner.name;
      const src = Array.isArray(partner) ? partner[1] : partner.logo;
      const text = Array.isArray(partner) ? partner[2] : partner.description;
      const lightLogo = String(name || "").toLowerCase().includes("точно") || String(src || "").toLowerCase().includes("tochno");
      return `
      <article class="partner-logo ${lightLogo ? "partner-logo--light" : ""}">
        <img src="${src}" alt="${escapeHtml(name)}" loading="lazy">
        <div>
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(text || "Партнер")}</span>
        </div>
      </article>
    `;
    }).join("");
  });
}

function registryRow(row) {
  const name = Array.isArray(row) ? row[0] : row.name;
  const place = Array.isArray(row) ? row[1] : row.place;
  const partner = Array.isArray(row) ? row[2] : row.partner;
  const works = Array.isArray(row) ? row[3] : row.works;
  return `
    <article class="registry-row">
      <strong>${escapeHtml(name)}</strong>
      <span>${escapeHtml(place)}</span>
      <span>${escapeHtml(partner)}</span>
      <span>${escapeHtml(works)}</span>
    </article>
  `;
}

function registrySearchText(row) {
  if (Array.isArray(row)) return row.join(" ");
  return [row.name, row.place, row.partner, row.works].join(" ");
}

function renderRegistry(query = "") {
  document.querySelectorAll("[data-object-registry]").forEach((root) => {
    const normalized = query.trim().toLowerCase();
    const rows = (content.objectRegistry || []).filter((row) => registrySearchText(row).toLowerCase().includes(normalized));
    root.innerHTML = rows.map(registryRow).join("") || `<p class="empty-state">Ничего не найдено</p>`;
  });
}

function initRegistrySearch() {
  const input = document.querySelector("[data-registry-search]");
  renderRegistry();
  if (!input) return;

  input.addEventListener("input", () => renderRegistry(input.value));
}

function initRequestForm() {
  const form = document.querySelector("[data-request-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const status = form.querySelector("[data-form-status]") || document.createElement("p");
    status.className = "form-status";
    status.setAttribute("data-form-status", "");
    if (!status.parentElement) form.append(status);

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    const formEmail = settings.formEmail || settings.primaryEmail || "absolut-23@mail.ru";
    const endpoint = settings.formEndpoint || "";
    if (endpoint) {
      const payload = {
        "Имя": name,
        "Телефон": phone,
        "Комментарий": message,
        "Получатель": formEmail,
        "Источник": window.location.href,
        "_subject": "Заявка с сайта ООО АБСОЛЮТ",
        "_template": "table",
        "_captcha": "false"
      };

      if (button) button.disabled = true;
      status.textContent = "Отправляем заявку...";
      status.dataset.state = "loading";

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(async (response) => {
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error("Request failed");
          if (result.success === false || result.success === "false") {
            throw new Error(result.message || "Request failed");
          }
          form.reset();
          status.textContent = result.message || "Заявка отправлена. Мы свяжемся с вами.";
          status.dataset.state = "success";
        })
        .catch((error) => {
          status.textContent = error.message || "Не удалось отправить заявку. Позвоните или напишите нам на почту.";
          status.dataset.state = "error";
        })
        .finally(() => {
          if (button) button.disabled = false;
        });
      return;
    }
    const subject = encodeURIComponent("Заявка с сайта ООО АБСОЛЮТ");
    const body = encodeURIComponent(
      `Имя: ${name}\nТелефон: ${phone}\nКомментарий: ${message}\n\nИсточник: сайт ООО АБСОЛЮТ`
    );
    window.location.href = `mailto:${formEmail}?subject=${subject}&body=${body}`;
  });
}

async function bootstrap() {
  await loadContent();
  applySettings();
  initNavigation();
  initScrollProgress();
  initSpotlight();
  initProjectFilters();
  renderProjects();
  renderSocialProjects();
  renderPartners();
  initRegistrySearch();
  initRequestForm();
}

bootstrap();
