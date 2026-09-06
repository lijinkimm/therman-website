(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  var NAV_LINKS = [
    { href: "./brand.html", label: "THERMAN" },
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

  ready(function () {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("menu-toggle");
    if (!header || !toggle) return;

    var logo = document.createElement("a");
    logo.href = "./brand.html";
    logo.id = "mobile-logo";
    logo.textContent = "THERMAN";
    header.insertBefore(logo, header.firstChild);

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

    toggle.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-open");
    });
    overlay.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        document.body.classList.remove("mobile-nav-open");
      }
    });
  });
})();
