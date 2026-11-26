/* NusaStat charts — small hand-rolled SVG builders. No library, no network:
   every chart is drawn from NUSA data at render time. */
'use strict';

var Charts = (function () {
  var TEAL = '#0e6b6b';
  var AMBER = '#e8a317';
  var INK = '#12303a';
  var MUTED = '#5f7480';
  var GRID = '#e3eaec';
  var PALETTE = ['#0e6b6b', '#e8a317', '#2f6fb2', '#b3402e', '#2e7d4f', '#7a5ea8', '#c97b2d'];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmt(n, decimals) {
    return Number(n).toLocaleString('en-US', {
      minimumFractionDigits: decimals == null ? 0 : decimals,
      maximumFractionDigits: decimals == null ? 2 : decimals
    });
  }

  /* Line chart with dots, year labels and a value label on the last point. */
  function lineChart(series, opts) {
    var o = opts || {};
    var w = o.width || 640, h = o.height || 260;
    var padL = 46, padR = 56, padT = 16, padB = 30;
    var vals = series.map(function (p) { return p.value; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    var span = (max - min) || 1;
    min -= span * 0.15; max += span * 0.15;
    function x(i) { return padL + (i / (series.length - 1)) * (w - padL - padR); }
    function y(v) { return padT + (1 - (v - min) / (max - min)) * (h - padT - padB); }
    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.label || 'Line chart') + '">'];
    var ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var tv = min + ((max - min) * t) / ticks;
      var ty = y(tv);
      out.push('<line x1="' + padL + '" y1="' + ty.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + ty.toFixed(1) + '" stroke="' + GRID + '"/>');
      out.push('<text x="' + (padL - 6) + '" y="' + (ty + 4).toFixed(1) + '" font-size="11" fill="' + MUTED + '" text-anchor="end">' + fmt(tv, o.decimals || 0) + '</text>');
    }
    var pts = series.map(function (p, i) { return x(i).toFixed(1) + ',' + y(p.value).toFixed(1); }).join(' ');
    out.push('<polyline points="' + pts + '" fill="none" stroke="' + (o.color || TEAL) + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>');
    series.forEach(function (p, i) {
      out.push('<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.value).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + (o.color || TEAL) + '" stroke-width="2"/>');
      if (i % 2 === 0 || i === series.length - 1) {
        out.push('<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" font-size="11" fill="' + MUTED + '" text-anchor="middle">' + p.year + '</text>');
      }
    });
    var last = series[series.length - 1];
    out.push('<text x="' + (x(series.length - 1) + 8).toFixed(1) + '" y="' + (y(last.value) + 4).toFixed(1) + '" font-size="13" font-weight="700" fill="' + INK + '">' + fmt(last.value, o.decimals || 0) + (o.unit ? ' ' + esc(o.unit) : '') + '</text>');
    out.push('</svg>');
    return out.join('');
  }

  /* Vertical bar chart, with a zero line when values go negative. */
  function barChart(series, opts) {
    var o = opts || {};
    var w = o.width || 640, h = o.height || 260;
    var padL = 46, padR = 12, padT = 18, padB = 30;
    var vals = series.map(function (p) { return p.value; });
    var min = Math.min(0, Math.min.apply(null, vals));
    var max = Math.max.apply(null, vals);
    var span = (max - min) || 1;
    min -= span * 0.08; max += span * 0.12;
    function y(v) { return padT + (1 - (v - min) / (max - min)) * (h - padT - padB); }
    var slot = (w - padL - padR) / series.length;
    var barW = Math.min(42, slot * 0.62);
    var out = ['<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(o.label || 'Bar chart') + '">'];
    for (var t = 0; t <= 4; t++) {
      var tv = min + ((max - min) * t) / 4;
      var ty = y(tv);
      out.push('<line x1="' + padL + '" y1="' + ty.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + ty.toFixed(1) + '" stroke="' + GRID + '"/>');
      out.push('<text x="' + (padL - 6) + '" y="' + (ty + 4).toFixed(1) + '" font-size="11" fill="' + MUTED + '" text-anchor="end">' + fmt(tv, o.decimals == null ? 1 : o.decimals) + '</text>');
    }
    var zeroY = y(0);
    out.push('<line x1="' + padL + '" y1="' + zeroY.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + zeroY.toFixed(1) + '" stroke="' + MUTED + '" stroke-width="1"/>');
    series.forEach(function (p, i) {
      var bx = padL + i * slot + (slot - barW) / 2;
      var by = p.value >= 0 ? y(p.value) : zeroY;
      var bh = Math.abs(y(p.value) - zeroY);
      var fill = p.value < 0 ? '#b3402e' : (o.color || TEAL);
      out.push('<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(bh, 1).toFixed(1) + '" rx="3" fill="' + fill + '"/>');
      out.push('<text x="' + (bx + barW / 2).toFixed(1) + '" y="' + (by - 5).toFixed(1) + '" font-size="11" font-weight="600" fill="' + INK + '" text-anchor="middle">' + fmt(p.value, o.decimals == null ? 1 : o.decimals) + '</text>');
      out.push('<text x="' + (bx + barW / 2).toFixed(1) + '" y="' + (h - 10) + '" font-size="11" fill="' + MUTED + '" text-anchor="middle">' + p.year + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* Donut chart with a centre total and a legend list. */
  function donutChart(parts, opts) {
    var o = opts || {};
    var size = o.size || 220;
    var cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
    var total = parts.reduce(function (s, p) { return s + p.share; }, 0);
    var out = ['<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">'];
    out.push('<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + esc(o.label || 'Donut chart') + '">');
    var a0 = -Math.PI / 2;
    parts.forEach(function (p, i) {
      var a1 = a0 + (p.share / total) * Math.PI * 2;
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
      var xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
      out.push('<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z" fill="' + PALETTE[i % PALETTE.length] + '"/>');
      a0 = a1;
    });
    out.push('<text x="' + cx + '" y="' + (cy - 4) + '" font-size="26" font-weight="800" fill="' + INK + '" text-anchor="middle">' + fmt(total, 0) + '%</text>');
    out.push('<text x="' + cx + '" y="' + (cy + 16) + '" font-size="11" fill="' + MUTED + '" text-anchor="middle">' + esc(o.centreLabel || 'of GDP') + '</text>');
    out.push('</svg>');
    out.push('<ul style="list-style:none;margin:0;padding:0;min-width:220px">');
    parts.forEach(function (p, i) {
      out.push('<li style="display:flex;gap:8px;align-items:baseline;margin-bottom:8px"><span style="width:12px;height:12px;border-radius:3px;background:' + PALETTE[i % PALETTE.length] + ';display:inline-block;flex:0 0 12px"></span><span><strong>' + esc(p.name) + '</strong> — ' + fmt(p.share, 1) + '%<br><span style="font-size:12.5px;color:' + MUTED + '">' + esc(p.note || '') + '</span></span></li>');
    });
    out.push('</ul></div>');
    return out.join('');
  }

  /* Horizontal bars, good for age groups, provinces and island shares. */
  function hbarChart(rows, opts) {
    var o = opts || {};
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }));
    var out = ['<div role="img" aria-label="' + esc(o.label || 'Bar list') + '">'];
    rows.forEach(function (r, i) {
      var pct = (r.value / max) * 100;
      var color = o.colors ? o.colors[i % o.colors.length] : (i === 0 ? AMBER : TEAL);
      out.push('<div style="display:grid;grid-template-columns:150px 1fr 64px;gap:10px;align-items:center;margin-bottom:9px">');
      out.push('<span style="font-size:13.5px;font-weight:600">' + esc(r.label) + '</span>');
      out.push('<span style="height:14px;background:#e6ecee;border-radius:99px;overflow:hidden"><span style="display:block;height:100%;width:' + pct.toFixed(1) + '%;background:' + color + ';border-radius:99px"></span></span>');
      out.push('<span style="font-size:13.5px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">' + fmt(r.value, o.decimals == null ? 1 : o.decimals) + (o.unit ? ' ' + esc(o.unit) : '') + '</span>');
      out.push('</div>');
    });
    out.push('</div>');
    if (o.footnote) out.push('<p class="section-note">' + esc(o.footnote) + '</p>');
    return out.join('');
  }

  return { lineChart: lineChart, barChart: barChart, donutChart: donutChart, hbarChart: hbarChart, fmt: fmt, esc: esc };
})();
