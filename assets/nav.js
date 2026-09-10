(function () {
  if (/\/index\.html$/.test(location.pathname)) {
    history.replaceState(null, "", location.pathname.replace(/index\.html$/, "") + location.search + location.hash);
  }
})();

(function () {
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
  var STORAGE_KEY = "mp_attribution";

  function readParams() {
    var params = new URLSearchParams(location.search);
    var found = {};
    UTM_KEYS.forEach(function (key) {
      var v = params.get(key);
      if (v) found[key] = v;
    });
    return found;
  }

  function saveAttribution() {
    var found = readParams();
    if (Object.keys(found).length === 0) return;
    found.landing_page = location.pathname;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch (e) {}
  }

  function getAttribution() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function injectIntoForms() {
    var attribution = getAttribution();
    if (Object.keys(attribution).length === 0) return;
    document.querySelectorAll("form.contact-form-card").forEach(function (form) {
      Object.keys(attribution).forEach(function (key) {
        if (form.querySelector('input[name="' + key + '"]')) return;
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = attribution[key];
        form.appendChild(input);
      });
    });
  }

  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  function wireFormEvents() {
    document.querySelectorAll("form.contact-form-card").forEach(function (form) {
      var formName = form.getAttribute("data-form-name") || "unknown";
      var started = false;
      form.addEventListener(
        "focusin",
        function () {
          if (started) return;
          started = true;
          track("lead_form_start", { form_name: formName });
        },
        { once: true }
      );
      form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) return;
        event.preventDefault();
        if (form.getAttribute("data-submitting") === "true") return;

        track("lead_form_submit", { form_name: formName });
        form.setAttribute("data-submitting", "true");
        var button = form.querySelector('[type="submit"]');
        var originalLabel = button ? button.textContent : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Sending…";
        }
        var status = form.querySelector(".form-status");
        if (!status) {
          status = document.createElement("p");
          status.className = "form-status";
          status.setAttribute("role", "status");
          status.setAttribute("aria-live", "polite");
          form.appendChild(status);
        }
        status.textContent = "";

        Promise.all([submitToFormspree(form), submitToHubSpot(form, formName)])
          .then(function () {
            track("generate_lead", { form_name: formName, lead_source: "website_form" });
            status.textContent = "Thanks. Your project inquiry has been received.";
            status.classList.remove("is-error");
            form.reset();
          })
          .catch(function (error) {
            track("lead_form_error", {
              form_name: formName,
              destination: error && error.destination ? error.destination : "unknown",
            });
            status.textContent = "We could not send your inquiry. Please try again or use the WhatsApp link on this page.";
            status.classList.add("is-error");
          })
          .finally(function () {
            form.removeAttribute("data-submitting");
            if (button) {
              button.disabled = false;
              button.textContent = originalLabel;
            }
          });
      });
    });
  }

  var HUBSPOT_PORTAL_ID = "247334337";
  var HUBSPOT_FORM_GUID = "64468752-2695-49de-97fb-0a4c14fc2dbf";

  var PROJECT_TYPE_MAP = {
    "Immersive Property Launch": "immersive_property_launch",
    "Overlapping launches": "overlapping_launches",
    "Brand and Content": "brand_and_content",
    "Web and Landing Page": "web_and_landing_page",
    "Something Else": "something_else",
  };
  var CONSTRUCTION_STAGE_MAP = {
    "Planning": "planning",
    "Under construction": "under_construction",
    "Near completion": "near_completion",
    "Completed": "completed",
    "Not applicable": "not_applicable",
  };
  var TIMELINE_MAP = {
    "As soon as possible": "asap",
    "1 to 3 months": "1_3_months",
    "3 to 6 months": "3_6_months",
    "Just exploring": "just_exploring",
  };
  var BUDGET_MAP = {
    "Under IDR 25,000,000": "under_25m",
    "Around IDR 25,000,000 (Immersive Property Launch)": "around_25m",
    "Above IDR 25,000,000 / ongoing work": "above_25m",
    "Not sure yet": "not_sure",
  };

  function fv(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value : "";
  }

  function submitToFormspree(form) {
    return fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    }).then(function (response) {
      if (!response.ok) {
        var error = new Error("Formspree submission failed");
        error.destination = "formspree";
        throw error;
      }
      return response;
    });
  }

  function submitToHubSpot(form, formName) {
    var attribution = getAttribution();
    var fields = [];
    function add(name, value) {
      if (value) fields.push({ name: name, value: value });
    }
    add("email", fv(form, "email"));
    add("firstname", fv(form, "name"));
    add("company", fv(form, "company"));
    add("city", fv(form, "location"));
    add("website", fv(form, "website-instagram"));
    add("meta_project_type", PROJECT_TYPE_MAP[fv(form, "project-type")]);
    add("meta_units", fv(form, "units"));
    add("meta_construction_stage", CONSTRUCTION_STAGE_MAP[fv(form, "construction-stage")]);
    add("meta_timeline", TIMELINE_MAP[fv(form, "timeline")]);
    add("meta_budget_range", BUDGET_MAP[fv(form, "budget-range")]);
    add("message", fv(form, "message"));
    add("meta_lead_source_page", formName);
    add("meta_utm_source", attribution.utm_source);
    add("meta_utm_medium", attribution.utm_medium);
    add("meta_utm_campaign", attribution.utm_campaign);

    if (!fields.some(function (f) { return f.name === "email"; })) return;

    var url =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      HUBSPOT_PORTAL_ID +
      "/" +
      HUBSPOT_FORM_GUID;
    try {
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          fields: fields,
          context: { pageUri: location.href, pageName: document.title },
        }),
      }).then(function (response) {
        if (!response.ok) {
          var error = new Error("HubSpot submission failed");
          error.destination = "hubspot";
          throw error;
        }
        return response;
      });
    } catch (error) {
      error.destination = "hubspot";
      return Promise.reject(error);
    }
  }

  saveAttribution();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectIntoForms();
      wireFormEvents();
    });
  } else {
    injectIntoForms();
    wireFormEvents();
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
