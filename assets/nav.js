(function () {
  if (/\/index\.html$/.test(location.pathname)) {
    history.replaceState(null, "", location.pathname.replace(/index\.html$/, "") + location.search + location.hash);
  }
})();

(function () {
  var root = document.querySelector("[data-nav]");
  if (!root) return;

  var toggle = root.querySelector(".nav-toggle");
  var items = Array.prototype.slice.call(root.querySelectorAll(".nav-item.has-panel"));
  var mq = window.matchMedia("(max-width: 880px)");
  var hoverTimer = null;

  function isMobile() {
    return mq.matches;
  }

  function closePanels(except) {
    items.forEach(function (item) {
      if (item === except) return;
      item.classList.remove("is-open");
      var trigger = item.querySelector(".nav-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  function openPanel(item) {
    closePanels(item);
    item.classList.add("is-open");
    var trigger = item.querySelector(".nav-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }

  function setMenu(open) {
    root.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("nav-lock", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) closePanels();
  }

  items.forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (item.classList.contains("is-open")) closePanels();
      else openPanel(item);
    });

    item.addEventListener("pointerenter", function () {
      if (isMobile()) return;
      clearTimeout(hoverTimer);
      openPanel(item);
    });

    item.addEventListener("pointerleave", function () {
      if (isMobile()) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        if (!item.matches(":hover")) closePanels();
      }, 140);
    });
  });

  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!root.classList.contains("is-menu-open"));
    });
    toggle.addEventListener("pointerdown", function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePanels();
      setMenu(false);
    }
  });

  document.addEventListener("pointerdown", function (e) {
    if (!root.contains(e.target)) {
      closePanels();
      if (isMobile()) setMenu(false);
    }
  });

  items.forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;
    trigger.addEventListener("pointerdown", function (e) {
      if (isMobile()) e.stopPropagation();
    });
  });

  root.querySelectorAll(".nav-panel a, .nav-cta-mobile").forEach(function (link) {
    link.addEventListener("click", function () {
      closePanels();
      setMenu(false);
    });
  });

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", function () {
      closePanels();
      setMenu(false);
    });
  }
})();
