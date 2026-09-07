(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  var NAV_LINKS = [
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
    { href: "./stay.html", label: "WELLNESS & STAY" },
    { href: "./product.html", label: "PRODUCT", sub: [
      { href: "./furniture.html", label: "FURNITURE" },
      { href: "./oocoffee.html", label: "O O C O F F E E" },
      { href: "./fabric.html", label: "TEXTILES" }
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

  function ensureToggleBound(toggle) {
    if (!toggle || toggle.dataset.navBound) return;
    toggle.dataset.navBound = "1";
    // The nav bar is always visible now, so this button no longer opens
    // a menu — it replaces the text logo as the way back to the home page.
    toggle.addEventListener("click", function () {
      window.location.href = "./index.html";
    });
  }

  // The header and the nav bar used to be two separate fixed boxes,
  // stacked with a gap between them — move the toggle button out of the
  // header and into the bar itself so they read as one unified row. The
  // runtime can replace the header's contents with a fresh button node at
  // any time, so re-check and re-move on every relevant mutation rather
  // than doing this once.
  function relocateToggle(header, overlay) {
    var toggle = header.querySelector("#menu-toggle");
    if (!toggle || !overlay || toggle.parentElement === overlay) return;
    ensureToggleBound(toggle);
    overlay.appendChild(toggle);
  }

  ready(function () {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("menu-toggle");
    if (!header || !toggle) return;

    ensureLogo(header);

    if (!document.getElementById("mobile-nav-overlay")) {
      var overlay = document.createElement("div");
      overlay.id = "mobile-nav-overlay";

      var topRow = document.createElement("div");
      topRow.className = "mn-top-row";
      var brand = document.createElement("a");
      brand.href = "./brand.html";
      brand.className = "mn-brand";
      brand.innerHTML = "THERMAN<span class=\"mn-brand-tm\">TM</span>";
      var code = document.createElement("a");
      code.href = "./index.html";
      code.className = "mn-code";
      code.textContent = "53F4_2H";
      topRow.appendChild(brand);
      topRow.appendChild(code);
      overlay.appendChild(topRow);

      var grid = document.createElement("div");
      grid.className = "mn-grid";
      // Sub-lists live in their own container BELOW the grid entirely
      // (not as grid items) — the page runtime has a habit of scrambling
      // explicitly-set grid-column/grid-row (normalizing them into a
      // grid-area shorthand with the values swapped), which made the
      // sub-row land in the wrong place. Plain DOM flow can't be scrambled
      // the same way, and it guarantees the sub-list always renders in the
      // same spot at the bottom, regardless of which item was tapped.
      var subContainer = document.createElement("div");
      subContainer.className = "mn-sub-container";
      var currentPage = location.pathname.split("/").pop() || "index.html";
      NAV_LINKS.forEach(function (item, i) {
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        grid.appendChild(a);
        if (!item.sub) return;
        // Items with sub-links reveal their subs as a bar below the whole
        // grid on tap, and the tapped item gets bolded so it reads as the
        // current section.
        var subWrap = document.createElement("div");
        subWrap.className = "mn-sub";
        // Lists with fewer items (3 or less) have room for a much wider
        // gap; DINING's 4-item list needs the tighter default to still
        // fit on one line.
        if (item.sub.length <= 3) subWrap.style.columnGap = "34px";
        item.sub.forEach(function (s) {
          var sa = document.createElement("a");
          sa.href = s.href;
          sa.textContent = s.label;
          subWrap.appendChild(sa);
        });
        subContainer.appendChild(subWrap);
        // Keep this item's sub-list open by default whenever the current
        // page belongs to it (its own page or one of its sub-pages), so
        // browsing within a section (e.g. into GAMASOTE from DINING)
        // doesn't collapse the menu back to the default state.
        var isCurrentSection =
          item.href.indexOf(currentPage) !== -1 ||
          item.sub.some(function (s) { return s.href.indexOf(currentPage) !== -1; });
        if (isCurrentSection) {
          subWrap.classList.add("mn-sub-open");
          a.classList.add("mn-active");
        }
        // No click-to-toggle here anymore — the sub-list already opens
        // automatically based on the current page, so the main item just
        // behaves like a normal link (tapping PRODUCT goes to product.html
        // instead of only expanding its sub-menu in place).
      });
      overlay.appendChild(grid);
      overlay.appendChild(subContainer);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          document.body.classList.remove("mobile-nav-open");
        }
      });
    }

    var overlay = document.getElementById("mobile-nav-overlay");
    relocateToggle(header, overlay);
    new MutationObserver(function () {
      ensureLogo(header);
      relocateToggle(header, overlay);
    }).observe(header, { childList: true, subtree: true });

    // The nav bar is always visible on mobile now (no hamburger toggle),
    // fixed just below the header — push the page's own content down by
    // however tall the (possibly multi-line, wrapped) bar renders, so it
    // doesn't sit underneath it. Re-measure on resize/font-load/orientation
    // change since the wrap count (and so the height) can shift.
    var applyNavBarSpace = function () {
      var bar = document.getElementById("mobile-nav-overlay");
      if (!bar) return;
      if (window.matchMedia("(max-width: 768px)").matches) {
        document.body.style.marginTop = bar.getBoundingClientRect().height + "px";
      } else {
        document.body.style.marginTop = "";
      }
    };
    applyNavBarSpace();
    window.addEventListener("resize", applyNavBarSpace);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyNavBarSpace);
    }
    var navSpaceTries = 0;
    var navSpaceInterval = setInterval(function () {
      applyNavBarSpace();
      navSpaceTries++;
      if (navSpaceTries > 40) clearInterval(navSpaceInterval);
    }, 500);

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

    // Safari has not been honoring the CSS override for this box's ratio
    // (neither aspect-ratio nor the height:0/padding-top fallback stuck),
    // so pin the pixel height directly via JS instead — that can't be
    // ignored by any engine's aspect-ratio handling quirks. Re-query the
    // element fresh each time (like the header/video fixes above) rather
    // than caching one reference — the runtime replaces this node outright
    // on re-render, which would silently leave a cached reference stale.
    var fixWallBoxHeight = function () {
      var box = document.querySelector(
        'section[data-screen-label="00b AMAC — Wall"] > div'
      );
      if (!box) return;
      if (window.matchMedia("(max-width: 768px)").matches) {
        box.style.height = box.offsetWidth / 2 + "px";
      } else {
        box.style.height = "";
      }
    };
    fixWallBoxHeight();
    window.addEventListener("resize", fixWallBoxHeight);
    var wallFixTries = 0;
    var wallFixInterval = setInterval(function () {
      fixWallBoxHeight();
      wallFixTries++;
      if (wallFixTries > 40) clearInterval(wallFixInterval);
    }, 500);

    // Pages with many autoplay="autoplay" videos (brand.html has 13+) hit
    // Safari's cap on how many can actually play at once — videos past
    // that budget silently stay paused, showing a native play button,
    // even though every attribute is set correctly. Re-issue .play() on
    // each video as it enters the viewport (and pause off-screen ones to
    // free up the budget for the next one) so every video gets its turn.
    if ("IntersectionObserver" in window) {
      var autoplayObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting) {
              var playPromise = video.play();
              if (playPromise && playPromise.catch) playPromise.catch(function () {});
            } else if (!video.hasAttribute("data-src")) {
              video.pause();
            }
          });
        },
        { threshold: 0.25 }
      );
      var observeAutoplayVideos = function () {
        document.querySelectorAll("video[autoplay]").forEach(function (video) {
          if (video.dataset.autoplayObserved) return;
          video.dataset.autoplayObserved = "1";
          autoplayObserver.observe(video);
        });
      };
      observeAutoplayVideos();
      var autoplayScanTries = 0;
      var autoplayScanInterval = setInterval(function () {
        observeAutoplayVideos();
        autoplayScanTries++;
        if (autoplayScanTries > 40) clearInterval(autoplayScanInterval);
      }, 500);
    }
  });
})();
