/* NusaStat bootstrap — wires the hash router and the header search box,
   then renders the section the URL names. */
'use strict';

(function () {
  var siteSearch = document.getElementById('site-search');

  function show() {
    var q = siteSearch ? siteSearch.value : '';
    if (q) Views.setSearch(q);
    Views.render(Views.currentRoute());
  }

  window.addEventListener('hashchange', show);

  if (siteSearch) {
    siteSearch.addEventListener('input', function () {
      Views.setSearch(siteSearch.value);
      if (Views.currentRoute() !== 'overview') {
        window.location.hash = '#/';
      } else {
        Views.render('overview');
        var again = document.getElementById('site-search');
        if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
      }
    });
  }

  show();
})();
