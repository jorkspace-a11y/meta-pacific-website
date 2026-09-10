(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var compact = window.matchMedia("(max-width: 720px)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  // Single source of truth. live.css parks exactly these at opacity 0 as the
  // reveal's "before" state, so anything listed there must be listed here or
  // it stays invisible forever. Two whole sections were lost that way: the
  // .process-step cards on About and Values sit in .principles-row, and the
  // reveal was scoped to .process-row, so nothing ever brought them back.
  // Reveal selectors below are class-only for the same reason: the container
  // an element happens to sit in must not decide whether it is visible.
  var REVEAL_TARGETS =
    ".hero-brand-mark, .hero h1, .hero-verticals, .hero-sub, .hero-cta-row, " +
    ".capture-panel, .work-item, .process-step, .pillar, .fit-card, " +
    ".insight-featured, .insight-minor, .solution-card, .price-card, " +
    ".scope-card, .custom-card, .stat, .faq-list details";

  if (!hasGSAP) {
    // GSAP failed to load (CDN down, offline, etc). Fail open: show
    // everything instead of leaving content stuck at the CSS hidden state.
    document.querySelectorAll(REVEAL_TARGETS).forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  var ease = "power3.out";

  if (reduce) {
    // Respect the OS setting: land in final state, no motion at all.
    gsap.set(REVEAL_TARGETS, { opacity: 1, x: 0, y: 0, clearProps: "transform" });
    var line = document.querySelector(".capture-panel .flight-line");
    if (line) line.style.strokeDashoffset = 0;
    return;
  }

  // Hero load sequence — one authored entrance, not a generic fade-up.
  var hero = document.querySelector(".hero");
  if (hero && !compact) {
    var tl = gsap.timeline({ defaults: { ease: ease, duration: 0.7 } });
    tl.to(".hero-brand-mark", { opacity: 1, y: 0 }, 0.05)
      .to(".hero h1", { opacity: 1, y: 0 }, 0.12)
      .to(".hero-verticals", { opacity: 1, y: 0 }, 0.2)
      .to(".hero-sub", { opacity: 1, y: 0 }, 0.28)
      .to(".hero-cta-row", { opacity: 1, y: 0 }, 0.36)
      .to(".capture-panel", { opacity: 1, y: 0, duration: 0.9 }, 0.35);

    var flightLine = document.querySelector(".capture-panel .flight-line");
    if (flightLine) {
      tl.fromTo(
        flightLine,
        { strokeDashoffset: 1800 },
        { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" },
        0.55
      );
    }
  } else if (hero) {
    gsap.set(".hero-brand-mark, .hero h1, .hero-verticals, .hero-sub, .hero-cta-row", {
      opacity: 1,
      y: 0,
      clearProps: "transform",
    });
    gsap.set(".capture-panel", { opacity: 1, y: 0, clearProps: "transform" });
  }

  // Broad scroll reveal for every card-like group site-wide.
  // Individual ScrollTrigger.create() per element, not batch() -- batch()
  // measured every element's position as already-passed on this page even
  // when far below the fold, firing onEnter instantly for all of them.
  // Plain create() verified correct in isolation; stagger is done by hand.
  function reveal(selector, opts) {
    var stagger = (opts && opts.stagger) || 0.08;
    // Stagger is counted per parent, so a page with two rows of cards does not
    // hand the second row a delay inherited from the first.
    var groups = [];
    var parents = [];
    gsap.utils.toArray(selector).forEach(function (el) {
      var idx = parents.indexOf(el.parentNode);
      if (idx === -1) {
        parents.push(el.parentNode);
        groups.push([el]);
      } else {
        groups[idx].push(el);
      }
    });
    groups.forEach(function (els) {
      els.forEach(function (el, i) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: function () {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: ease,
              delay: i * stagger,
              overwrite: true,
            });
          },
        });
      });
    });
  }

  function setUpReveals() {
    reveal(".work-item");
    reveal(".process-step", { stagger: 0.06 });
    reveal(".pillar");
    reveal(".fit-card");
    reveal(".insight-featured, .insight-minor");
    reveal(".solution-card");
    reveal(".price-card");
    reveal(".scope-card");
    reveal(".custom-card");
    reveal(".stat", { stagger: 0.1 });
    reveal(".faq-list details", { stagger: 0.05 });

    // Last line of defence. If live.css ever parks something the list above
    // does not cover, show it rather than lose the section. Runs once, well
    // after the reveals have had their chance to fire.
    setTimeout(function () {
      document.querySelectorAll(REVEAL_TARGETS).forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) > 0.01) return;
        if (el.getBoundingClientRect().top > window.innerHeight * 1.5) return;
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: ease });
      });
    }, 2500);
  }
  function deferredSetUp() {
    // A short delay after load, not the load event itself: layout can still
    // be settling (image decode, font swap) in the same tick load fires,
    // which was making ScrollTrigger measure elements as already in view.
    setTimeout(setUpReveals, 60);
  }
  if (document.readyState === "complete") {
    deferredSetUp();
  } else {
    window.addEventListener("load", deferredSetUp);
  }

  // Pointer parallax on the capture plane — continuity with the flight path.
  var stage = document.querySelector(".capture-stage");
  var panel = document.querySelector(".capture-panel");
  if (stage && panel) {
    var moveX = gsap.quickTo(stage, "x", { duration: 0.6, ease: "power3.out" });
    var moveY = gsap.quickTo(stage, "y", { duration: 0.6, ease: "power3.out" });
    panel.addEventListener("pointermove", function (e) {
      var r = panel.getBoundingClientRect();
      var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      moveX(nx * 14);
      moveY(ny * 10);
    });
    panel.addEventListener("pointerleave", function () {
      moveX(0);
      moveY(0);
    });
  }

  // Scroll-linked drone speed: pause when the hero leaves the viewport.
  var dot = document.querySelector(".drone-dot");
  if (dot && panel) {
    ScrollTrigger.create({
      trigger: panel,
      start: "top bottom",
      end: "bottom top",
      onToggle: function (self) {
        dot.style.animationPlayState = self.isActive ? "running" : "paused";
      },
    });
  }
})();
