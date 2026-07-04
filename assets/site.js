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
  const phoneDisplay = settings.phoneDisplay || "+7 938 524 46 84";
  const phoneHref = settings.phoneHref || "+79385244684";
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

function initMissionCounters() {
  const counters = [...document.querySelectorAll("[data-count-to]")];
  if (!counters.length) return;

  const setValue = (node, value) => {
    node.textContent = `${value}${node.dataset.countSuffix || ""}`;
  };

  const finish = () => counters.forEach((node) => setValue(node, Number(node.dataset.countTo || 0)));
  const panel = counters[0].closest(".mission-panel");

  const animate = () => {
    panel?.classList.add("is-animating");
    counters.forEach((node) => setValue(node, 0));
    const counterDuration = 2600;
    const counterDelay = 280;
    const totalDuration = counterDuration + counterDelay * (counters.length - 1);
    const startedAt = performance.now();

    const step = (now) => {
      const elapsed = now - startedAt;
      counters.forEach((node, index) => {
        const target = Number(node.dataset.countTo || 0);
        const localProgress = Math.min(Math.max((elapsed - index * counterDelay) / counterDuration, 0), 1);
        const localEased = 1 - Math.pow(1 - localProgress, 3);
        setValue(node, Math.round(target * localEased));
      });
      if (elapsed < totalDuration) {
        requestAnimationFrame(step);
      } else {
        finish();
        panel?.classList.remove("is-animating");
        panel?.classList.add("is-ready");
      }
    };

    window.setTimeout(() => requestAnimationFrame(step), 450);
  };

  if (!("IntersectionObserver" in window)) {
    animate();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    animate();
  }, { threshold: 0.35 });

  observer.observe(panel || counters[0]);
}

function initCopyCards() {
  const cards = [...document.querySelectorAll("[data-copy-value]")];
  if (!cards.length) return;

  const writeClipboard = async (value) => {
    let clipboardError = null;
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch (error) {
        clipboardError = error;
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.append(textarea);
    const selection = document.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, value.length);
    const copied = document.execCommand("copy");
    textarea.remove();
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (!copied) throw clipboardError || new Error("Copy failed");
  };

  const showCopied = (card, text = "Скопировано") => {
    const label = card.querySelector("small");
    if (!label) return;
    const previous = label.dataset.defaultText || label.textContent;
    label.dataset.defaultText = previous;
    label.textContent = text;
    card.classList.add("is-copied");
    window.clearTimeout(card._copyTimer);
    card._copyTimer = window.setTimeout(() => {
      label.textContent = previous;
      card.classList.remove("is-copied");
    }, 1400);
  };

  const copy = async (card) => {
    const value = card.dataset.copyValue || "";
    if (!value) return;

    try {
      await writeClipboard(value);
      showCopied(card);
    } catch (error) {
      showCopied(card, "Не удалось скопировать");
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => copy(card));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      copy(card);
    });
  });
}

let activeProjectFilter = "all";

