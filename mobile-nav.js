(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  var NAV_LINKS = [
    { href: "./index.html", label: "THERMAN" },
    { href: "./dining.html", label: "DINING", sub: [
      { href: "./gamasote.html", label: "GAMASOTE" },
      { href: "./jang-paul-gourmet.html", label: "JANG PAUL GOURMET" },
      { href: "./nurun-bowl.html", label: "NURUN BOWL" },
      { href: "./poksam-bbq.html", label: "POKSAM BBQ" }
    ] },
    { href: "./stay.html", label: "WELLNESS & STAY" },
    { href: "./product.html", label: "PRODUCT", sub: [
      { href: "./fabric.html", label: "TEXTILES" },
      { href: "./furniture.html", label: "FURNITURE" },
      { href: "./oocoffee.html", label: "O O C O F F E E" }
    ] },
    { href: "./wellness.html", label: "AMAC WELLNESS & BEAUTY", sub: [
      { href: "./amac-spa.html", label: "AMAC SPA" },
      { href: "./amac-cosmetic.html", label: "AMAC COSMETICS" },
      { href: "./amac-medi.html", label: "AMAC MEDI" }
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

  ready(function () {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("menu-toggle");
    if (!header || !toggle) return;

    ensureLogo(header);
    // the page's own runtime re-renders the header subtree after our first
    // pass, wiping any DOM node it didn't create itself (like our logo) —
    // watch for that and put it back.
    new MutationObserver(function () {
      ensureLogo(header);
    }).observe(header, { childList: true });

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

    if (!toggle.dataset.navBound) {
      toggle.dataset.navBound = "1";
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("mobile-nav-open");
      });
    }

    var desktopVideo = document.getElementById("hero-video-desktop");
    var mobileVideo = document.getElementById("hero-video-mobile");
    if (desktopVideo && mobileVideo && !desktopVideo.dataset.heroBound) {
      desktopVideo.dataset.heroBound = "1";
      var isMobile = window.matchMedia("(max-width: 768px)").matches;
      var active = isMobile ? mobileVideo : desktopVideo;
      var inactive = isMobile ? desktopVideo : mobileVideo;
      active.src = active.getAttribute("data-src");
      active.autoplay = true;
      active.load();
      active.play().catch(function () {});
      inactive.removeAttribute("src");
      inactive.load();
    }
  });
})();
