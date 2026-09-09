/* Meta Pacific interaction layer.
   Loaded after live.js. Every behaviour here has one job:
   - flight-path scroll indicator: orientation on long pages, in the brand's own signature
   - stat count-up: real numbers land harder when they resolve
   - magnetic CTAs: the conversion point should feel alive under the cursor
   - work-thumb parallax: the media is the proof, give it depth
   - route fade: the site should feel like one product, not a folder of pages
   No section fade-up soup, no scroll-jacking, no motion that hides content. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof window.gsap === "undefined" || reduce) return;

  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var ease = "power3.out";

  /* ---------- 1. Flight-path scroll indicator ---------- */
  (function flightProgress() {
    var bar = document.createElement("div");
    bar.className = "flight-progress";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML =
      '<span class="flight-progress-line"></span><span class="flight-progress-dot"></span>';
    document.body.appendChild(bar);

    var line = bar.querySelector(".flight-progress-line");
    var dot = bar.querySelector(".flight-progress-dot");

    gsap.to(line, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
    gsap.to(dot, {
      left: "100%",
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  })();

  /* ---------- 2. Stat count-up ---------- */
  gsap.utils.toArray(".stat .n").forEach(function (el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d[\d,]*)(.*)$/);
    if (!match) return;
    var target = parseInt(match[1].replace(/,/g, ""), 10);
    var suffix = match[2] || "";
    if (!target || target > 100000) return;
    var counter = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(counter, {
          value: target,
          duration: target > 50 ? 1.4 : 0.9,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(counter.value).toLocaleString("en-US") + suffix;
          },
          onComplete: function () {
            el.textContent = target.toLocaleString("en-US") + suffix;
          },
        });
      },
    });
  });

  /* ---------- 3. Magnetic primary CTAs ---------- */
  if (finePointer) {
    document.querySelectorAll(".btn-solid").forEach(function (btn) {
      var moveX = gsap.quickTo(btn, "x", { duration: 0.4, ease: ease });
      var moveY = gsap.quickTo(btn, "y", { duration: 0.4, ease: ease });
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        moveX(((e.clientX - r.left) / r.width - 0.5) * 10);
        moveY(((e.clientY - r.top) / r.height - 0.5) * 6);
      });
      btn.addEventListener("pointerleave", function () {
        moveX(0);
        moveY(0);
      });
    });
  }

  /* ---------- 4. Work thumbnail parallax ---------- */
  gsap.utils.toArray(".work-thumb img").forEach(function (img) {
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest(".work-item") || img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  /* ---------- 5. Route fade ---------- */
  (function routeFade() {
    var veil = document.createElement("div");
    veil.className = "route-veil";
    veil.setAttribute("aria-hidden", "true");
    document.body.appendChild(veil);

    function clearVeil() {
      gsap.to(veil, { opacity: 0, duration: 0.28, ease: ease, pointerEvents: "none" });
    }
    clearVeil();
    // Restore on back/forward, where the page comes out of bfcache mid-fade.
    window.addEventListener("pageshow", clearVeil);

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest && e.target.closest("a");
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;

      var url;
      try {
        url = new URL(link.href);
      } catch (err) {
        return;
      }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;

      e.preventDefault();
      gsap.set(veil, { pointerEvents: "auto" });
      gsap.to(veil, {
        opacity: 1,
        duration: 0.18,
        ease: "power2.in",
        onComplete: function () {
          location.href = link.href;
        },
      });
      // Failsafe: never strand the visitor behind a veil if navigation stalls.
      setTimeout(clearVeil, 1600);
    });
  })();
})();
