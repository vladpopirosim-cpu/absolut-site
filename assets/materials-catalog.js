(() => {
  const categories = [
    { id: "water", label: "Водоснабжение и водоотведение" },
    { id: "heating", label: "Отопление и климат" },
    { id: "ventilation", label: "Вентиляция и пожарные системы" },
    { id: "construction", label: "Крепёж и материалы" }
  ];

  const entries = new Map();
  const keyFor = (value) => String(value || "")
    .toLocaleLowerCase("ru-RU")
    .replace(/[«»"']/g, "")
    .replace(/\s+/g, " ")
    .trim();

  function add(category, product, brands, aliases = []) {
    brands.forEach((name) => {
      const key = keyFor(name);
      const item = entries.get(key) || { name, categories: new Set(), products: new Set(), productsByCategory: new Map(), aliases: new Set() };
      item.categories.add(category);
      item.products.add(product);
      const categoryProducts = item.productsByCategory.get(category) || new Set();
      categoryProducts.add(product);
      item.productsByCategory.set(category, categoryProducts);
      aliases.forEach((alias) => item.aliases.add(alias));
      entries.set(key, item);
    });
  }

  add("water", "Трубопроводные системы из сшитого полиэтилена PEX", ["HENCO", "Rehau", "Usystems (Uponor)", "ProAqua", "STOUT", "MVI", "Valtec"]);
  add("water", "Полипропиленовые трубы и фитинги для инженерных систем", ["RTP"], ["РТП", "РосТурПласт"]);
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
  add("ventilation", "Бытовая климатическая техника: увлажнители, осушители и вентиляторы", ["Thermex", "Ballu", "Electrolux", "Ecostar", "FUNAI", "Royal Clima", "Ресанта", "KITFORT", "Oasis", "REXANT", "ENERGY", "СКРАП"]);
  add("ventilation", "Бытовая техника", ["KITFORT", "Oasis", "Leonord", "ORE", "ENERGY", "HomeStar", "Матрёна"]);

  add("construction", "Анкерная техника", ["Крепдил", "КМП", "Партнер", "Руфкомплект", "TECH-KREP", "Fischer", "PRO SORMAT", "PRO BEST-Крепёж"]);
  add("construction", "Гвозди и заклёпки", ["Крепдил", "РФ", "Партнер", "Руфкомплект", "Daxmer", "PRO SORMAT", "TECH-KREP", "Авалда"]);
  add("construction", "Дюбельная техника", ["Крепдил", "Европартнер", "Партнер", "Daxmer", "Fischer", "PRO SORMAT", "TECH-KREP"]);
  add("construction", "Метрический крепёж", ["Крепдил", "Партнер", "РФ", "Руфкомплект", "Партнер К", "Расвет", "Параллель", "TECH-KREP", "Завод Контакт", "Суперкрепеж", "ОПМ", "ПроТек"]);
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
  add("water", "Электросушители для рук и оборудование для санитарных помещений", ["Puff"]);
  add("heating", "Отопительное оборудование, радиаторы и насосы", ["OGINT"]);
  add("heating", "Стальные панельные радиаторы и внутрипольные конвекторы", ["HEATON"]);

  add("ventilation", "Промышленное вентиляционное оборудование", ["ВЕЗА", "Завод Вентилятор", "VENTZ", "Завод ЮгВентКом"]);
  add("ventilation", "Воздуховоды, комплектующие и монтаж вентиляционных систем", ["Alta Construction"]);
  add("ventilation", "Пожарное оборудование и системы противопожарной защиты", ["Пожтехника", "СД Групп"]);
  add("ventilation", "Огнезащитные материалы", ["ОГНЕЗА"]);
  add("ventilation", "Автоматика и управление инженерными системами", ["ОВЕН"]);
  add("construction", "Электротехнический инструмент и монтажное оборудование", ["КВТ"]);
  add("construction", "Профессиональный крепёж и метизы", ["ПРОММЕТИЗ"]);
  add("construction", "Профессиональный инструмент и расходная оснастка", ["Практика"]);
  add("construction", "Материалы для отделки и монтажных задач", ["CHERBROOKE"]);

  const logoByName = {
    "ВЕЗА": "assets/materials/veza.svg",
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
    "Ридан (Danfoss)": "assets/materials/danfoss.svg",
    "HENCO": "assets/materials/henco.png",
    "Rehau": "assets/materials/rehau.svg",
    "Wilo": "assets/materials/wilo.svg",
    "EVRA": "assets/materials/evra.png",
    "РАШВОРК": "assets/materials/rashwork.png",
    "СИНИКОН": "assets/materials/sinikon.png",
    "RTP": "assets/materials/rtp.svg",
    "Puff": "assets/materials/puff.svg",
    "ProAqua": "assets/materials/site-logos/proaqua.ru.png",
    "VIRPlast": "assets/materials/site-logos/virplast.ru.png",
    "УЗПК": "assets/materials/site-logos/uzpk.ru.png",
    "ALSO": "assets/materials/site-logos/also.su.png",
    "Гидротек": "assets/materials/site-logos/gidrotek.ru.png",
    "PROFSAN": "assets/materials/site-logos/profsan.ru.png",
    "Gidruss": "assets/materials/site-logos/gidruss.ru.png",
    "Zont": "assets/materials/site-logos/zont-online.ru.png",
    "ДЕВИ": "assets/materials/site-logos/devi.ru.png",
    "AURAMAX": "assets/materials/site-logos/auramax.ru.png",
    "TERMA": "assets/materials/site-logos/termaheat.com.png",
    "QuattroClima": "assets/materials/site-logos/quattroclima.ru.png",
    "HITACHI": "assets/materials/site-logos/jci-hitachi.com.png",
    "Daxmer": "assets/materials/site-logos/daxmer.ru.png",
    "Суперкрепеж": "assets/materials/site-logos/superkrepezh.ru.png",
    "PRO BEST-Крепёж": "assets/materials/site-logos/pro-best.ru.png",
    "Европартнер": "assets/materials/site-logos/europartner.ru.png",
    "ОПМ": "assets/materials/site-logos/optprommetiz.ru.png",
    "Techno": "assets/materials/techno-wordmark.png",
    "РФ": "assets/materials/rf-wordmark.png",
    "Партнер К": "assets/materials/partner-k-wordmark.png",
    "POC": "assets/materials/poc.png",
    "Selena": "assets/materials/selena.png",
    "FITTEX Plus": "assets/materials/fittex-plus.png",
    "Сантехкомплект": "assets/materials/santechkomplekt.png",
    "Alta Construction": "assets/materials/alta-construction.png",
    "ПРОММЕТИЗ": "assets/materials/prommetiz.svg",
    "CHERBROOKE": "assets/materials/cherbrooke.svg"
  };

  const websiteByName = {
    "Bosch": "https://www.bosch-homecomfort.com/",
    "Midea": "https://www.midea.com/",
    "LG": "https://www.lg.com/",
    "Daikin": "https://www.daikin.com/",
    "Electrolux": "https://www.electrolux.com/",
    "Ридан (Danfoss)": "https://www.danfoss.com/",
    "Ридан": "https://ridan.ru/",
    "Vaillant": "https://www.vaillant.com/",
    "Rehau": "https://www.rehau.com/",
    "Wilo": "https://wilo.com/",
    "HENCO": "https://www.henco.be/en/home",
    "EVRA": "https://evra.su/",
    "РАШВОРК": "https://www.rushwork.ru/",
    "BAXI": "https://www.baxi.com/",
    "Сантехкомплект": "https://www.santech.ru/",
    "OGINT": "https://ogint.ru/",
    "BENARMO": "https://benarmo.ru/",
    "Aquasfera": "https://aquasfera.ru/",
    "ВЕЗА": "https://www.veza.ru/",
    "Завод Вентилятор": "https://zavodventilator.ru/",
    "ОВЕН": "https://owen.ru/",
    "ОГНЕЗА": "https://ogneza.com/",
    "КВТ": "https://kvt.su/",
    "АНИПЛАСТ": "https://aniplast.ru/",
    "СИНИКОН": "https://www.sinikon.ru/",
    "Danfoss": "https://www.danfoss.com/",
    "Philips": "https://www.philips.com/",
    "Fujitsu": "https://www.fujitsu-general.com/global/",
    "HITACHI": "https://www.hitachiaircon.com/",
    "Royal Thermo": "https://www.royal-thermo.ru/",
    "Protherm": "https://www.protherm.eu/",
    "De Dietrich": "https://www.dedietrich-heating.com/",
    "Uponor": "https://www.uponor.com/",
    "Usystems (Uponor)": "https://www.uponor.com/",
    "STOUT": "https://www.stout.ru/",
    "VALFEX": "https://valfex.ru/",
    "Wester": "https://wester-rus.ru/",
    "Unipump": "https://unipump.ru/",
    "Джилекс": "https://jeelex.ru/",
    "DAB": "https://www.dabpumps.com/",
    "SFA": "https://www.sfa.ru/",
    "Ostendorf": "https://www.ostendorf-kunststoffe.com/",
    "K-FLEX": "https://www.kflex.com/",
    "Аквафор": "https://www.aquaphor.ru/",
    "Гейзер": "https://geizer.com/",
    "Rifar": "https://rifar.ru/",
    "Zehnder": "https://www.zehndergroup.com/",
    "ENSTO": "https://www.ensto.com/",
    "Systeme Electric": "https://systeme.ru/",
    "EKF": "https://ekfgroup.com/",
    "Ballu": "https://ballu.ru/",
    "Thermex": "https://thermex.ru/",
    "Soler & Palau": "https://www.solerpalau.com/",
    "ERA": "https://era.trade/",
    "Shuft": "https://shuft.ru/",
    "Royal Clima": "https://royalclima.ru/",
    "Hisense": "https://www.hisense.com/",
    "Fischer": "https://www.fischer.group/",
    "nanoCAD": "https://www.nanocad.ru/",
    "Renga": "https://rengabim.com/"
    ,"RTP": "https://rtp.ru/"
    ,"ProAqua": "https://www.proaqua.pro/"
    ,"MVI": "https://mvi-rus.ru/"
    ,"Valtec": "https://valtec.ru/"
    ,"Политэк": "https://politek-pipe.ru/"
    ,"FIREPROFF": "https://fireproff.ru/"
    ,"Stahlmann": "https://stahlmann.ru/"
    ,"CNP": "https://www.cnppump.com/"
    ,"Vandjord": "https://vandjord.ru/"
    ,"Shinhoo": "https://www.shinhoopump.com/"
    ,"Oasis": "https://oasis-home.ru/"
    ,"Pumpman": "https://www.pumpman.com/"
    ,"Ливнынасос": "https://livnynasos.ru/"
    ,"IMP Pump": "https://imp-pumps.com/"
    ,"HL": "https://www.hutterer-lechner.com/"
    ,"Wirquin": "https://www.wirquin.com/"
    ,"VIRPlast": "https://www.wirquingroup.com/"
    ,"ТПК Татполимер": "https://tatpolimer.ru/"
    ,"ROLS ISOMARKET": "https://rols-isomarket.ru/"
    ,"Хемкор": "https://hemkor.ru/"
    ,"Геопласт Полимер": "https://geoplastpolymer.ru/"
    ,"КТЗ": "https://ktz.ru/"
    ,"УЗПК": "https://pocom.ru/"
    ,"Tecofi": "https://www.tecofi.fr/"
    ,"Broen": "https://www.broen.com/"
    ,"ADL": "https://adl.ru/"
    ,"LD": "https://ldcompany.ru/"
    ,"ALSO": "https://alsoarm.ru/"
    ,"Neptun": "https://neptun-mcs.ru/"
    ,"LD Pride": "https://ld-pride.ru/"
    ,"ЛМЗ Семенов": "https://lmz-semenov.ru/"
    ,"DENDOR": "https://dendor.ru/"
    ,"БАЗ": "https://baz-armatura.ru/"
    ,"AQUALINK": "https://aqualink.ru/"
    ,"Хит Комплект": "https://hitkomplekt.ru/"
    ,"РОСМА": "https://rosma.ru/"
    ,"Декаст М": "https://decast.ru/"
    ,"Норма ИС": "https://normais.ru/"
    ,"LEFOO": "https://www.lefoo.com/"
    ,"Гидротек": "https://www.spbfilter.ru/"
    ,"TSARSBERG": "https://tsarsberg.ru/"
    ,"PROFSAN": "https://profsan-psm.ru/"
    ,"СЛАВЕН": "https://slaven.ru/"
    ,"Santech Systems": "https://www.santech.ru/"
    ,"SPL": "https://spl.ru/"
    ,"ЭВАН": "https://www.evan.ru/"
    ,"Hubert": "https://hubertclimate.ru/"
    ,"Moguchi": "https://moguchi.ru/"
    ,"Kentatsu": "https://kentatsurussia.ru/"
    ,"METEOR Thermo": "https://meteorthermo.ru/"
    ,"Gidruss": "https://web.gidruss.ru/"
    ,"Zont": "https://zont.online/"
    ,"My Heat": "https://myheat.net/"
    ,"Бастион": "https://bast.ru/"
    ,"УТДК": "https://utdk.ru/"
    ,"Tesy": "https://tesy.com/"
    ,"Hajdu": "https://hajdurt.hu/"
    ,"Ресанта": "https://resanta.ru/"
    ,"Русский Радиатор": "https://rus-radiator.ru/"
    ,"Konner": "https://konner.ru/"
    ,"Rommer": "https://rommer.ru/"
    ,"Isoterm": "https://isoterm.ru/"
    ,"Gekon": "https://gekon.ru/"
    ,"Oasis Klima": "https://oasis-climate.ru/"
    ,"Hintek": "https://hintek.ru/"
    ,"AC Electric": "https://ac-electric.ru/"
    ,"ENGY": "https://engy.ru/"
    ,"Двин": "https://dvin.ru/"
    ,"Этра": "https://etra.ru/"
    ,"ДЕВИ": "https://www.devi.com/"
    ,"ССТ": "https://sst.ru/"
    ,"Теплолюкс": "https://teploluxe.ru/"
    ,"EXTHERM": "https://extherm.ru/"
    ,"REXANT": "https://rexant.ru/"
    ,"DiCiTi": "https://diciti.ru/"
    ,"Awenta": "https://awenta.pl/"
    ,"Cata": "https://www.cata.com/"
    ,"ZERNBERG": "https://zernberg.com/"
    ,"AURAMAX": "https://era.trade/"
    ,"Арктос": "https://arktos.ru/"
    ,"Naveka": "https://naveka.ru/"
    ,"EVECS": "https://evecs.ru/"
    ,"Фьорди": "https://fiordi.ru/"
    ,"FUNAI": "https://funai-aircon.com/"
    ,"VentArt": "https://ventart.ru/"
    ,"Тепломаш": "https://teplomash.ru/"
    ,"ESQ": "https://esq-group.ru/"
    ,"ГРЕЕРС": "https://greers.ru/"
    ,"Zilon": "https://zilon.ru/"
    ,"VOLCANO": "https://volcano.com.pl/"
    ,"PATRIOT": "https://patriotgarden.ru/"
    ,"QuattroClima": "https://quattroclima.biz/"
    ,"Tosot": "https://tosot.ru/"
    ,"Lessar": "https://lessar.com/"
    ,"AUX": "https://aux-air.ru/"
    ,"EcoClima": "https://ecoclima.ru/"
    ,"Daichi": "https://daichi.ru/"
    ,"Axioma": "https://axioma-air.ru/"
    ,"Primera": "https://primera-air.ru/"
    ,"Ecostar": "https://ecostar.ru/"
    ,"Puff": "https://www.puff-inc.ru/"
    ,"KITFORT": "https://kitfort.ru/"
    ,"ENERGY": "https://energy-russia.ru/"
    ,"HomeStar": "https://homestar.ru/"
    ,"VENTZ": "https://ventzavod.ru/"
    ,"Пожтехника": "https://pozhtehnika.ru/"
    ,"TECH-KREP": "https://tech-krep.ru/"
    ,"Daxmer": "https://www.roofcom.ru/"
    ,"Завод Контакт": "https://zavod-kontakt.ru/"
    ,"Суперкрепеж": "https://www.super-krepeg.ru/"
    ,"OM-Groupp": "https://om-groupp.ru/"
    ,"Спецмашметиз": "https://specmashmetiz.ru/"
    ,"Oklent": "https://oklent.ru/"
    ,"Мир Хомутов": "https://mirhomutov.ru/"
    ,"Танис": "https://tanis.ru/"
    ,"Мечел-Сервис": "https://mechel-service.ru/"
    ,"КЗТИ": "https://kzti.ru/"
    ,"CADElectro": "https://www.cadelectro.ru/"
    ,"Model Studio CS": "https://modelstudiocs.ru/"
    ,"ПРОММЕТИЗ": "https://bronebolt.com/"
    ,"Plastic Pipe": "https://plastic-pipe.ru/"
    ,"RGP": "https://r-g-p.ru/"
    ,"НРЗ": "https://nrz-radiator.ru/"
    ,"Олимп": "https://olimpdv.ru/"
    ,"ORE": "https://vent-sn.ru/"
    ,"TERMA": "https://www.terma.pro/"
    ,"СКРАП": "https://skrap.ru/"
    ,"Dahaci": "https://dahaci.com/"
    ,"Leonord": "https://skrap.ru/brands/leonord/"
    ,"Матрёна": null
    ,"Крепдил": null
    ,"Руфкомплект": "https://rufkomplekt.ru/"
    ,"PRO SORMAT": "https://sormat.com/"
    ,"PRO BEST-Крепёж": "https://best-krepeg.ru/"
    ,"Авалда": "https://avalda.ru/"
    ,"Европартнер": "https://europartner.su/"
    ,"СТРАЙК": "https://strikeshop.ru/"
    ,"FORTECA": "https://www.santech.ru/brands/forteca/"
    ,"Selena": "https://www.santech.ru/brands/selena/"
    ,"FITTEX Plus": "https://www.santech.ru/brands/fittex-plus/"
    ,"Strongman": "https://www.santech.ru/brands/strongman/"
    ,"SML": null
    ,"POC": "https://www.santech.ru/"
    ,"HEATON": "https://www.santech.ru/brands/heaton/"
    ,"Байкал": "https://xn--80aabspdhdg5buo.xn--p1ai/"
    ,"Гранд": "https://www.turbo-don.ru/"
    ,"КМП": "https://kmp-trade.ru/"
    ,"Партнер": "https://partner-dv.ru/"
    ,"Расвет": "https://rasvetnt.ru/"
    ,"Параллель": "https://bolt57.ru/"
    ,"ОПМ": "https://opm.ru/"
    ,"ПроТек": "https://protec-krepezh.ru/"
    ,"Реком": "https://zavod-rekom.ru/"
    ,"Сенсор": "https://www.sensor45.ru/"
    ,"ROOF": "https://www.roofcom.ru/"
    ,"MAYER": "https://mayerfix.ru/"
    ,"Компания ПТК": "https://zamki.biz/"
    ,"Завод ЮгВентКом": "https://svs-air.com/"
    ,"СД Групп": "https://sdgroup-kuban.ru/"
    ,"CHERBROOKE": "https://cherbrooke.ru/"
    ,"Практика": "https://praktika-rus.ru/"
    ,"Alta Construction": null
  };

  const featuredOrder = [
    "Ридан (Danfoss)", "Rehau", "HENCO", "Wilo", "РАШВОРК",
    "EVRA", "ВЕЗА", "СИНИКОН", "BENARMO", "FORTECA"
  ];

  const wordmarkSize = {
    "Завод Вентилятор": "compact",
    "Сантехкомплект": "compact",
    "РАШВОРК": "compact",
    "СИНИКОН": "compact"
  };

  const siteLogoFor = (website) => {
    if (!website) return null;
    try {
      const hostname = new URL(website).hostname.replace(/^www\./, "").replace(/[^a-z0-9.-]/gi, "-");
      return `assets/materials/site-logos/${hostname}.png`;
    } catch {
      return null;
    }
  };

  const registry = Array.from(entries.values()).map((item) => ({
    name: item.name,
    categories: Array.from(item.categories),
    products: Array.from(item.products),
    productsByCategory: Object.fromEntries(Array.from(item.productsByCategory, ([category, products]) => [category, Array.from(products)])),
    aliases: Array.from(item.aliases),
    logo: logoByName[item.name] || siteLogoFor(websiteByName[item.name]),
    website: websiteByName[item.name] || null
  }));

  const byKey = new Map(registry.map((item) => [keyFor(item.name), item]));
  const featured = featuredOrder.map((name) => {
    const item = byKey.get(keyFor(name));
    return item ? {
      ...item,
      logo: logoByName[name] || siteLogoFor(websiteByName[name]),
      website: websiteByName[name] || null,
      wordmarkSize: wordmarkSize[name] || ""
    } : null;
  }).filter(Boolean);

  window.ABSOLUT_MATERIALS = { categories, registry, featured };
})();
