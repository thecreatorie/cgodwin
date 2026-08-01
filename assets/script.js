/* Caroline Godwin — site interactions */
(function () {
  "use strict";

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  function onScrollNav() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- marquees: duplicate tracks for seamless loop ---------- */
  ["marqueeTrack", "marqueeTrack2"].forEach(function (id) {
    var track = document.getElementById(id);
    if (track) track.innerHTML += track.innerHTML;
  });

  /* ---------- video lightbox (YouTube) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxFrame = document.getElementById("lightboxFrame");
  var lightboxClose = document.getElementById("lightboxClose");
  if (lightbox) {
    var openLightbox = function (videoId, ratio) {
      lightboxFrame.innerHTML = "";
      lightboxFrame.classList.toggle("wide", ratio === "wide");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + videoId + "?rel=0&autoplay=1";
      iframe.title = "Performance video";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      lightboxFrame.appendChild(iframe);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    var closeLightbox = function () {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxFrame.innerHTML = "";
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-video]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(el.dataset.video, el.dataset.ratio || "wide");
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(el.dataset.video, el.dataset.ratio || "wide");
        }
      });
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---------- YouTube video backgrounds (lazy autoplay loops) ---------- */
  var vbgs = document.querySelectorAll(".video-bg[data-ytbg]");
  if (vbgs.length && "IntersectionObserver" in window) {
    var vbgIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.dataset.loaded) return;
          el.dataset.loaded = "1";
          var id = el.dataset.ytbg;
          var iframe = document.createElement("iframe");
          iframe.src =
            "https://www.youtube-nocookie.com/embed/" + id +
            "?autoplay=1&mute=1&loop=1&playlist=" + id +
            "&controls=0&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&modestbranding=1";
          iframe.title = "";
          iframe.setAttribute("aria-hidden", "true");
          iframe.setAttribute("tabindex", "-1");
          iframe.allow = "autoplay; encrypted-media";
          iframe.addEventListener("load", function () {
            setTimeout(function () { iframe.classList.add("on"); }, 600);
          });
          el.insertBefore(iframe, el.firstChild);
          vbgIO.unobserve(el);
        });
      },
      { rootMargin: "300px 0px" }
    );
    vbgs.forEach(function (el) { vbgIO.observe(el); });
  }

  /* ---------- side dot nav active state ---------- */
  var dotLinks = document.querySelectorAll(".dot-nav a");
  if (dotLinks.length && "IntersectionObserver" in window) {
    var sectionMap = {};
    dotLinks.forEach(function (a) {
      var id = a.getAttribute("data-section");
      var el = document.getElementById(id);
      if (el) sectionMap[id] = a;
    });
    var dotIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            dotLinks.forEach(function (a) { a.classList.remove("active"); });
            var link = sectionMap[entry.target.id];
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    Object.keys(sectionMap).forEach(function (id) {
      dotIO.observe(document.getElementById(id));
    });
  }

  /* ---------- back to top ---------- */
  var toTop = document.getElementById("toTop");
  window.addEventListener(
    "scroll",
    function () {
      toTop.classList.toggle("show", window.scrollY > 900);
    },
    { passive: true }
  );
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- ember particles ---------- */
  var canvas = document.getElementById("embers");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var embers = [];
    var W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    var COUNT = Math.min(38, Math.floor(window.innerWidth / 30));

    function spawn(initial) {
      var hues = [2, 16, 30, 44]; // red, ember, orange, gold
      var hue = hues[Math.floor(Math.random() * hues.length)] + (Math.random() - 0.5) * 10;
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 10,
        r: 0.6 + Math.random() * 2.1,
        vy: 0.14 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.003 + Math.random() * 0.009,
        alpha: 0.08 + Math.random() * 0.4,
        hue: hue
      };
    }
    for (var i = 0; i < COUNT; i++) embers.push(spawn(true));

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < embers.length; i++) {
        var p = embers[i];
        p.drift += p.driftSpeed;
        p.x += p.vx + Math.sin(p.drift) * 0.3;
        p.y -= p.vy;
        var fade = p.y < H * 0.35 ? Math.max(0, p.y / (H * 0.35)) : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          "hsla(" + p.hue + ", 100%, " + (55 + p.r * 8) + "%, " + p.alpha * fade + ")";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "hsla(" + p.hue + ", 100%, 60%, .8)";
        ctx.fill();
        ctx.shadowBlur = 0;
        if (p.y < -12 || p.x < -12 || p.x > W + 12) embers[i] = spawn(false);
      }
      requestAnimationFrame(tick);
    }
    tick();
  }
})();
