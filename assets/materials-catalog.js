(() => {
  const categories = [
    { id: "water", label: "Водоснабжение и водоотведение" },
    { id: "heating", label: "Отопление и климат" },
    { id: "ventilation", label: "Вентиляция и пожарные системы" },
    { id: "construction", label: "Крепёж и общестрой" }
  ];

  const entries = new Map();
  const keyFor = (value) => String(value || "")
    .toLocaleLowerCase("ru-RU")
    .replace(/[«»"']/g, "")
    .replace(/\s+/g, " ")
    .trim();

  function add(category, product, brands) {
    brands.forEach((name) => {
      const key = keyFor(name);
      const item = entries.get(key) || { name, categories: new Set(), products: new Set(), productsByCategory: new Map(), aliases: new Set() };
      item.categories.add(category);
      item.products.add(product);
      const categoryProducts = item.productsByCategory.get(category) || new Set();
      categoryProducts.add(product);
      item.productsByCategory.set(category, categoryProducts);
      entries.set(key, item);
    });
  }

  add("water", "Трубопроводные системы из сшитого полиэтилена PEX", ["HENCO", "Rehau", "Usystems (Uponor)", "ProAqua", "STOUT", "MVI", "Valtec"]);
  add("water", "Полипропиленовые трубы и фитинги PPR", ["ProAqua", "Политэк", "VALFEX"]);
  add("water", "Трубы и фитинги PPR для систем пожаротушения", ["FIREPROFF"]);
  add("water", "Трубопроводные системы из нержавеющей стали", ["Stahlmann"]);
  add("water", "Насосное оборудование", ["Wilo", "Wester", "CNP", "Vandjord", "Shinhoo", "Oasis", "Pumpman", "Unipump", "Джилекс", "Ливнынасос", "IMP Pump", "SFA", "DAB"]);
  add("water", "Водосливная арматура, сифоны и трапы", ["HL", "Wirquin", "VIRPlast", "АНИПЛАСТ", "ТПК Татполимер"]);
  add("water", "Техническая изоляция трубопроводов", ["ROLS ISOMARKET", "K-FLEX"]);
  add("water", "Системы внутренней и наружной канализации", ["Ostendorf", "Политэк", "ProAqua", "Хемкор", "VALFEX"]);
  add("water", "ПНД-трубы и системы из полиэтилена ПЭ100", ["Джилекс", "Политэк", "Геопласт Полимер", "Plastic Pipe", "КТЗ", "УЗПК"]);
  add("water", "Запорная и регулирующая трубопроводная арматура", ["Ридан (Danfoss)", "Tecofi", "Broen", "ADL", "LD", "ALSO", "Neptun", "STOUT", "LD Pride", "MVI", "ЛМЗ Семенов", "DENDOR", "БАЗ", "AQUALINK", "VALFEX", "Хит Комплект", "Techno"]);
  add("water", "Ёмкости и септики", ["Байкал"]);
  add("water", "Контрольно-измерительные приборы", ["РОСМА", "Гранд", "Декаст М", "STOUT", "Норма ИС", "RGP", "LEFOO"]);
  add("water", "Системы водоочистки и фильтрации", ["Аквафор", "Гейзер", "Гидротек"]);
  add("water", "Смесители и сантехническая арматура", ["TSARSBERG", "PROFSAN"]);

  add("heating", "Котельное оборудование и автоматика котельных", ["BAXI", "De Dietrich", "Vaillant", "Protherm", "ЭВАН", "Hubert", "Moguchi", "Kentatsu", "METEOR Thermo", "Gidruss", "Zont", "My Heat", "Oasis", "Бастион", "УТДК"]);
  add("heating", "Водонагреватели и бойлеры", ["BAXI", "Protherm", "Philips", "Tesy", "Hajdu", "ЭВАН", "Royal Thermo", "Electrolux", "Ballu", "Thermex", "Oasis", "Ресанта"]);
  add("heating", "Стальные, алюминиевые, биметаллические и трубчатые радиаторы", ["Oasis", "METEOR Thermo", "VALFEX", "Русский Радиатор", "Rifar", "OGINT", "Konner", "НРЗ", "EVRA", "Royal Thermo", "Rommer", "STOUT", "Zehnder"]);
  add("heating", "Водяные внутрипольные и настенные конвекторы", ["Isoterm", "Gekon", "Royal Thermo"]);
  add("heating", "Электрические конвекторы", ["ENSTO", "Electrolux", "Thermex", "Ballu", "Oasis Klima", "Hintek", "Ресанта", "AC Electric", "ENGY"]);
  add("heating", "Полотенцесушители", ["Олимп", "Двин", "Royal Thermo"]);
  add("heating", "Блочные тепловые пункты и теплообменники", ["Ридан", "Этра"]);
  add("heating", "Электрические тёплые полы и системы обогрева", ["ДЕВИ", "Systeme Electric", "ССТ", "EKF", "Теплолюкс", "EXTHERM", "REXANT", "ENSTO"]);

  add("ventilation", "Вытяжные бытовые вентиляторы", ["DiCiTi", "Soler & Palau", "ERA", "Ballu", "Electrolux", "Awenta", "Cata", "ZERNBERG", "AURAMAX"]);
  add("ventilation", "Системы воздуховодов", ["ERA", "ZERNBERG", "Awenta", "ORE"]);
  add("ventilation", "Вентиляционные решётки и воздухораспределители", ["ERA", "Awenta", "Арктос", "Naveka", "ZERNBERG", "EVECS", "AURAMAX"]);
  add("ventilation", "Приточные и приточно-вытяжные установки", ["Naveka", "Фьорди", "FUNAI", "VentArt"]);
  add("ventilation", "Компоненты наборной вентиляции: нагреватели, охладители и шумоглушители", ["ERA", "Naveka", "Тепломаш", "VentArt"]);
  add("ventilation", "Канальные вентиляторы", ["Naveka", "ERA", "Shuft", "Тепломаш", "ESQ", "VentArt"]);
  add("ventilation", "Осевые и центробежные вентиляторы", ["ERA", "ZERNBERG", "Shuft", "Тепломаш", "ESQ"]);
  add("ventilation", "Воздушные завесы", ["TERMA", "Тепломаш", "Ballu", "Hintek", "ГРЕЕРС", "Zilon"]);
  add("ventilation", "Водяные и электрические тепловентиляторы", ["VOLCANO", "TERMA", "Тепломаш", "Ballu", "ГРЕЕРС", "Zilon", "VentArt", "СКРАП", "ENGY"]);
  add("ventilation", "Тепловые пушки, тепловентиляторы и теплогенераторы", ["Ballu", "Oasis", "Royal Clima", "Thermex", "Zilon", "Арктос", "Тепломаш", "PATRIOT", "REXANT", "ENGY", "Hintek", "Ресанта"]);
  add("ventilation", "Кондиционеры и сплит-системы", ["Daikin", "Bosch", "LG", "Kentatsu", "Midea", "QuattroClima", "Fujitsu", "Tosot", "Lessar", "Hisense", "Royal Clima", "FUNAI", "HITACHI", "AUX", "EcoClima", "Ballu", "Electrolux", "Daichi", "Axioma", "Primera", "Dahaci", "Oasis", "Shuft"]);
  add("ventilation", "Бытовая климатическая техника: увлажнители, осушители и вентиляторы", ["Thermex", "Ballu", "Electrolux", "Ecostar", "FUNAI", "Puff", "Royal Clima", "Ресанта", "KITFORT", "Oasis", "REXANT", "ENERGY", "СКРАП"]);
  add("ventilation", "Бытовая техника", ["KITFORT", "Oasis", "Leonord", "ORE", "ENERGY", "HomeStar", "Матрёна"]);

  add("construction", "Анкерная техника", ["Крепдил", "КМП", "Партнер", "Руфкомплект", "TECH-KREP", "Fischer", "PRO SORMAT", "PRO BEST-Крепёж"]);
  add("construction", "Гвозди и заклёпки", ["Крепдил", "РФ", "Партнер", "Руфкомплект", "Daxmer", "PRO SORMAT", "TECH-KREP", "Авалда"]);
  add("construction", "Дюбельная техника", ["Крепдил", "Европартнер", "Партнер", "Daxmer", "Fischer", "PRO SORMAT", "TECH-KREP"]);
  add("construction", "Метрический крепёж", ["Крепдил", "Партнер", "РФ", "Руфкомплект", "Партнер К", "Расвет", "Параллель", "TECH-KREP", "Завод Контакт", "Суперкрепеж", "ОПМ (ПроТек)"]);
  add("construction", "Дюймовый крепёж", ["OM-Groupp", "Спецмашметиз", "Реком", "Сенсор"]);
  add("construction", "Пены и герметики", ["Oklent", "ROOF"]);
  add("construction", "Нержавеющий крепёж", ["PRO BEST-Крепёж", "КМП", "Партнер", "Европартнер"]);
  add("construction", "Перфорированные детали: уголки, пластины и опоры", ["Руфкомплект", "Daxmer", "PRO SORMAT", "TECH-KREP", "Партнер"]);
  add("construction", "Стальные монтажные ленты", ["Мир Хомутов", "Руфкомплект", "TECH-KREP"]);
  add("construction", "Саморезы и шурупы", ["Крепдил", "РФ", "Партнер", "Руфкомплект", "Daxmer", "TECH-KREP"]);
  add("construction", "Такелаж", ["Крепдил", "КМП", "Партнер", "Руфкомплект", "Танис", "Мечел-Сервис", "КЗТИ", "TECH-KREP"]);
  add("construction", "Трубные и монтажные хомуты", ["Мир Хомутов", "КМП", "СТРАЙК", "MAYER"]);
  add("construction", "Замки и скобяные изделия", ["Компания ПТК"]);
  add("construction", "САПР, BIM и специализированное проектное ПО", ["nanoCAD", "Renga", "CADElectro", "Model Studio CS"]);

  add("water", "Пластиковая сантехническая арматура", ["АНИПЛАСТ"]);
  add("water", "Смесители российского производства", ["СЛАВЕН"]);
  add("water", "Шаровые краны, клапаны, фильтры, фитинги и пресс-системы", ["Santech Systems"]);
  add("water", "Инженерная сантехника и регулирующая арматура", ["Aquasfera"]);
  add("water", "Запорная арматура для трубопроводов и пожаротушения", ["BENARMO"]);
  add("water", "Стальная и чугунная трубопроводная арматура", ["FORTECA"]);
  add("water", "Чугунные и стальные ванны и поддоны", ["Selena"]);
  add("water", "Резьбовые фитинги из ковкого чугуна", ["FITTEX Plus"]);
  add("water", "Стальные трубные хомуты", ["Strongman"]);
  add("water", "Чугунные безраструбные канализационные системы", ["SML"]);
  add("water", "Канализационные системы и водоотведение", ["СИНИКОН"]);
  add("water", "Трубопроводные системы PEX", ["SPL"]);
  add("water", "Трубопроводная и запорная арматура", ["РАШВОРК"]);
  add("water", "Трубы для отопления и охлаждения, фитинги и коллекторы", ["POC"]);
  add("water", "Поставка сантехники и инженерного оборудования", ["Сантехкомплект"]);
  add("heating", "Отопительное оборудование, радиаторы и насосы", ["OGINT"]);
  add("heating", "Стальные панельные радиаторы и внутрипольные конвекторы", ["HEATON"]);

  add("ventilation", "Промышленное вентиляционное оборудование", ["ВЕЗА", "Завод Вентилятор", "VENTZ", "Завод ЮгВентКом", "Практика"]);
  add("ventilation", "Пожарное оборудование и системы противопожарной защиты", ["Пожтехника", "СД Групп"]);
  add("ventilation", "Огнезащитные материалы", ["ОГНЕЗА"]);
  add("ventilation", "Автоматика и управление инженерными системами", ["ОВЕН"]);
  add("construction", "Электротехнический инструмент и монтажное оборудование", ["КВТ"]);
  add("construction", "Профессиональный крепёж и метизы", ["ПРОММЕТИЗ"]);
  add("construction", "Общестроительные и отделочные материалы", ["Alta Construction", "CHERBROOKE"]);

  const logoByName = {
    "ВЕЗА": null,
    "Завод Вентилятор": null,
    "VENTZ": "assets/materials/ventz.png",
    "Завод ЮгВентКом": "assets/materials/yugventkom.svg",
    "Пожтехника": "assets/materials/pozhtehnika.png",
    "ОГНЕЗА": "assets/materials/ogneza.png",
    "СД Групп": "assets/materials/sd-group.webp",
    "Практика": "assets/materials/praktika-light.png",
    "ОВЕН": "assets/materials/oven.svg",
    "КВТ": "assets/materials/kvt-inverse.svg",
    "АНИПЛАСТ": "assets/materials/aniplast.png",
    "СЛАВЕН": "assets/materials/slaven.png",
    "Santech Systems": "assets/materials/santechsystems.png",
    "Strongman": "assets/materials/strongman.png",
    "FORTECA": "assets/materials/forteca.png",
    "Aquasfera": "assets/materials/aquasfera.png",
    "BENARMO": "assets/materials/benarmo.png",
    "OGINT": "assets/materials/ogint.png",
    "POC": "assets/materials/poc.png",
    "Selena": "assets/materials/selena.png",
    "FITTEX Plus": "assets/materials/fittex-plus.png",
    "Сантехкомплект": "assets/materials/santechkomplekt.png",
    "Alta Construction": "assets/materials/alta-construction.png",
    "ПРОММЕТИЗ": "assets/materials/prommetiz.svg",
    "CHERBROOKE": "assets/materials/cherbrooke.svg"
  };

  const featuredOrder = [
    "Сантехкомплект", "LD Pride", "OGINT", "BENARMO", "FORTECA", "HEATON", "POC",
    "Santech Systems", "Aquasfera", "Selena", "СЛАВЕН", "FITTEX Plus", "Strongman",
    "АНИПЛАСТ", "SML", "СИНИКОН", "SPL", "РАШВОРК", "Alta Construction",
    "ВЕЗА", "Завод Вентилятор", "VENTZ", "Завод ЮгВентКом", "ОВЕН", "ОГНЕЗА",
    "Пожтехника", "Практика", "СД Групп", "КВТ", "ПРОММЕТИЗ", "CHERBROOKE"
  ];

  const wordmarkSize = {
    "Завод Вентилятор": "compact",
    "Сантехкомплект": "compact",
    "РАШВОРК": "compact",
    "СИНИКОН": "compact"
  };

  const registry = Array.from(entries.values()).map((item) => ({
    name: item.name,
    categories: Array.from(item.categories),
    products: Array.from(item.products),
    productsByCategory: Object.fromEntries(Array.from(item.productsByCategory, ([category, products]) => [category, Array.from(products)])),
    aliases: Array.from(item.aliases),
    logo: logoByName[item.name] || null
  }));

  const byKey = new Map(registry.map((item) => [keyFor(item.name), item]));
  const featured = featuredOrder.map((name) => {
    const item = byKey.get(keyFor(name));
    return item ? { ...item, logo: logoByName[name] || null, wordmarkSize: wordmarkSize[name] || "" } : null;
  }).filter(Boolean);

  window.ABSOLUT_MATERIALS = { categories, registry, featured };
})();
