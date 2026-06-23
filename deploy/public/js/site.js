/* ============================================================
   socratesk — site.js
   theme toggle · mobile menu · client-side feed, search,
   topic filter, pagination · post topic-chip mapping
   ============================================================ */
(function () {
  'use strict';

  // ---- topic mapping for blog posts (slug -> topic) ----
  var TOPIC_MAP = {
    'performance-metrics-linear': 'Machine Learning',
    'validation-strategies': 'Machine Learning',
    'permutation-importance': 'Machine Learning',
    'opencv-hsv-selector': 'Computer Vision',
    'hyperparameter-tuning-xgboost': 'Machine Learning',
    'featuren-engineering-and-extraction': 'Machine Learning',
    'face-and-eyes-detector': 'Computer Vision',
    'interactive_webapp_using_pretrained_model': 'Apps & Deployment',
    'feature_importance_and_identification': 'Machine Learning',
    'expose-ml-model-as-rest-api': 'Apps & Deployment',
    'model-deterioration': 'Machine Learning',
    'r-library-sequence': 'R & Spark',
    'googlevis': 'Visualization',
    'sparkr-architecture': 'R & Spark',
    'interactive-histogram-plot': 'Apps & Deployment',
    'car-mileage-predictor': 'Apps & Deployment'
  };
  var CAT_LABEL = { blog: 'Blog', kaggle: 'Kaggle', projects: 'Projects' };
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var PAGE_SIZE = 8;

  function topicFor(p) {
    // 1) explicit front-matter `topic:` wins (easiest for new posts)
    if (p.topic) return p.topic;
    // 2) fall back to the slug map for existing blog posts
    if (p.category === 'blog') return TOPIC_MAP[(p.slug || '').toLowerCase()] || 'Machine Learning';
    return CAT_LABEL[p.category] || p.category;
  }
  function fmtDate(d) {
    var a = d.split('-'); return parseInt(a[2], 10) + ' ' + MONTHS[parseInt(a[1], 10) - 1] + ' ' + a[0];
  }
  function readTime(words) { return Math.max(1, Math.round(words / 200)) + ' min read'; }
  function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function baseurl() { return (window.SITE_BASEURL || ''); }

  // ---- theme toggle ----
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('soc-theme', next); } catch (e) {}
  });

  // ---- mobile menu ----
  var menuBtn = document.getElementById('menuBtn');
  if (menuBtn) menuBtn.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('nav-open')) return;
    var sb = document.getElementById('sidebar');
    if (sb && !sb.contains(e.target) && !menuBtn.contains(e.target)) document.body.classList.remove('nav-open');
  });

  // ---- map topic chips on a single post page ----
  document.querySelectorAll('.chip[data-topic-slug]').forEach(function (chip) {
    var cat = chip.getAttribute('data-category');
    if (cat === 'blog') chip.textContent = TOPIC_MAP[chip.getAttribute('data-topic-slug').toLowerCase()] || 'Machine Learning';
    else chip.textContent = CAT_LABEL[cat] || cat;
  });

  // ---- global search box ----
  var globalSearch = document.getElementById('globalSearch');
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (globalSearch) globalSearch.focus(); }
  });

  // ---- feed rendering ----
  var postsEl = document.getElementById('posts');
  if (!postsEl) {
    // not a feed page: on post/page, Enter in search jumps home with query
    if (globalSearch) globalSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && globalSearch.value.trim()) location.href = baseurl() + '/?q=' + encodeURIComponent(globalSearch.value.trim());
    });
    return;
  }

  var noResults = document.getElementById('noResults');
  var pagination = document.getElementById('pagination');
  var category = postsEl.getAttribute('data-category');
  var allowFeatured = postsEl.getAttribute('data-featured') === 'true';
  var ALL = [], activeTopic = 'all', query = '', page = 1;

  // preset query from ?q=
  var qp = new URLSearchParams(location.search).get('q');
  if (qp) { query = qp; if (globalSearch) globalSearch.value = qp; }

  fetch(baseurl() + '/search.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      ALL = data
        .filter(function (p) { return p.category === category; })
        .map(function (p) { p.topic = topicFor(p); return p; })
        .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      fillTopicCounts();
      render();
    })
    .catch(function () { if (noResults) { noResults.textContent = 'Could not load posts.'; noResults.style.display = 'block'; } });

  function fillTopicCounts() {
    var nav = document.getElementById('topicNav');
    if (!nav) return;
    nav.querySelectorAll('.side-link').forEach(function (btn) {
      var topic = btn.getAttribute('data-topic');
      var n = topic === 'all' ? ALL.length : ALL.filter(function (p) { return p.topic === topic; }).length;
      var c = btn.querySelector('.count'); if (c) c.textContent = n;
    });
  }

  function filtered() {
    var q = query.trim().toLowerCase();
    return ALL.filter(function (p) {
      var okTopic = activeTopic === 'all' || p.topic === activeTopic;
      var hay = (p.title + ' ' + p.excerpt + ' ' + p.topic + ' ' + p.keywords).toLowerCase();
      return okTopic && (!q || hay.indexOf(q) !== -1);
    });
  }

  function render() {
    var list = filtered();
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (page > pages) page = pages;
    var start = (page - 1) * PAGE_SIZE;
    var slice = list.slice(start, start + PAGE_SIZE);
    var searching = !!query.trim() || activeTopic !== 'all';

    postsEl.innerHTML = slice.map(function (p, i) {
      var featured = allowFeatured && !searching && page === 1 && i === 0;
      var href = baseurl() + p.url;
      return '<article class="post-card' + (featured ? ' featured' : '') + '">' +
        '<div class="post-meta">' +
          '<span class="chip">' + esc(p.topic) + '</span>' +
          '<span class="post-date">' + fmtDate(p.date) + '</span>' +
          '<span class="dot">·</span>' +
          '<span class="read-time">' + readTime(p.words) + '</span>' +
        '</div>' +
        '<h2><a href="' + href + '">' + esc(p.title) + '</a></h2>' +
        '<p class="post-excerpt">' + esc(p.excerpt) + '</p>' +
        '<a class="read-more" href="' + href + '">Read <span class="arr">→</span></a>' +
      '</article>';
    }).join('');

    if (noResults) noResults.style.display = list.length ? 'none' : 'block';
    renderPagination(pages);
  }

  function renderPagination(pages) {
    if (!pagination) return;
    if (pages <= 1) { pagination.innerHTML = ''; return; }
    var older = page < pages
      ? '<a class="pagination-item older" href="#" data-pg="' + (page + 1) + '">Older posts</a>'
      : '<span class="pagination-item older">Older posts</span>';
    var newer = page > 1
      ? '<a class="pagination-item newer" href="#" data-pg="' + (page - 1) + '">Newer posts</a>'
      : '<span class="pagination-item newer">Newer posts</span>';
    pagination.innerHTML = older + newer;
    pagination.querySelectorAll('a[data-pg]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        page = parseInt(a.getAttribute('data-pg'), 10);
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // topic filter
  var topicNav = document.getElementById('topicNav');
  if (topicNav) topicNav.addEventListener('click', function (e) {
    var b = e.target.closest('.side-link'); if (!b) return;
    topicNav.querySelectorAll('.side-link').forEach(function (x) { x.classList.remove('active'); });
    b.classList.add('active');
    activeTopic = b.getAttribute('data-topic').replace('&amp;', '&');
    page = 1; render();
  });

  // search input
  if (globalSearch) globalSearch.addEventListener('input', function (e) { query = e.target.value; page = 1; render(); });
})();