function projectCard(project, index) {
  const facts = (project.facts || []).map((fact) => `<li>${escapeHtml(fact)}</li>`).join("");
  return `
    <article class="project-card" data-category="${escapeHtml(project.category)}">
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
      const lightLogo = ["точно", "екатеринодар"].some((value) => String(name || "").toLowerCase().includes(value))
        || /tochno|ekaterinodar/i.test(String(src || ""));
      return `
      <article class="partner-logo ${lightLogo ? "partner-logo--light" : ""}">
        <div class="partner-logo__media"><img src="${src}" alt="${escapeHtml(name)}" loading="lazy"></div>
        <div class="partner-logo__body">
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

  const fields = {
    name: form.querySelector("[name='name']"),
    phone: form.querySelector("[name='phone']"),
    message: form.querySelector("[name='message']")
  };

  const formatPhone = (value) => {
    const raw = String(value || "").trimStart();
    const startsWithPlus = raw.startsWith("+");
    const rawDigits = raw.replace(/\D/g, "");
    const digits = startsWithPlus
      ? (rawDigits.startsWith("7") ? rawDigits.slice(0, 11) : "")
      : (rawDigits.startsWith("8") ? rawDigits.slice(0, 11) : "");

    if (!digits) return startsWithPlus ? "+" : "";

    const groups = startsWithPlus
      ? [`+${digits.slice(0, 1)}${digits.slice(1, 4)}`, digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)]
      : [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)];

    return groups.filter(Boolean).join(" ").slice(0, 15);
  };

  if (fields.phone) {
    fields.phone.setAttribute("maxlength", "15");
    fields.phone.setAttribute("inputmode", "tel");
    fields.phone.setAttribute("placeholder", "+7900 000 00 00");
    fields.phone.addEventListener("input", () => {
      fields.phone.value = formatPhone(fields.phone.value);
      fields.phone.removeAttribute("aria-invalid");
    });
  }

  const readableFormMessage = (message, fallback) => {
    const text = String(message || "");
    if (/needs activation|activate form/i.test(text)) {
      return "Форма почти готова к приему заявок. Если сообщение не отправилось, напишите нам на рабочую почту или позвоните.";
    }
    if (/failed to fetch|networkerror|load failed/i.test(text)) {
      return "Не удалось отправить заявку: соединение с формой не установлено. Попробуйте еще раз или напишите нам на почту.";
    }
    if (/submitted successfully/i.test(text)) {
      return "Заявка направлена";
    }
    return text || fallback;
  };

  const getStatus = () => {
    const status = form.querySelector("[data-form-status]") || document.createElement("p");
    status.className = "form-status";
    status.setAttribute("data-form-status", "");
    if (!status.parentElement) form.append(status);
    return status;
  };

  const markInvalid = (fieldName) => {
    Object.values(fields).forEach((field) => field?.removeAttribute("aria-invalid"));
    fields[fieldName]?.setAttribute("aria-invalid", "true");
    fields[fieldName]?.focus();
  };

  const clearInvalid = () => {
    Object.values(fields).forEach((field) => field?.removeAttribute("aria-invalid"));
  };

  const validateRequest = ({ name, phone, message }) => {
    if (name.length < 2) {
      return {
        field: "name",
        message: "Проверьте поле «Имя»: укажите имя или название компании, минимум 2 символа."
      };
    }

    const compactPhone = phone.replace(/\s/g, "");
    if (!/^(?:\+7|8)\d{10}$/.test(compactPhone)) {
      return {
        field: "phone",
        message: "Проверьте поле «Телефон»: формат должен быть +7900 000 00 00 или 8900 000 00 00."
      };
    }

    if (message.length > 1200) {
      return {
        field: "message",
        message: "Проверьте поле «Комментарий»: сократите текст до 1200 символов."
      };
    }

    return null;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const status = getStatus();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    const validationError = validateRequest({ name, phone, message });
    if (validationError) {
      markInvalid(validationError.field);
      status.textContent = validationError.message;
      status.dataset.state = "error";
      return;
    }
    clearInvalid();

    const formEmail = settings.formEmail || settings.primaryEmail || "absolut-23@mail.ru";
    const endpoint = settings.formEndpoint || "";
    if (endpoint) {
      const payload = {
        name,
        phone,
        message,
        website: String(data.get("website") || ""),
        source: window.location.href
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
          if (!response.ok || result.success === false || result.success === "false") {
            throw new Error(result.message || "Не удалось отправить заявку. Попробуйте ещё раз.");
          }
          form.reset();
          status.textContent = readableFormMessage(result.message, "Заявка направлена");
          status.dataset.state = "success";
        })
        .catch((error) => {
          status.textContent = readableFormMessage(error.message, "Не удалось отправить заявку. Позвоните или напишите нам на почту.");
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

function initMaterialCatalog() {
  const data = window.ABSOLUT_MATERIALS;
  const filterRoot = document.querySelector("[data-material-filter]");
  const supplierGrid = document.querySelector("[data-material-suppliers]");
  const registryRoot = document.querySelector(".material-registry__groups");
  const queryInput = document.querySelector("[data-material-query]");
  const clearButton = document.querySelector("[data-material-clear]");
  const status = document.querySelector("[data-material-status]");
  const empty = document.querySelector("[data-material-empty]");
  if (!data || !filterRoot || !supplierGrid || !registryRoot || !queryInput) return;

  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();
  const pluralForm = (number, one, few, many) => {
    const value = Math.abs(number) % 100;
    const last = value % 10;
    if (value > 10 && value < 20) return many;
    if (last === 1) return one;
    if (last > 1 && last < 5) return few;
    return many;
  };
  const searchValue = (item, category = "all") => {
    const products = category === "all" ? item.products : (item.productsByCategory?.[category] || []);
    return normalize([item.name, ...(item.aliases || []), ...products].join(" "));
  };
  supplierGrid.innerHTML = data.featured.map((item) => {
    const compact = item.wordmarkSize === "compact" ? " supplier-wordmark--compact" : "";
    const blackMark = item.name === "КВТ" ? " supplier-card__logo--black-mark" : "";
    const logo = item.logo
      ? `<img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.name)}" loading="lazy">`
      : `<strong class="supplier-wordmark${compact}">${escapeHtml(item.name)}</strong>`;
    const description = item.products.join(" · ");
    const tag = item.website ? "a" : "article";
    const linkAttributes = item.website
      ? ` href="${escapeHtml(item.website)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.name)} — открыть официальный сайт"`
      : "";
    return `
      <${tag} class="supplier-card${item.website ? " supplier-card--linked" : ""}"${linkAttributes} data-material-card data-categories="${escapeHtml(item.categories.join(" "))}" data-search="${escapeHtml(searchValue(item))}">
        <div class="supplier-card__logo${blackMark}">
          ${logo}
        </div>
        <div class="supplier-card__body">
          <strong>${escapeHtml(item.name)}</strong>
          <span title="${escapeHtml(description)}">${escapeHtml(description)}</span>
        </div>
      </${tag}>
    `;
  }).join("");

  const registryByCategory = new Map(data.categories.map((category) => [
    category.id,
    data.registry
      .filter((item) => item.categories.includes(category.id))
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
  ]));

  registryRoot.innerHTML = data.categories.map((category) => `
    <details class="brand-group" data-registry-group="${escapeHtml(category.id)}">
      <summary>
        <span>${escapeHtml(category.label)}</span>
        <small><b data-registry-count>${registryByCategory.get(category.id).length}</b> <span data-registry-count-label>брендов</span></small>
      </summary>
      <div class="brand-catalog-grid"></div>
    </details>
  `).join("");

  const buttons = Array.from(filterRoot.querySelectorAll("[data-material-filter-value]"));
  const registryGroups = Array.from(registryRoot.querySelectorAll("[data-registry-group]"));
  let activeCategory = "all";

  const textMatches = (haystack, query) => {
    const words = normalize(query).split(" ").filter(Boolean);
    const haystackWords = haystack.split(" ");
    const wordMatch = (word) => haystack.includes(word)
      || (word.length >= 5 && haystackWords.some((candidate) => candidate.startsWith(word.slice(0, 5))));
    return words.every(wordMatch);
  };

  const itemMatches = (item, query, category = activeCategory) => {
    const categoryMatch = category === "all" || item.categories.includes(category);
    return categoryMatch && textMatches(searchValue(item, category), query);
  };

  const renderRegistryItems = (group, items) => {
    const grid = group.querySelector(".brand-catalog-grid");
    if (!grid) return;
    const category = group.dataset.registryGroup;
    grid.innerHTML = items.map((item) => {
      const description = (item.productsByCategory?.[category] || item.products).join(" · ");
      const mark = item.logo
        ? `<span class="brand-entry__logo${item.name === "КВТ" ? " brand-entry__logo--black" : ""}" aria-hidden="true"><img src="${escapeHtml(item.logo)}" alt="" loading="lazy"></span>`
        : `<span class="brand-entry__mark" aria-hidden="true"><span>${escapeHtml(item.name)}</span></span>`;
      const tag = item.website ? "a" : "article";
      const linkAttributes = item.website
        ? ` href="${escapeHtml(item.website)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.name)} — открыть официальный сайт"`
        : "";
      return `
        <${tag} class="brand-entry${item.website ? " brand-entry--linked" : ""}"${linkAttributes} data-registry-brand>
          ${mark}
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(description)}</p>
          </div>
          ${item.website ? '<span class="brand-entry__external" aria-hidden="true">↗</span>' : ""}
        </${tag}>
      `;
    }).join("");
  };

  const applyFilters = () => {
    const query = queryInput.value;
    const registryNames = new Set();

    data.registry.forEach((item) => {
      if (itemMatches(item, query)) registryNames.add(normalize(item.name));
    });

    registryGroups.forEach((group) => {
      const groupCategory = group.dataset.registryGroup;
      const categoryVisible = activeCategory === "all" || activeCategory === groupCategory;
      const items = categoryVisible
        ? (registryByCategory.get(groupCategory) || []).filter((item) => itemMatches(item, query, groupCategory))
        : [];
      group.hidden = items.length === 0;
      const count = group.querySelector("[data-registry-count]");
      const countLabel = group.querySelector("[data-registry-count-label]");
      if (count) count.textContent = String(items.length);
      if (countLabel) countLabel.textContent = pluralForm(items.length, "бренд", "бренда", "брендов");
      if (query.trim() || activeCategory !== "all") {
        renderRegistryItems(group, items);
        group.open = items.length > 0;
      } else {
        group.open = false;
        renderRegistryItems(group, []);
      }
    });

    if (clearButton) clearButton.hidden = !query;
    if (status) {
      const registryLabel = pluralForm(registryNames.size, "компания", "компании", "компаний");
      status.textContent = `${registryNames.size} ${registryLabel} в каталоге`;
    }
    if (empty) empty.hidden = registryNames.size > 0;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.materialFilterValue || "all";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      applyFilters();
    });
  });

  registryGroups.forEach((group) => {
    group.addEventListener("toggle", () => {
      if (queryInput.value.trim() || activeCategory !== "all") return;
      const category = group.dataset.registryGroup;
      renderRegistryItems(group, group.open ? (registryByCategory.get(category) || []) : []);
    });
  });

  queryInput.addEventListener("input", applyFilters);
  queryInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && queryInput.value) {
      queryInput.value = "";
      applyFilters();
    }
  });
  clearButton?.addEventListener("click", () => {
    queryInput.value = "";
    queryInput.focus();
    applyFilters();
  });

  applyFilters();
}

async function bootstrap() {
  await loadContent();
  applySettings();
  initNavigation();
  initScrollProgress();
  initSpotlight();
  initMissionCounters();
  initCopyCards();
  initProjectFilters();
  renderProjects();
  renderSocialProjects();
  renderPartners();
  initMaterialCatalog();
  initRegistrySearch();
  initRequestForm();
}

bootstrap();
