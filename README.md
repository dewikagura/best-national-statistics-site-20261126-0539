# NusaStat — Indonesia in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?ref=6t1r9fj9)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/dewikagura/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?ref=6t1r9fj9)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/dewikagura/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?ref=6t1r9fj9)

An independent national statistics portal for Indonesia, built for the
[best-national-statistics-site](https://make.fun/bounty/best-national-statistics-site-20261126-0539?ref=6t1r9fj9)
bounty on make.fun. It opens in a browser on desktop and phone from static
files alone — no network requests, no libraries, no build step.

## What it shows

Six sections, each reached by a link in the top navigation:

- **Overview** — the country at a glance: population, GDP, jobs, health and
  poverty as headline cards, a population line chart and a GDP-growth bar
  chart, an indicator search across all 28 headline figures, and the latest
  releases.
- **Population** — how many people, how fast the population grows, the age
  structure, and the ten largest provinces.
- **Economy** — GDP and growth, what the economy makes (sector donut),
  who works where, and money, prices and trade.
- **People & Society** — life expectancy, schooling, literacy, health and
  the Human Development Index.
- **Regions** — all 14 largest provinces in a searchable, sortable table,
  plus the seven island groups.
- **Sources** — every publisher behind the figures, how to cite them, and
  what this site does not do.

Every figure carries its source and reference year: World Bank World
Development Indicators, Statistics Indonesia (BPS), IMF World Economic
Outlook, UNDP Human Development Report, ILO ILOSTAT and OECD PISA.

## Try it

Serve `app/` with any static server and open `index.html`:

```sh
cd app && python3 -m http.server 8080
```

Then visit http://localhost:8080 — or open `app/index.html` directly.
The charts are hand-drawn SVG from the data in `app/data.js`; the pages
are hash routes (`#/population`, `#/economy`, …) and every control works:
chart range toggles, indicator search, province search and table sorting.

## Screenshots

Four real renders of the site's own code: the overview on desktop, the
economy page, the regions table, and the overview on a phone (390 × 844).
They were taken with Playwright Chromium against a local static server,
with no edits afterwards.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into `$MAKEFUN_OUTPUT_DIR` and writes `dossier.json` with the kit's
`buildDossier`:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
```

Run it twice — both runs write identical bytes.

## Licence

MIT — see [LICENSE](LICENSE).
