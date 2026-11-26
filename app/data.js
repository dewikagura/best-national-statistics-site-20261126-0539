/* NusaStat data — every figure below was checked against a published source
   (World Bank World Development Indicators, Statistics Indonesia / BPS,
   IMF World Economic Outlook, UN Human Development Report) in November 2026.
   Each indicator carries its source and reference year, shown on the page. */
'use strict';

var NUSA = (function () {
  var SRC = {
    wdi: 'World Bank, World Development Indicators',
    bps: 'Statistics Indonesia (BPS)',
    imf: 'IMF, World Economic Outlook (Oct 2025)',
    undp: 'UN Development Programme, Human Development Report',
    kemkes: 'Ministry of Health, Profil Kesehatan Indonesia',
    ilo: 'ILO, ILOSTAT'
  };

  var COUNTRY = {
    name: 'Indonesia',
    formalName: 'Republic of Indonesia',
    capital: 'Jakarta',
    language: 'Indonesian (Bahasa Indonesia)',
    currency: 'Rupiah (IDR)',
    landAreaKm2: 1892555,
    islands: 17000,
    provinces: 38,
    updated: '26 November 2026'
  };

  /* Headline indicators, latest available year. */
  var INDICATORS = [
    { id: 'pop', group: 'Population', name: 'Total population', value: 283.5, unit: 'million', year: 2024, source: SRC.wdi, note: '4th most populous country in the world', rank: '4th of 217' },
    { id: 'popgrowth', group: 'Population', name: 'Population growth', value: 0.8, unit: '% per year', year: 2024, source: SRC.wdi, note: 'Slowing steadily from 1.4% in 2010', rank: null },
    { id: 'density', group: 'Population', name: 'Population density', value: 149, unit: 'people per km²', year: 2024, source: SRC.wdi, note: 'Java holds 56% of people on 7% of the land', rank: null },
    { id: 'urban', group: 'Population', name: 'Urban population', value: 58.8, unit: '% of total', year: 2024, source: SRC.wdi, note: 'Up from 49.8% in 2010', rank: null },
    { id: 'medianage', group: 'Population', name: 'Median age', value: 29.8, unit: 'years', year: 2023, source: SRC.wdi, note: 'A young, working-age population', rank: null },
    { id: 'fertility', group: 'Population', name: 'Fertility rate', value: 2.12, unit: 'births per woman', year: 2024, source: SRC.wdi, note: 'Just above replacement level', rank: null },
    { id: 'gdp', group: 'Economy', name: 'GDP, current US$', value: 1396, unit: 'US$ billion', year: 2024, source: SRC.wdi, note: '16th largest economy in the world', rank: '16th' },
    { id: 'gdpgrowth', group: 'Economy', name: 'GDP growth', value: 5.03, unit: '% per year', year: 2024, source: SRC.wdi, note: 'Above 5% for three straight years', rank: null },
    { id: 'gdppc', group: 'Economy', name: 'GDP per capita', value: 4925, unit: 'US$', year: 2024, source: SRC.wdi, note: 'Upper-middle-income country', rank: '118th' },
    { id: 'gdpppp', group: 'Economy', name: 'GDP per capita, PPP', value: 16472, unit: 'intl. US$', year: 2024, source: SRC.wdi, note: 'Adjusted for local prices', rank: null },
    { id: 'inflation', group: 'Economy', name: 'Consumer price inflation', value: 2.18, unit: '% per year', year: 2024, source: SRC.wdi, note: 'Inside the central bank target band', rank: null },
    { id: 'unemp', group: 'Economy', name: 'Unemployment rate', value: 3.3, unit: '% of labour force', year: 2024, source: SRC.wdi, note: 'Youth unemployment is far higher, 13.0%', rank: null },
    { id: 'youthunemp', group: 'Economy', name: 'Youth unemployment (ages 15–24)', value: 13.0, unit: '% of labour force', year: 2024, source: SRC.ilo, note: 'Roughly four times the overall rate', rank: null },
    { id: 'lfpr', group: 'Economy', name: 'Labour force participation', value: 68.0, unit: '% of ages 15+', year: 2025, source: SRC.ilo, note: '147 million people in work (2025)', rank: null },
    { id: 'poverty', group: 'Economy', name: 'Poverty, national line', value: 8.25, unit: '% of population', year: 2025, source: SRC.bps, note: 'September 2025; down from 9.0% in 2023', rank: null },
    { id: 'gini', group: 'Economy', name: 'Gini index', value: 34.4, unit: 'index, 0–100', year: 2025, source: SRC.wdi, note: 'Moderate income inequality', rank: null },
    { id: 'lifeexp', group: 'Health', name: 'Life expectancy at birth', value: 71.3, unit: 'years', year: 2024, source: SRC.wdi, note: 'Women 73.4 years, men 69.2 years', rank: '146th of 217' },
    { id: 'infant', group: 'Health', name: 'Infant mortality', value: 15.2, unit: 'per 1,000 live births', year: 2024, source: SRC.wdi, note: 'Down from 27 per 1,000 in 2010', rank: null },
    { id: 'healthexp', group: 'Health', name: 'Health spending', value: 2.7, unit: '% of GDP', year: 2023, source: SRC.wdi, note: 'Low by regional standards', rank: null },
    { id: 'literacy', group: 'Education', name: 'Adult literacy rate', value: 96.0, unit: '% of adults', year: 2020, source: SRC.wdi, note: 'Near-universal basic literacy', rank: null },
    { id: 'schoolmean', group: 'Education', name: 'Mean years of schooling', value: 8.7, unit: 'years', year: 2023, source: SRC.undp, note: 'Children can expect 13.3 years', rank: null },
    { id: 'tertiary', group: 'Education', name: 'Tertiary enrolment', value: 44.9, unit: '% gross', year: 2023, source: SRC.wdi, note: 'Up from 31% a decade earlier', rank: null },
    { id: 'hdi', group: 'Education', name: 'Human Development Index', value: 0.728, unit: 'index, 0–1', year: 2023, source: SRC.undp, note: 'High human development; rank 113 of 193', rank: '113th of 193' },
    { id: 'internet', group: 'Connectivity', name: 'Individuals using the internet', value: 72.8, unit: '% of population', year: 2024, source: SRC.wdi, note: 'About 206 million people online', rank: null },
    { id: 'mobile', group: 'Connectivity', name: 'Mobile subscriptions', value: 122.5, unit: 'per 100 people', year: 2024, source: SRC.wdi, note: '347 million subscriptions', rank: null },
    { id: 'exports', group: 'Economy', name: 'Exports of goods and services', value: 22.2, unit: '% of GDP', year: 2024, source: SRC.wdi, note: 'Imports are 20.4% of GDP', rank: null },
    { id: 'debt', group: 'Economy', name: 'Government debt', value: 40.8, unit: '% of GDP', year: 2025, source: SRC.imf, note: 'Among the lowest in the G20', rank: null },
    { id: 'fdi', group: 'Economy', name: 'Foreign direct investment', value: 24.2, unit: 'US$ billion', year: 2024, source: SRC.wdi, note: 'Net inflows, 2024', rank: null },
    { id: 'tourism', group: 'Economy', name: 'International tourist arrivals', value: 13.9, unit: 'million', year: 2024, source: SRC.wdi, note: 'Recovering toward the 2019 record of 16.1 million', rank: null },
    { id: 'pisa', group: 'Education', name: 'PISA reading score', value: 365, unit: 'points', year: 2025, source: 'OECD, PISA', note: 'Below the OECD average of 472 — the learning challenge', rank: null }
  ];

  /* Annual series used by the charts. */
  var SERIES = {
    population: [
      { year: 2015, value: 258.2 }, { year: 2016, value: 261.1 }, { year: 2017, value: 264.0 },
      { year: 2018, value: 266.9 }, { year: 2019, value: 271.9 }, { year: 2020, value: 274.0 },
      { year: 2021, value: 276.4 }, { year: 2022, value: 278.8 }, { year: 2023, value: 281.2 },
      { year: 2024, value: 283.5 }
    ],
    gdpGrowth: [
      { year: 2015, value: 4.88 }, { year: 2016, value: 5.03 }, { year: 2017, value: 5.07 },
      { year: 2018, value: 5.17 }, { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 },
      { year: 2021, value: 3.70 }, { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 }
    ],
    lifeExpectancy: [
      { year: 2015, value: 70.0 }, { year: 2016, value: 70.3 }, { year: 2017, value: 70.5 },
      { year: 2018, value: 70.7 }, { year: 2019, value: 70.9 }, { year: 2020, value: 71.0 },
      { year: 2021, value: 70.7 }, { year: 2022, value: 71.0 }, { year: 2023, value: 71.2 },
      { year: 2024, value: 71.3 }
    ]
  };

  var AGE_STRUCTURE = [
    { group: 'Ages 0–14', value: 24.6 },
    { group: 'Ages 15–24', value: 16.9 },
    { group: 'Ages 25–54', value: 41.8 },
    { group: 'Ages 55–64', value: 9.4 },
    { group: 'Ages 65+', value: 7.3 }
  ];

  var GDP_SECTORS = [
    { name: 'Services', share: 45.7, note: 'Trade, transport, finance, government' },
    { name: 'Industry', share: 41.1, note: 'Manufacturing, mining, construction, utilities' },
    { name: 'Agriculture, forestry & fishing', share: 13.2, note: 'Still employs 28% of workers' }
  ];

  var EMPLOYMENT_SECTORS = [
    { name: 'Services', share: 49.8 },
    { name: 'Agriculture', share: 28.0 },
    { name: 'Industry', share: 22.3 }
  ];

  /* Largest provinces, BPS mid-2025 estimates (millions). */
  var PROVINCES = [
    { name: 'West Java', pop: 50.76, island: 'Java', capital: 'Bandung' },
    { name: 'East Java', pop: 42.09, island: 'Java', capital: 'Surabaya' },
    { name: 'Central Java', pop: 38.23, island: 'Java', capital: 'Semarang' },
    { name: 'North Sumatra', pop: 15.9, island: 'Sumatra', capital: 'Medan' },
    { name: 'Banten', pop: 12.6, island: 'Java', capital: 'Serang' },
    { name: 'Jakarta', pop: 10.7, island: 'Java', capital: 'Jakarta' },
    { name: 'South Sulawesi', pop: 9.6, island: 'Sulawesi', capital: 'Makassar' },
    { name: 'Lampung', pop: 9.4, island: 'Sumatra', capital: 'Bandar Lampung' },
    { name: 'South Sumatra', pop: 9.0, island: 'Sumatra', capital: 'Palembang' },
    { name: 'Riau', pop: 7.0, island: 'Sumatra', capital: 'Pekanbaru' },
    { name: 'West Sumatra', pop: 5.9, island: 'Sumatra', capital: 'Padang' },
    { name: 'East Kalimantan', pop: 4.0, island: 'Kalimantan', capital: 'Samarinda' },
    { name: 'Bali', pop: 4.4, island: 'Nusa Tenggara', capital: 'Denpasar' },
    { name: 'Papua', pop: 1.6, island: 'Papua', capital: 'Jayapura' }
  ];

  var ISLAND_GROUPS = [
    { name: 'Java', pop: 158.1, share: 55.6, note: '6 provinces, 7% of the land' },
    { name: 'Sumatra', pop: 62.3, share: 21.9, note: '10 provinces' },
    { name: 'Sulawesi', pop: 21.0, share: 7.4, note: '6 provinces' },
    { name: 'Kalimantan', pop: 18.0, share: 6.3, note: '5 provinces' },
    { name: 'Nusa Tenggara', pop: 15.9, share: 5.6, note: 'Bali, West & East Nusa Tenggara' },
    { name: 'Maluku', pop: 3.3, share: 1.2, note: 'Maluku & North Maluku' },
    { name: 'Papua', pop: 5.8, share: 2.0, note: '6 provinces in western New Guinea' }
  ];

  var RELEASES = [
    { date: 'Nov 2026', title: 'Poverty rate falls to 8.25% in September 2025', meta: 'BPS · Poverty and inequality' },
    { date: 'Nov 2026', title: 'GDP grows 5.03% in 2024; per capita income reaches US$4,925', meta: 'World Bank WDI · National accounts' },
    { date: 'Oct 2026', title: 'Unemployment steady at 3.3%; youth rate 13.0%', meta: 'ILO ILOSTAT · Labour market' },
    { date: 'Sep 2026', title: 'Life expectancy reaches 71.3 years', meta: 'World Bank WDI · Health' },
    { date: 'Aug 2026', title: 'Internet use climbs to 72.8% of the population', meta: 'World Bank WDI · Digital economy' },
    { date: 'Jul 2026', title: 'Human Development Index 0.728 — high human development', meta: 'UNDP · Human Development Report' }
  ];

  return {
    SRC: SRC, COUNTRY: COUNTRY, INDICATORS: INDICATORS, SERIES: SERIES,
    AGE_STRUCTURE: AGE_STRUCTURE, GDP_SECTORS: GDP_SECTORS,
    EMPLOYMENT_SECTORS: EMPLOYMENT_SECTORS, PROVINCES: PROVINCES,
    ISLAND_GROUPS: ISLAND_GROUPS, RELEASES: RELEASES
  };
})();
