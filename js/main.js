/* main.js - Mejoras progresivas para el sitio */
(function () {
  "use strict";

  // Resalta el enlace de menu activo segun la seccion visible
  function setupActiveNav() {
    var navLinks = document.querySelectorAll(".menu-link");
    if (!navLinks.length) return;
    var sections = [];
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) === "#") {
        var sec = document.querySelector(href);
        if (sec) sections.push({ link: link, el: sec });
      }
    });
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sections.forEach(function (s) {
            if (s.el === entry.target) s.link.classList.add("active");
            else s.link.classList.remove("active");
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s.el); });
  }

  // Suaviza el scroll para enlaces internos (refuerzo del CSS)
  function setupSmoothScroll() {
    document.addEventListener("click", function (e) {
      var target = e.target.closest ? e.target.closest("a[href^='#']") : null;
      if (!target) return;
      var id = target.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Anade atributos de accesibilidad a las imagenes sin alt
  function setupAccessibility() {
    document.querySelectorAll("img:not([alt])").forEach(function (img) {
      img.setAttribute("alt", "");
    });
  }

  // Animaciones al hacer scroll
  function setupScrollAnimations() {
    var revealItems = document.querySelectorAll(
      "#about, #about + hr, #about + hr + table, " +
      "#skills, .skill-pills, #skills + p, #skills + p a[data-cat], #skills + p a[data-cat] img, " +
      "#projects, #projects + p, #projects + p + table, " +
      "#projects + p + table td, " +
      "#contact, #contact + p, #contact + p + table, " +
      "#contact + p + table tr, " +
      ".menu, #table h1, #table h3, " +
      "#about + hr + table td img, " +
      "#projects + p + table td img, " +
      "#contact + p + table td img, " +
      "#projects + p + table td p[align='left'] img"
    );

    revealItems.forEach(function (el, i) {
      el.classList.add("reveal");
    });

    // Stagger individual skill badges inside the <p>
    var skillBadges = document.querySelectorAll("#skills + p a[data-cat]");
    skillBadges.forEach(function (badge, i) {
      badge.style.transitionDelay = (i * 0.04) + "s";
    });
    var skillBadgeImgs = document.querySelectorAll("#skills + p a[data-cat] img");
    skillBadgeImgs.forEach(function (img, i) {
      img.style.transitionDelay = (i * 0.04) + "s";
    });

    // Stagger project tech badges
    var projectBadges = document.querySelectorAll("#projects + p + table td p[align='left'] img");
    projectBadges.forEach(function (badge, i) {
      badge.style.transitionDelay = (i * 0.06) + "s";
    });

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (el) { el.classList.add("reveal-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  // Filtrado de skills por categoria
  function setupSkillFilter() {
    var pills = document.querySelectorAll(".skill-pill");
    var badges = document.querySelectorAll('.Estilo6 a[data-cat]');
    if (!pills.length || !badges.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var filter = pill.getAttribute("data-filter");

        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");

        badges.forEach(function (badge) {
          var cat = badge.getAttribute("data-cat");
          if (filter === "all" || cat === filter) {
            badge.classList.remove("hidden-badge");
          } else {
            badge.classList.add("hidden-badge");
          }
        });
      });
    });
  }

  // Dark mode toggle con persistencia
  function setupThemeToggle() {
    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    var saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.body.classList.add("dark");
    }

    toggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      try {
        if (document.body.classList.contains("dark")) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
      } catch (e) {}
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupActiveNav();
    setupSmoothScroll();
    setupAccessibility();
    setupScrollAnimations();
    setupSkillFilter();
    setupThemeToggle();
  });
})();