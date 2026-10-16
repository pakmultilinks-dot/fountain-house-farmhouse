/* The Fountain House - site logic (extreme rebuild).
   Contact + price live in exactly one place each: change them here. */
const WA_NUMBER = "923204409542";
const WA_DEFAULT_TEXT = "Assalam-o-Alaikum, I'm interested in The Fountain House farmhouse (25.5 kanal, Barki Road, Lahore). Please share details.";
const PRICE_TEXT = "PKR 18 Crore";

/* Sticky nav */
var nav = document.getElementById("nav");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  /* gentle hero parallax */
  var heroContent = document.querySelector(".hero-content");
  var heroVideo = document.getElementById("heroVideo");
  if (heroContent && window.scrollY < window.innerHeight) {
    heroContent.style.transform = "translateY(" + window.scrollY * 0.22 + "px)";
    heroContent.style.opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.85));
    if (heroVideo) heroVideo.style.transform = "translateY(" + window.scrollY * 0.12 + "px) scale(1.06)";
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Hero video: nudge playback in case autoplay was blocked from starting muted */
(function () {
  var v = document.getElementById("heroVideo");
  if (!v) return;
  var tryPlay = function () {
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* stays on poster frame */ });
  };
  if (v.readyState >= 2) tryPlay();
  else v.addEventListener("canplay", tryPlay, { once: true });
})();

/* Mobile menu */
var navToggle = document.getElementById("navToggle");
var navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("active");
});
navLinks.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
  });
});

/* Reveal on scroll, with a soft stagger inside grids */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal").forEach(function (el) {
  var siblings = Array.prototype.slice.call(el.parentNode.children).filter(function (c) {
    return c.classList && c.classList.contains("reveal");
  });
  var idx = siblings.indexOf(el);
  if (idx > 0 && idx < 8) el.style.transitionDelay = Math.min(idx * 70, 420) + "ms";
  revealObserver.observe(el);
});

/* Animated stat counters */
function animateCount(el) {
  var target = parseFloat(el.getAttribute("data-target"));
  var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
  var dur = 1600, start = null;
  function frame(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / dur, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    var val = target * eased;
    el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString("en-US");
  }
  requestAnimationFrame(frame);
}
var countObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".count").forEach(function (el) { countObserver.observe(el); });

/* Gallery lightbox (real photos only) */
var lightbox = document.getElementById("lightbox");
var lbImg = document.getElementById("lbImg");
var lbCap = document.getElementById("lbCap");
var lbItems = [];
var lbIndex = 0;

document.querySelectorAll("#photoGrid .g-item").forEach(function (item) {
  lbItems.push(item);
  item.addEventListener("click", function () { openLightbox(lbItems.indexOf(item)); });
});

function openLightbox(i) {
  lbIndex = (i + lbItems.length) % lbItems.length;
  var item = lbItems[lbIndex];
  lbImg.src = item.getAttribute("data-full");
  lbImg.alt = item.querySelector("img").alt;
  lbCap.textContent = item.getAttribute("data-caption");
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(lbIndex - 1); });
document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(lbIndex + 1); });
lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", function (e) {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
});
/* touch swipe in lightbox */
(function () {
  var sx = 0;
  lightbox.addEventListener("touchstart", function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();

/* Virtual tour: big play button over the real promo video */
(function initTour() {
  var video = document.getElementById("tourVideo");
  var playBtn = document.getElementById("tourPlay");
  if (!video || !playBtn) return;
  playBtn.addEventListener("click", function () {
    video.play();
    playBtn.classList.add("hidden");
    video.setAttribute("controls", "");
  });
  video.addEventListener("pause", function () { playBtn.classList.remove("hidden"); });
  video.addEventListener("play", function () { playBtn.classList.add("hidden"); });
})();

/* Inquiry form -> WhatsApp to Naeem Akhtar Awan */
document.getElementById("inquiryForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var name = document.getElementById("inqName").value.trim();
  var phone = document.getElementById("inqPhone").value.trim();
  var msg = document.getElementById("inqMsg").value.trim();
  var text =
    "Assalam-o-Alaikum, I'm " + name + " (" + phone + "). " +
    "I'm interested in The Fountain House farmhouse (25.5 kanal, Barki Road, Lahore, " + PRICE_TEXT + "). " +
    (msg ? msg : "Please share details.");
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
});
