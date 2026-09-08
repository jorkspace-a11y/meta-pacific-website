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
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.getAttribute("data-filter"));
    });
  });

  window.addEventListener("hashchange", function () {
    var next = (location.hash || "").replace("#", "");
    if (next && root.querySelector('button[data-filter="' + next + '"]')) apply(next);
    else apply("all");
  });
})();
