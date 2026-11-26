/* NusaStat views — hash router and one renderer per section.
   Every page is built from NUSA data; every control on a page works. */
'use strict';

var Views = (function () {
  var viewEl = null;
  var searchQuery = '';
  var popRange = 'all';       /* population chart range: 'all' | 'recent' */
  var gdpRange = 'all';
  var provSort = { key: 'pop', dir: -1 };
  var provQuery = '';

  function byId(id) {
    for (var i = 0; i < NUSA.INDICATORS.length; i++) {
      if (NUSA.INDICATORS[i].id === id) return NUSA.INDICATORS[i];
    }
    return null;
  }

  function kpi(ind, accent) {
    var v = Charts.fmt(ind.value, ind.value < 10 && ind.value % 1 !== 0 ? 2 : (ind.value % 1 !== 0 ? 1 : 0));
    return '<div class="kpi' + (accent ? ' accent' : '') + '">' +
      '<div class="k-label">' + Charts.esc(ind.name) + '</div>' +
      '<div class="k-value">' + v + ' <small>' + Charts.esc(ind.unit) + '</small></div>' +
      '<div class="k-sub">' + Charts.esc(ind.note) + '</div>' +
      '<div class="k-src">' + Charts.esc(ind.source) + ' · ' + ind.year + (ind.rank ? ' · ' + Charts.esc(ind.rank) : '') + '</div></div>';
  }

  function srcLine(sources) {
    return '<p class="section-note">Source: ' + sources.map(Charts.esc).join(' · ') + '</p>';
  }

  function rangeToggle(which, current) {
    return '<span class="toggle" role="group" aria-label="Chart range">' +
      '<button type="button" data-range="' + which + '|all" aria-pressed="' + (current === 'all') + '">2015–2024</button>' +
      '<button type="button" data-range="' + which + '|recent" aria-pressed="' + (current === 'recent') + '">2019–2024</button></span>';
  }

  function sliceSeries(series, range) {
    return range === 'recent' ? series.filter(function (p) { return p.year >= 2019; }) : series;
  }

  function hero(title, intro) {
    return '<section class="hero"><h1>' + title + '</h1><p>' + intro + '</p>' +
      '<p class="updated">Figures as published · updated ' + Charts.esc(NUSA.COUNTRY.updated) + '</p></section>';
  }

  /* ---------------- Overview ---------------- */
  function overview() {
    var h = hero('Indonesia in <em>numbers</em>',
      '283.5 million people, the world\u2019s 16th largest economy, and 38 provinces spread over ' +
      '17,000 islands. NusaStat brings the country\u2019s official statistics together in one place — ' +
      'every figure with its source and year.');
    h += '<div class="kpis">' +
      kpi(byId('pop'), true) + kpi(byId('gdp')) + kpi(byId('gdppc')) +
      kpi(byId('unemp')) + kpi(byId('lifeexp')) + kpi(byId('poverty')) + '</div>';

    h += '<div class="grid2">' +
      '<section class="panel"><div class="panel-head"><h3>Population, 2015–2024</h3>' + rangeToggle('pop', popRange) + '</div>' +
      Charts.lineChart(sliceSeries(NUSA.SERIES.population, popRange), { label: 'Population of Indonesia, millions', decimals: 1, unit: 'million' }) +
      '<p class="section-note">Millions of people. ' + Charts.esc(NUSA.SRC.wdi) + ', 2024.</p></section>' +
      '<section class="panel"><div class="panel-head"><h3>GDP growth, 2015–2024</h3>' + rangeToggle('gdp', gdpRange) + '</div>' +
      Charts.barChart(sliceSeries(NUSA.SERIES.gdpGrowth, gdpRange), { label: 'Annual GDP growth, percent', decimals: 1 }) +
      '<p class="section-note">Real GDP growth, % per year. The 2020 dip is the pandemic recession. ' + Charts.esc(NUSA.SRC.wdi) + '.</p></section></div>';

    h += '<h2>Explore by topic</h2><p class="lede">Start with a question — the sections below answer it with the latest published figures.</p>' +
      '<div class="chips">' +
      '<a class="chip" href="#/population">How many people live here?</a>' +
      '<a class="chip" href="#/economy">How big is the economy?</a>' +
      '<a class="chip" href="#/people">How healthy and educated are people?</a>' +
      '<a class="chip" href="#/regions">Where do people live?</a>' +
      '<a class="chip" href="#/about">Where do these numbers come from?</a></div>';

    h += '<h2>Find an indicator</h2>' +
      '<p class="lede">Search all ' + NUSA.INDICATORS.length + ' headline indicators. Type in the box above, or here:</p>' +
      '<div class="field"><label for="ind-search">Indicator search</label>' +
      '<input id="ind-search" type="search" placeholder="Try “poverty”, “internet”, “inflation”… " value="' + Charts.esc(searchQuery) + '"></div>' +
      '<div class="ind-grid" id="ind-grid"></div><p class="result-count" id="ind-count"></p>';

    h += '<h2>Latest releases</h2><p class="lede">The newest figures added to this portal, with their publisher.</p>' +
      '<ul class="releases">' + NUSA.RELEASES.map(function (r) {
        return '<li><span class="r-date">' + Charts.esc(r.date) + '</span><span><span class="r-title">' + Charts.esc(r.title) + '</span><br><span class="r-meta">' + Charts.esc(r.meta) + '</span></span></li>';
      }).join('') + '</ul>';
    return h;
  }

  function renderIndicators() {
    var grid = document.getElementById('ind-grid');
    var count = document.getElementById('ind-count');
    if (!grid) return;
    var q = searchQuery.trim().toLowerCase();
    var list = NUSA.INDICATORS.filter(function (ind) {
      return !q || (ind.name + ' ' + ind.group + ' ' + ind.note).toLowerCase().indexOf(q) !== -1;
    });
    if (!list.length) {
      grid.innerHTML = '<p class="empty">No indicator matches “' + Charts.esc(searchQuery) + '”. Try “population”, “GDP” or “school”.</p>';
    } else {
      grid.innerHTML = list.map(function (ind) {
        var v = Charts.fmt(ind.value, ind.value < 10 && ind.value % 1 !== 0 ? 2 : (ind.value % 1 !== 0 ? 1 : 0));
        return '<article class="ind"><div class="i-name">' + Charts.esc(ind.name) + '</div>' +
          '<div class="i-value">' + v + ' <small style="font-size:14px;color:var(--muted)">' + Charts.esc(ind.unit) + '</small></div>' +
          '<div class="i-meta">' + Charts.esc(ind.group) + ' · ' + Charts.esc(ind.source) + ' · ' + ind.year + '<br>' + Charts.esc(ind.note) + '</div></article>';
      }).join('');
    }
    if (count) count.textContent = list.length + ' of ' + NUSA.INDICATORS.length + ' indicators shown.';
  }

  /* ---------------- Population ---------------- */
  function population() {
    var h = hero('Population: <em>283.5 million</em> people',
      'Indonesia is the world\u2019s fourth most populous country. The population grows about 0.8% a year, ' +
      'is young — median age under 30 — and increasingly urban: 58.8% now live in towns and cities.');
    h += '<div class="kpis">' + kpi(byId('pop'), true) + kpi(byId('popgrowth')) + kpi(byId('density')) + kpi(byId('urban')) + kpi(byId('medianage')) + kpi(byId('fertility')) + '</div>';
    h += '<div class="grid2">' +
      '<section class="panel"><div class="panel-head"><h3>Population growth</h3>' + rangeToggle('pop', popRange) + '</div>' +
      Charts.lineChart(sliceSeries(NUSA.SERIES.population, popRange), { label: 'Population, millions', decimals: 1, unit: 'million' }) +
      srcLine([NUSA.SRC.wdi + ' (2024)']) + '</section>' +
      '<section class="panel"><h3>Who lives here — age structure</h3>' +
      Charts.hbarChart(NUSA.AGE_STRUCTURE.map(function (a) { return { label: a.group, value: a.value }; }),
        { label: 'Share of population by age group', decimals: 1, unit: '%', footnote: 'Share of total population, 2024. World Bank WDI.' }) +
      '<ul class="factlist"><li><strong>24.6%</strong> of Indonesians are under 15 — a large cohort still in school.</li>' +
      '<li><strong>68%</strong> are of working age (15–64).</li>' +
      '<li><strong>7.3%</strong> are 65 or older, and that share is rising every year.</li></ul></section></div>';
    var top10 = NUSA.PROVINCES.slice(0, 10).map(function (p) { return { label: p.name, value: p.pop }; });
    h += '<section class="panel wide" style="margin-top:16px"><h3>The ten largest provinces</h3>' +
      Charts.hbarChart(top10, { label: 'Population of the ten largest provinces, millions', decimals: 1, unit: 'm', footnote: 'Millions of residents, BPS mid-2025 estimates. Java\u2019s three big provinces alone hold about 131 million people.' }) +
      '<p style="margin-top:10px"><a href="#/regions">See all provinces and island groups →</a></p></section>';
    return h;
  }

  /* ---------------- Economy ---------------- */
  function economy() {
    var h = hero('Economy: a <em>US$1.40 trillion</em> market',
      'Indonesia is Southeast Asia\u2019s largest economy and the world\u2019s 16th largest. Growth has run above 5% ' +
      'for three straight years, driven by household spending, manufacturing and mining.');
    h += '<div class="kpis">' + kpi(byId('gdp'), true) + kpi(byId('gdpgrowth')) + kpi(byId('gdppc')) + kpi(byId('inflation')) + kpi(byId('unemp')) + kpi(byId('poverty')) + '</div>';
    h += '<div class="grid2">' +
      '<section class="panel"><div class="panel-head"><h3>GDP growth</h3>' + rangeToggle('gdp', gdpRange) + '</div>' +
      Charts.barChart(sliceSeries(NUSA.SERIES.gdpGrowth, gdpRange), { label: 'Annual real GDP growth, percent', decimals: 1 }) +
      srcLine([NUSA.SRC.wdi + ' (2024)']) + '</section>' +
      '<section class="panel"><h3>What the economy makes</h3>' +
      Charts.donutChart(NUSA.GDP_SECTORS, { label: 'Shares of GDP by sector', centreLabel: 'of GDP' }) +
      srcLine(['World Bank WDI / Destatis, gross value added, 2024']) + '</section></div>';
    h += '<div class="grid2"><section class="panel"><h3>Who works where</h3>' +
      Charts.hbarChart(NUSA.EMPLOYMENT_SECTORS.map(function (s) { return { label: s.name, value: s.share }; }),
        { label: 'Share of employment by sector', decimals: 1, unit: '%', footnote: 'Share of total employment, 2024. ILOSTAT.' }) +
      '<p class="section-note">Agriculture employs 28% of workers but makes only 13% of GDP — the productivity gap behind rural incomes.</p></section>' +
      '<section class="panel"><h3>Money, prices &amp; trade</h3><table class="data"><tbody>' +
      [['Exports', '22.2% of GDP', '2024'], ['Imports', '20.4% of GDP', '2024'],
       ['Foreign investment', 'US$24.2 billion', '2024'], ['Government debt', '40.8% of GDP', '2025'],
       ['Tourist arrivals', '13.9 million', '2024'], ['GDP per capita (PPP)', 'US$16,472', '2024']]
        .map(function (r) { return '<tr><td>' + r[0] + '</td><td class="num"><strong>' + r[1] + '</strong></td><td class="num">' + r[2] + '</td></tr>'; }).join('') +
      '</tbody></table>' + srcLine([NUSA.SRC.wdi + '; ' + NUSA.SRC.imf]) + '</section></div>';
    return h;
  }

  /* ---------------- People & Society ---------------- */
  function people() {
    var h = hero('People &amp; society: <em>healthier, living longer</em>',
      'Life expectancy has risen to 71.3 years, infant deaths have nearly halved since 2010, and 96% of adults ' +
      'can read. The challenge now is quality: learning outcomes and health spending still lag the region.');
    h += '<div class="kpis">' + kpi(byId('lifeexp'), true) + kpi(byId('literacy')) + kpi(byId('hdi')) + kpi(byId('tertiary')) + kpi(byId('infant')) + kpi(byId('schoolmean')) + '</div>';
    h += '<div class="grid2">' +
      '<section class="panel"><h3>Life expectancy at birth</h3>' +
      Charts.lineChart(NUSA.SERIES.lifeExpectancy, { label: 'Life expectancy, years', decimals: 1, unit: 'years' }) +
      '<p class="section-note">Years. Women live 73.4 years on average, men 69.2. The 2021 dip reflects the pandemic. ' + Charts.esc(NUSA.SRC.wdi) + '.</p></section>' +
      '<section class="panel"><h3>Schooling, step by step</h3><table class="data"><tbody>' +
      [['Primary enrolment', '100.4% gross', '2025'], ['Secondary enrolment', '97.2% gross', '2025'],
       ['Tertiary enrolment', '44.9% gross', '2023'], ['Mean years of schooling', '8.7 years', '2023'],
       ['Expected years of schooling', '13.3 years', '2023'], ['PISA reading score', '365 points', '2025'],
       ['Adult literacy', '96.0%', '2020']]
        .map(function (r) { return '<tr><td>' + r[0] + '</td><td class="num"><strong>' + r[1] + '</strong></td><td class="num">' + r[2] + '</td></tr>'; }).join('') +
      '</tbody></table>' + srcLine([NUSA.SRC.wdi + '; ' + NUSA.SRC.undp + '; OECD PISA']) + '</section></div>';
    h += '<section class="panel wide" style="margin-top:16px"><h3>Health in brief</h3><ul class="factlist">' +
      '<li><strong>Infant mortality 15.2</strong> per 1,000 live births (2024), down from 27 in 2010.</li>' +
      '<li><strong>Health spending is 2.7% of GDP</strong> (2023) — low for a country at this income level.</li>' +
      '<li><strong>Maternal mortality 140</strong> per 100,000 live births (2023).</li>' +
      '<li><strong>72.8% of people use the internet</strong> (2024) and there are 122.5 mobile subscriptions per 100 people.</li>' +
      '<li><strong>Human Development Index 0.728</strong> (2023) — “high human development”, rank 113 of 193 countries.</li></ul>' +
      srcLine([NUSA.SRC.wdi + '; ' + NUSA.SRC.undp]) + '</section>';
    return h;
  }

  /* ---------------- Regions ---------------- */
  function provinceRows(list) {
    var max = Math.max.apply(null, NUSA.PROVINCES.map(function (p) { return p.pop; }));
    return list.map(function (p) {
      var pct = (p.pop / max) * 100;
      return '<tr><td><strong>' + Charts.esc(p.name) + '</strong></td>' +
        '<td><span class="bar-cell"><span class="bar-track"><span class="bar-fill" style="width:' + pct.toFixed(1) + '%"></span></span>' + Charts.fmt(p.pop, 1) + '</span></td>' +
        '<td>' + Charts.esc(p.island) + '</td><td>' + Charts.esc(p.capital) + '</td></tr>';
    }).join('');
  }

  function sortProvinces(list) {
    var key = provSort.key, dir = provSort.dir;
    return list.slice().sort(function (a, b) {
      var av = a[key], bv = b[key];
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }

  function regions() {
    var h = hero('Regions: <em>38 provinces</em>, seven island groups',
      'More than half of all Indonesians live on Java, an island with 7% of the country\u2019s land. ' +
      'Search the provinces below, or sort the table by population, island or capital.');
    h += '<div class="field"><label for="prov-search">Search provinces</label>' +
      '<input id="prov-search" type="search" placeholder="Try “Sumatra”, “Bali”, “Makassar”… " value="' + Charts.esc(provQuery) + '"></div>';
    h += '<section class="panel"><h3>Provinces by population</h3>' +
      '<table class="data"><thead><tr>' +
      '<th><button type="button" data-sort="name">Province ↕</button></th>' +
      '<th class="num"><button type="button" data-sort="pop">Population (millions) ↕</button></th>' +
      '<th><button type="button" data-sort="island">Island group ↕</button></th>' +
      '<th><button type="button" data-sort="capital">Capital ↕</button></th></tr></thead>' +
      '<tbody id="prov-body"></tbody></table>' +
      '<p class="result-count" id="prov-count"></p>' +
      srcLine([NUSA.SRC.bps + ', mid-2025 estimates; ' + NUSA.SRC.kemkes]) + '</section>';
    h += '<section class="panel wide" style="margin-top:16px"><h3>Where the people are — by island group</h3>' +
      Charts.hbarChart(NUSA.ISLAND_GROUPS.map(function (g) { return { label: g.name, value: g.pop }; }),
        { label: 'Population by island group, millions', decimals: 1, unit: 'm', footnote: 'Millions of residents, 2025. Java: 158.1m (55.6%) · Sumatra: 62.3m (21.9%) · Sulawesi: 21.0m (7.4%).' }) +
      '<ul class="factlist"><li>Java\u2019s density is about <strong>1,100 people per km²</strong>; Papua\u2019s is about <strong>14</strong>.</li>' +
      '<li>The new capital, <strong>Nusantara</strong>, is being built in East Kalimantan — the first capital move in the country\u2019s history.</li></ul></section>';
    return h;
  }

  function renderProvinces() {
    var body = document.getElementById('prov-body');
    var count = document.getElementById('prov-count');
    if (!body) return;
    var q = provQuery.trim().toLowerCase();
    var list = NUSA.PROVINCES.filter(function (p) {
      return !q || (p.name + ' ' + p.island + ' ' + p.capital).toLowerCase().indexOf(q) !== -1;
    });
    list = sortProvinces(list);
    body.innerHTML = list.length ? provinceRows(list)
      : '<tr><td colspan="4" class="empty">No province matches “' + Charts.esc(provQuery) + '”.</td></tr>';
    if (count) count.textContent = list.length + ' of ' + NUSA.PROVINCES.length + ' provinces listed (largest 14 shown).';
  }

  /* ---------------- About / Sources ---------------- */
  function about() {
    var h = hero('Sources &amp; <em>methods</em>',
      'NusaStat is an independent compilation. We take figures only from named, published sources, ' +
      'show the reference year beside every number, and never mix estimates from different publishers in one figure.');
    h += '<section class="panel wide"><h3>Our sources</h3><table class="data"><tbody>' +
      [['World Bank, World Development Indicators', 'Population, GDP, prices, jobs, health, education, connectivity', 'data.worldbank.org'],
       ['Statistics Indonesia (BPS)', 'Provincial populations, national poverty line', 'bps.go.id'],
       ['IMF, World Economic Outlook', 'Government debt and medium-term outlook', 'imf.org'],
       ['UN Development Programme', 'Human Development Index and schooling', 'hdr.undp.org'],
       ['ILO, ILOSTAT', 'Unemployment and labour force participation', 'ilostat.ilo.org'],
       ['OECD, PISA', 'Reading and mathematics scores', 'oecd.org/pisa'],
       ['Ministry of Health, Indonesia', 'Provincial health profiles', 'kemkes.go.id']]
        .map(function (r) { return '<tr><td><strong>' + r[0] + '</strong></td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') +
      '</tbody></table></section>';
    h += '<div class="grid2"><section class="panel"><h3>How to cite</h3>' +
      '<p>“NusaStat, Indonesia in Numbers (accessed 26 November 2026), figure from [source, year].” ' +
      'Example: “Population 283.5 million (World Bank WDI, 2024), via NusaStat.”</p>' +
      '<p>Figures are rounded for display; use the source publications for exact values.</p></section>' +
      '<section class="panel"><h3>What we do not do</h3><ul class="factlist">' +
      '<li>No forecasts of our own — projections shown are the publishers\u2019.</li>' +
      '<li>No estimates without a named source.</li>' +
      '<li>No tracking: this site makes no network requests at all.</li></ul></section></div>';
    h += '<section class="panel wide" style="margin-top:16px"><h3>About this site</h3>' +
      '<p>NusaStat was built as an original, offline-first statistics portal: all pages, charts and data ship as ' +
      'static files, so it opens in any browser on desktop or phone with no connection. Figures were last checked ' +
      'against their publishers in November 2026; the World Bank revises its indicators several times a year, so ' +
      'small differences from the live databases are normal. NusaStat is not affiliated with Statistics Indonesia ' +
      '(BPS) or any government body.</p></section>';
    return h;
  }

  var PAGES = {
    overview: overview, population: population, economy: economy,
    people: people, regions: regions, about: about
  };

  function render(route) {
    if (!viewEl) viewEl = document.getElementById('view');
    var page = PAGES[route] || overview;
    viewEl.innerHTML = page();
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === (PAGES[route] ? route : 'overview');
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    renderIndicators();
    renderProvinces();
    bindPage();
    window.scrollTo(0, 0);
  }

  function bindPage() {
    document.querySelectorAll('[data-range]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.getAttribute('data-range').split('|');
        if (parts[0] === 'pop') popRange = parts[1]; else gdpRange = parts[1];
        render(currentRoute());
      });
    });
    var indSearch = document.getElementById('ind-search');
    if (indSearch) {
      indSearch.addEventListener('input', function () {
        searchQuery = indSearch.value;
        renderIndicators();
      });
    }
    var provSearch = document.getElementById('prov-search');
    if (provSearch) {
      provSearch.addEventListener('input', function () {
        provQuery = provSearch.value;
        renderProvinces();
      });
    }
    document.querySelectorAll('[data-sort]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-sort');
        if (provSort.key === key) provSort.dir = -provSort.dir;
        else { provSort.key = key; provSort.dir = key === 'name' || key === 'island' || key === 'capital' ? 1 : -1; }
        renderProvinces();
      });
    });
  }

  function currentRoute() {
    var hash = (window.location.hash || '#/').replace(/^#\/?/, '');
    return PAGES[hash] ? hash : 'overview';
  }

  return {
    render: render, currentRoute: currentRoute,
    setSearch: function (q) { searchQuery = q; },
    getSearch: function () { return searchQuery; }
  };
})();
