(function () {
  var root = document.querySelector("[data-work-filters]");
  if (!root) return;
  var buttons = Array.prototype.slice.call(root.querySelectorAll("button[data-filter]"));
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-work-item]"));

  function apply(filter) {
    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-filter") === filter;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    items.forEach(function (item) {
      var show = filter === "all" || item.getAttribute("data-cat") === filter;
      item.hidden = !show;
      if (show) item.removeAttribute("aria-hidden");
      else item.setAttribute("aria-hidden", "true");
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      } else {
        history.replaceState(null, "", "#" + filter);
      }
      apply(filter);
    });
  });

  function fromHash() {
    var hash = (location.hash || "").replace("#", "");
    if (hash && root.querySelector('button[data-filter="' + hash + '"]')) apply(hash);
    else apply("all");
  }

  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
