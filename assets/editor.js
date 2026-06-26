const sourceContent = window.ABSOLUT_CONTENT || {};
let draft = JSON.parse(JSON.stringify(sourceContent));
let activeTab = "contacts";

const view = document.querySelector("[data-editor-view]");
const title = document.querySelector("[data-editor-title]");
const tabs = document.querySelector("[data-editor-tabs]");

function field(label, path, value, type = "text") {
  return `
    <label class="editor-field">
      <span>${label}</span>
      <input type="${type}" data-path="${path}" value="${escapeAttr(value || "")}">
    </label>
  `;
}

function area(label, path, value) {
  return `
    <label class="editor-field editor-field--wide">
      <span>${label}</span>
      <textarea data-path="${path}">${escapeHtml(value || "")}</textarea>
    </label>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function setPath(path, value) {
  const parts = path.split(".");
  let current = draft;
  while (parts.length > 1) {
    const part = parts.shift();
    current = current[part];
  }
  current[parts[0]] = value;
}

function bindInputs() {
  view.querySelectorAll("[data-path]").forEach((input) => {
    input.addEventListener("input", () => setPath(input.dataset.path, input.value));
  });
}

function renderContacts() {
  title.textContent = "Контакты";
  const settings = draft.settings || {};
  const socials = settings.socials || [];
  view.innerHTML = `
    <div class="editor-grid">
      ${field("Название", "settings.companyName", settings.companyName)}
      ${field("Подпись", "settings.tagline", settings.tagline)}
      ${field("Телефон на сайте", "settings.phoneDisplay", settings.phoneDisplay)}
      ${field("Телефон для ссылки без пробелов", "settings.phoneHref", settings.phoneHref)}
      ${field("Основная почта", "settings.primaryEmail", settings.primaryEmail, "email")}
      ${field("Проектная почта", "settings.projectEmail", settings.projectEmail, "email")}
      ${field("Почта для заявок", "settings.formEmail", settings.formEmail, "email")}
      ${field("Endpoint формы", "settings.formEndpoint", settings.formEndpoint)}
      ${area("Адрес", "settings.address", settings.address)}
      ${field("ИНН", "settings.requisites.inn", settings.requisites?.inn)}
      ${field("КПП", "settings.requisites.kpp", settings.requisites?.kpp)}
      ${field("Расчетный счет", "settings.requisites.account", settings.requisites?.account)}
      ${field("БИК", "settings.requisites.bik", settings.requisites?.bik)}
      ${field("Банк", "settings.requisites.bank", settings.requisites?.bank)}
    </div>
    <div class="editor-list-head">
      <h3>Соцсети</h3>
      <button class="btn btn--glass" type="button" data-add-social>Добавить</button>
    </div>
    <div class="editor-stack">
      ${socials.map((item, index) => `
        <article class="editor-item">
          ${field("Название", `settings.socials.${index}.label`, item.label)}
          ${field("Ссылка", `settings.socials.${index}.url`, item.url)}
          <button class="btn btn--glass" type="button" data-remove-social="${index}">Удалить</button>
        </article>
      `).join("")}
    </div>
  `;
  bindInputs();
  view.querySelector("[data-add-social]")?.addEventListener("click", () => {
    draft.settings.socials.push({ label: "Новая соцсеть", url: "#" });
    renderContacts();
  });
  view.querySelectorAll("[data-remove-social]").forEach((button) => {
    button.addEventListener("click", () => {
      draft.settings.socials.splice(Number(button.dataset.removeSocial), 1);
      renderContacts();
    });
  });
}

function renderProjects() {
  title.textContent = "Проекты";
  view.innerHTML = `
    <div class="editor-list-head">
      <h3>Карточки с качественными фото</h3>
      <button class="btn btn--gold" type="button" data-add-project>Добавить проект</button>
    </div>
    <div class="editor-stack">
      ${draft.projects.map((project, index) => `
        <article class="editor-item editor-item--project">
          <div class="editor-item__top">
            <strong>${escapeHtml(project.title || "Новый проект")}</strong>
            <button class="btn btn--glass" type="button" data-remove-project="${index}">Удалить</button>
          </div>
          <div class="editor-grid">
            ${field("Название", `projects.${index}.title`, project.title)}
            ${field("Мета", `projects.${index}.meta`, project.meta)}
            ${field("Категория", `projects.${index}.category`, project.category)}
            ${field("Статус", `projects.${index}.status`, project.status)}
            ${field("Локация", `projects.${index}.location`, project.location)}
            ${field("Партнер / заказчик", `projects.${index}.client`, project.client)}
            ${field("Путь к фото", `projects.${index}.image`, project.image)}
            ${field("Акцент", `projects.${index}.accent`, project.accent)}
            ${area("Работы", `projects.${index}.works`, project.works)}
            ${area("Факты, каждый с новой строки", `projects.${index}.factsText`, (project.facts || []).join("\\n"))}
          </div>
        </article>
      `).join("")}
    </div>
  `;
  bindInputs();
  view.querySelectorAll("[data-path$='.factsText']").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const index = Number(textarea.dataset.path.split(".")[1]);
      draft.projects[index].facts = textarea.value.split("\n").map((item) => item.trim()).filter(Boolean);
      delete draft.projects[index].factsText;
    });
  });
  view.querySelector("[data-add-project]")?.addEventListener("click", () => {
    draft.projects.push({
      title: "Новый объект",
      meta: "Город · год",
      category: "Жилые комплексы",
      status: "Портфель",
      location: "Город",
      client: "Заказчик",
      works: "Выполненные работы",
      image: "assets/projects/new-project.jpg",
      accent: "ключевой акцент",
      facts: ["факт 1", "факт 2"]
    });
    renderProjects();
  });
  view.querySelectorAll("[data-remove-project]").forEach((button) => {
    button.addEventListener("click", () => {
      draft.projects.splice(Number(button.dataset.removeProject), 1);
      renderProjects();
    });
  });
}

function renderRegistry() {
  title.textContent = "Реестр объектов";
  view.innerHTML = `
    <div class="editor-list-head">
      <h3>Полный деловой список объектов</h3>
      <button class="btn btn--gold" type="button" data-add-registry>Добавить объект</button>
    </div>
    <div class="editor-stack">
      ${draft.objectRegistry.map((row, index) => `
        <article class="editor-item">
          <div class="editor-grid editor-grid--four">
            ${field("Объект", `objectRegistry.${index}.0`, row[0])}
            ${field("Город / адрес", `objectRegistry.${index}.1`, row[1])}
            ${field("Партнер", `objectRegistry.${index}.2`, row[2])}
            ${field("Работы", `objectRegistry.${index}.3`, row[3])}
          </div>
          <button class="btn btn--glass" type="button" data-remove-registry="${index}">Удалить</button>
        </article>
      `).join("")}
    </div>
  `;
  bindInputs();
  view.querySelector("[data-add-registry]")?.addEventListener("click", () => {
    draft.objectRegistry.push(["Новый объект", "Город", "Партнер", "Работы"]);
    renderRegistry();
  });
  view.querySelectorAll("[data-remove-registry]").forEach((button) => {
    button.addEventListener("click", () => {
      draft.objectRegistry.splice(Number(button.dataset.removeRegistry), 1);
      renderRegistry();
    });
  });
}

function renderPartners() {
  title.textContent = "Партнеры";
  view.innerHTML = `
    <div class="editor-list-head">
      <h3>Партнеры и заказчики</h3>
      <button class="btn btn--gold" type="button" data-add-partner>Добавить партнера</button>
    </div>
    <div class="editor-stack">
      ${draft.partners.map((partner, index) => `
        <article class="editor-item">
          <div class="editor-grid">
            ${field("Название", `partners.${index}.0`, partner[0])}
            ${field("Путь к логотипу", `partners.${index}.1`, partner[1])}
            ${field("Описание", `partners.${index}.2`, partner[2])}
          </div>
          <button class="btn btn--glass" type="button" data-remove-partner="${index}">Удалить</button>
        </article>
      `).join("")}
    </div>
  `;
  bindInputs();
  view.querySelector("[data-add-partner]")?.addEventListener("click", () => {
    draft.partners.push(["Новый партнер", "assets/partners/new-logo.png", "Описание"]);
    renderPartners();
  });
  view.querySelectorAll("[data-remove-partner]").forEach((button) => {
    button.addEventListener("click", () => {
      draft.partners.splice(Number(button.dataset.removePartner), 1);
      renderPartners();
    });
  });
}

function renderRaw() {
  title.textContent = "JSON";
  view.innerHTML = `
    <label class="editor-field editor-field--wide">
      <span>Сырые данные</span>
      <textarea class="editor-raw" data-raw-json>${escapeHtml(JSON.stringify(draft, null, 2))}</textarea>
    </label>
    <button class="btn btn--gold" type="button" data-apply-raw>Применить JSON</button>
  `;
  view.querySelector("[data-apply-raw]").addEventListener("click", () => {
    try {
      draft = JSON.parse(view.querySelector("[data-raw-json]").value);
      renderActive();
    } catch (error) {
      alert("Ошибка JSON: " + error.message);
    }
  });
}

function renderActive() {
  tabs.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === activeTab));
  if (activeTab === "contacts") renderContacts();
  if (activeTab === "projects") renderProjects();
  if (activeTab === "registry") renderRegistry();
  if (activeTab === "partners") renderPartners();
  if (activeTab === "raw") renderRaw();
}

function downloadContent() {
  const js = `window.ABSOLUT_CONTENT = ${JSON.stringify(draft, null, 2)};\n`;
  const blob = new Blob([js], { type: "application/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "content.js";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tab]");
  if (!button) return;
  activeTab = button.dataset.tab;
  renderActive();
});

document.querySelectorAll("[data-download-content]").forEach((button) => button.addEventListener("click", downloadContent));
document.querySelector("[data-reset-editor]")?.addEventListener("click", () => {
  draft = JSON.parse(JSON.stringify(sourceContent));
  renderActive();
});

renderActive();
