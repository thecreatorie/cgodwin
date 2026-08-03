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

  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) {
      var os = navLinks.querySelectorAll(".has-sub.open");
      for (var i = 0; i < os.length; i++) {
        os[i].classList.remove("open");
        var b = os[i].querySelector(".nav-sub-toggle");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    }
  }

  burger.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("open"));
  });
  navLinks.addEventListener("click", function (e) {
    var t = e.target;
    var toggle = t.closest ? t.closest(".nav-sub-toggle") : null;
    if (toggle) {
      e.preventDefault();
      var li = toggle.parentNode;
      var op = li.classList.toggle("open");
      toggle.setAttribute("aria-expanded", op ? "true" : "false");
      return;
    }
    if (t.closest ? t.closest("a") : t.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("open")) setMenu(false);
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

  /* ---------- lightbox (YouTube videos + gallery photos) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxFrame = document.getElementById("lightboxFrame");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxCap = document.getElementById("lightboxCap");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  if (lightbox) {
    var openLightbox = function (videoId, ratio) {
      photoIndex = -1;
      showArrows(false);
      setCap("");
      lightboxFrame.innerHTML = "";
      lightboxFrame.classList.remove("photo");
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
      lightboxFrame.classList.remove("photo");
      photoIndex = -1;
      showArrows(false);
      setCap("");
      document.body.style.overflow = "";
    };

    /* photos: gallery figures carrying data-photo, browsable with the arrows */
    var photoEls = [].slice.call(document.querySelectorAll("[data-photo]"));
    var photoIndex = -1;

    function setCap(text) {
      if (!lightboxCap) return;
      lightboxCap.textContent = text || "";
      lightboxCap.classList.toggle("show", !!text);
    }
    function showArrows(on) {
      var many = on && photoEls.length > 1;
      if (lightboxPrev) lightboxPrev.classList.toggle("on", many);
      if (lightboxNext) lightboxNext.classList.toggle("on", many);
    }
    function showPhoto(i) {
      if (!photoEls.length) return;
      photoIndex = (i + photoEls.length) % photoEls.length;
      var el = photoEls[photoIndex];
      lightboxFrame.classList.remove("wide");
      lightboxFrame.classList.add("photo");
      lightboxFrame.innerHTML = "";
      var img = document.createElement("img");
      img.src = el.dataset.photo;
      img.alt = (el.querySelector("img") && el.querySelector("img").alt) || "";
      lightboxFrame.appendChild(img);
      setCap(el.dataset.caption || "");
      showArrows(true);
      // warm the neighbours so arrowing through feels instant
      [photoIndex + 1, photoIndex - 1].forEach(function (n) {
        var next = photoEls[(n + photoEls.length) % photoEls.length];
        if (next) { var pre = new Image(); pre.src = next.dataset.photo; }
      });
    }
    function openPhoto(i) {
      showPhoto(i);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    photoEls.forEach(function (el, i) {
      el.addEventListener("click", function () { openPhoto(i); });
      el.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); openPhoto(i); }
      });
    });
    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", function (ev) {
        ev.stopPropagation(); showPhoto(photoIndex - 1);
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener("click", function (ev) {
        ev.stopPropagation(); showPhoto(photoIndex + 1);
      });
    }
    document.addEventListener("keydown", function (ev) {
      if (photoIndex < 0 || !lightbox.classList.contains("open")) return;
      if (ev.key === "ArrowLeft") { ev.preventDefault(); showPhoto(photoIndex - 1); }
      if (ev.key === "ArrowRight") { ev.preventDefault(); showPhoto(photoIndex + 1); }
    });

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

  /* ---------- YouTube video backgrounds (lazy, muted, hard-looped) ----------
     Uses the IFrame Player API so we can force a restart on ENDED — the
     loop=1&playlist= URL trick is unreliable and silently stops on some clips.
     Falls back to a plain iframe if the API can't load.                     */
  var vbgs = document.querySelectorAll(".video-bg[data-ytbg]");
  if (vbgs.length) {
    var ytReady = false;
    var ytWaiting = [];
    var ytFailed = false;

    var whenYT = function (fn) {
      if (ytReady || ytFailed) { fn(); } else { ytWaiting.push(fn); }
    };
    var drainYT = function () {
      ytWaiting.splice(0, ytWaiting.length).forEach(function (fn) { fn(); });
    };

    window.onYouTubeIframeAPIReady = function () {
      ytReady = true;
      drainYT();
    };

    if (window.YT && window.YT.Player) {
      ytReady = true;
    } else {
      var ytScript = document.createElement("script");
      ytScript.src = "https://www.youtube.com/iframe_api";
      ytScript.async = true;
      document.head.appendChild(ytScript);
      // if the API never arrives (blocked/offline), degrade to plain iframes
      setTimeout(function () {
        if (ytReady) return;
        ytFailed = true;
        drainYT();
      }, 6000);
    }

    var plainFrame = function (el, id) {
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
    };

    var mountBg = function (el) {
      if (el.dataset.loaded) return;
      el.dataset.loaded = "1";
      var id = el.dataset.ytbg;

      whenYT(function () {
        if (!window.YT || !window.YT.Player) { plainFrame(el, id); return; }

        var host = document.createElement("div");
        host.setAttribute("aria-hidden", "true");
        el.insertBefore(host, el.firstChild);

        new window.YT.Player(host, {
          videoId: id,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 1, mute: 1, controls: 0, rel: 0, playsinline: 1,
            modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0,
            loop: 1, playlist: id
          },
          events: {
            onReady: function (e) {
              e.target.mute();
              e.target.playVideo();
              var f = e.target.getIframe();
              if (f) {
                f.setAttribute("tabindex", "-1");
                f.setAttribute("aria-hidden", "true");
                f.setAttribute("title", "");
                setTimeout(function () { f.classList.add("on"); }, 700);
              }
            },
            onStateChange: function (e) {
              // 0 = ENDED — restart at once so it never lands on the end card
              if (e.data === 0) { e.target.seekTo(0, true); e.target.playVideo(); }
              // 2 = PAUSED — a background loop should never sit paused
              if (e.data === 2) { e.target.playVideo(); }
            },
            onError: function (e) {
              var f = e.target && e.target.getIframe();
              if (f && f.parentNode) f.parentNode.removeChild(f);
            }
          }
        });
      });
    };

    if ("IntersectionObserver" in window) {
      var vbgIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            mountBg(entry.target);
            vbgIO.unobserve(entry.target);
          });
        },
        { rootMargin: "300px 0px" }
      );
      vbgs.forEach(function (el) { vbgIO.observe(el); });
    } else {
      vbgs.forEach(mountBg);
    }
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
