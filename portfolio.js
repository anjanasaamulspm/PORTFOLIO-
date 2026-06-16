/* ═══════════════════════════════════════════════
   IMAGE UPLOAD · PM Portfolio
   Drag-drop + click to upload, localStorage persist
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  function initImageZones() {
    document.querySelectorAll('.img-zone').forEach(function (zone) {
      var key      = zone.dataset.key;
      var input    = zone.querySelector('input[type="file"]');
      var drop     = zone.querySelector('.img-drop');
      var preview  = zone.querySelector('.img-preview');
      var previewImg = zone.querySelector('.img-preview img');
      var removeBtn  = zone.querySelector('.img-remove');

      if (!key || !input || !drop || !preview || !previewImg || !removeBtn) return;

      // Restore saved image
      try {
        var saved = localStorage.getItem('pm-portfolio-img-' + key);
        if (saved) showPreview(saved);
      } catch (e) {}

      // Click to open file picker
      drop.addEventListener('click', function () { input.click(); });

      // File selected via picker
      input.addEventListener('change', function () {
        if (input.files && input.files[0]) readFile(input.files[0]);
      });

      // Drag events
      drop.addEventListener('dragover', function (e) {
        e.preventDefault();
        drop.classList.add('dragover');
      });

      drop.addEventListener('dragleave', function () {
        drop.classList.remove('dragover');
      });

      drop.addEventListener('drop', function (e) {
        e.preventDefault();
        drop.classList.remove('dragover');
        var file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) readFile(file);
      });

      // Remove
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        previewImg.src = '';
        preview.style.display = 'none';
        drop.style.display = '';
        input.value = '';
        try { localStorage.removeItem('pm-portfolio-img-' + key); } catch (ex) {}
      });

      function readFile(file) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          var dataUrl = ev.target.result;
          showPreview(dataUrl);
          try { localStorage.setItem('pm-portfolio-img-' + key, dataUrl); } catch (ex) {
            // Storage full — show anyway but don't persist
          }
        };
        reader.readAsDataURL(file);
      }

      function showPreview(src) {
        previewImg.src = src;
        preview.style.display = 'block';
        drop.style.display = 'none';
      }
    });
  }

  /* ── Sidebar active-link on scroll ── */
  function initSidebarScroll() {
    var links = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    if (!links.length) return;

    var sections = Array.from(links).map(function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    function onScroll() {
      var scrollY = window.scrollY + 120;
      var active = sections[0];
      sections.forEach(function (s) {
        if (s.offsetTop <= scrollY) active = s;
      });
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active.id);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initImageZones();
    initSidebarScroll();
  });
})();
