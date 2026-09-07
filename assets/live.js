(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero load sequence
  var hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add("is-live");
    });
  }

  // Formation reveals for lists that earn stagger
  function watchLive(selector) {
    var nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-live"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-live");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
    nodes.forEach(function (n) { io.observe(n); });
  }
  watchLive(".work-grid");
  watchLive(".process-row");

  // Pointer parallax on the capture plane — continuity with the flight path
  var stage = document.querySelector(".capture-stage");
  var panel = document.querySelector(".capture-panel");
  if (stage && panel && !reduce) {
    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = 0;
    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      stage.style.transform = "translate3d(" + curX.toFixed(2) + "px," + curY.toFixed(2) + "px,0)";
      raf = requestAnimationFrame(tick);
    }
    panel.addEventListener("pointermove", function (e) {
      var r = panel.getBoundingClientRect();
      var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      targetX = nx * 14;
      targetY = ny * 10;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    panel.addEventListener("pointerleave", function () {
      targetX = 0;
      targetY = 0;
    });
  }

  // Scroll-linked drone speed: pause when the hero leaves the viewport
  var dot = document.querySelector(".drone-dot");
  if (dot && panel && "IntersectionObserver" in window) {
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        dot.style.animationPlayState = e.isIntersecting ? "running" : "paused";
      });
    }, { threshold: 0.12 });
    dio.observe(panel);
  }
})();
