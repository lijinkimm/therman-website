(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  var NAV_LINKS = [
    { href: "./brand.html", label: "THERMAN" },
    { href: "./stay.html", label: "WELLNESS & STAY" },
    { href: "./dining.html", label: "DINING", sub: [
      { href: "./gamasote.html", label: "GAMASOTE" },
      { href: "./jang-paul-gourmet.html", label: "JANG PAUL GOURMET" },
      { href: "./nurun-bowl.html", label: "NURUN BOWL" },
      { href: "./poksam-bbq.html", label: "POKSAM BBQ" }
    ] },
    { href: "./wellness.html", label: "AMAC WELLNESS & BEAUTY", sub: [
      { href: "./amac-spa.html", label: "AMAC SPA" },
      { href: "./amac-cosmetic.html", label: "AMAC COSMETICS" },
      { href: "./amac-medi.html", label: "AMAC MEDI" }
    ] },
    { href: "./product.html", label: "PRODUCT", sub: [
      { href: "./fabric.html", label: "TEXTILES" },
      { href: "./furniture.html", label: "FURNITURE" },
      { href: "./oocoffee.html", label: "O O C O F F E E" }
    ] }
  ];

  function ensureLogo(header) {
    if (header.querySelector("#mobile-logo")) return;
    var logo = document.createElement("a");
    logo.href = "./index.html";
    logo.id = "mobile-logo";
    logo.textContent = "THERMAN";
    header.insertBefore(logo, header.firstChild);
  }

  function ensureToggleBound(header) {
    var toggle = header.querySelector("#menu-toggle");
    if (!toggle || toggle.dataset.navBound) return;
    toggle.dataset.navBound = "1";
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-open");
    });
  }

  ready(function () {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("menu-toggle");
    if (!header || !toggle) return;

    ensureLogo(header);
    ensureToggleBound(header);
    // the page's own runtime re-renders the header subtree after our first
    // pass (sometimes replacing the button itself), silently dropping any
    // DOM node/listener it didn't create — watch for that and redo it.
    new MutationObserver(function () {
      ensureLogo(header);
      ensureToggleBound(header);
    }).observe(header, { childList: true, subtree: true });

    if (!document.getElementById("mobile-nav-overlay")) {
      var overlay = document.createElement("div");
      overlay.id = "mobile-nav-overlay";
      NAV_LINKS.forEach(function (item) {
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        overlay.appendChild(a);
        if (item.sub) {
          var subWrap = document.createElement("div");
          subWrap.className = "mn-sub";
          item.sub.forEach(function (s) {
            var sa = document.createElement("a");
            sa.href = s.href;
            sa.textContent = s.label;
            subWrap.appendChild(sa);
          });
          overlay.appendChild(subWrap);
        }
      });
      document.body.appendChild(overlay);

      overlay.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          document.body.classList.remove("mobile-nav-open");
        }
      });
    }

    var desktopVideo = document.getElementById("hero-video-desktop");
    var mobileVideo = document.getElementById("hero-video-mobile");
    if (desktopVideo && mobileVideo) {
      var isMobile = window.matchMedia("(max-width: 768px)").matches;
      var active = isMobile ? mobileVideo : desktopVideo;
      var inactive = isMobile ? desktopVideo : mobileVideo;

      var applyHeroVideo = function () {
        if (!active.getAttribute("src")) {
          active.src = active.getAttribute("data-src");
          active.autoplay = true;
          active.load();
          active.play().catch(function () {});
        }
        if (inactive.getAttribute("src")) {
          inactive.removeAttribute("src");
          inactive.load();
        }
      };

      applyHeroVideo();
      // same runtime re-render that resets the header also resets these
      // video elements back to their template state (no src) — reapply
      // whenever that happens.
      new MutationObserver(applyHeroVideo).observe(active.parentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"]
      });
    }

    // A handful of pages have a title-row (heading + paragraph) as a
    // standalone <div>, not wrapped in a <section> with its hero media —
    // so the CSS-only image-first reorder (which relies on both being
    // children of one matched <section>) can't reach it. Move the media
    // section in front of it here instead, on mobile only. The runtime's
    // re-render can put the DOM back the way it found it (same as the
    // header/video resets above), so keep reapplying whenever that happens.
    if (window.matchMedia("(max-width: 768px)").matches) {
      var reorderStandaloneIntros = function () {
        var introDivs = document.querySelectorAll(
          'div[style*="grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr); gap: 34px; align-items: end"]'
        );
        var moved = false;
        introDivs.forEach(function (div) {
          if (div.parentElement.tagName === "SECTION") return; // handled by CSS already
          var prev = div.previousElementSibling;
          var next = div.nextElementSibling;
          if (prev && prev.tagName === "SECTION" && !prev.style.gridTemplateColumns) {
            // already moved — but the runtime's periodic re-render can
            // restore this div's original inline padding, so keep the trim.
            if (div.style.paddingTop !== "24px") div.style.paddingTop = "24px";
            return;
          }
          if (next && next.tagName === "SECTION" && !next.style.gridTemplateColumns) {
            next.parentNode.insertBefore(next, div);
            // the div's own top padding was sized to clear the fixed header
            // when it was the first element on the page — now that the
            // media section leads instead, that padding just leaves a
            // large gap above the title, so trim it to a normal gap.
            div.style.paddingTop = "24px";
            moved = true;
          }
        });
        return moved;
      };
      reorderStandaloneIntros();
      // React (loaded from a CDN at runtime) can still be mid-render when
      // this script runs, so the target elements may not exist yet — keep
      // checking on DOM changes until the move succeeds, then stop
      // watching (short-lived, not a permanent observer).
      var introObserver = new MutationObserver(function () {
        if (reorderStandaloneIntros()) introObserver.disconnect();
      });
      introObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () {
        introObserver.disconnect();
      }, 15000);
    }
  });
})();
