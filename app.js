/* The Fountain House - site logic.
   PRICE lives in exactly one place: change it here and every price
   slot on the page updates automatically. */
const PRICE = "Price on request";

/* Promo video: if assets/farmhouse-promo-16x9-web.mp4 exists it plays in the
   Virtual Tour section, otherwise a graceful placeholder stays visible. */
const PROMO_VIDEO_SRC = "assets/farmhouse-promo-16x9-web.mp4";

const WA_NUMBER = "923146365550";
const WA_DEFAULT_TEXT = "Assalam-o-Alaikum, I'm interested in The Fountain House farmhouse (25.5 kanal, Barki Road). Please share details.";

/* Render price everywhere */
document.querySelectorAll("[data-price]").forEach(function (el) {
  el.textContent = PRICE;
});

/* Sticky nav */
var nav = document.getElementById("nav");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Mobile menu */
var navToggle = document.getElementById("navToggle");
var navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});

/* Reveal on scroll */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

/* Gallery lightbox */
var lightbox = document.getElementById("lightbox");
var lbImg = document.getElementById("lbImg");
var lbCap = document.getElementById("lbCap");
var lbItems = [];
var lbIndex = 0;

document.querySelectorAll(".gallery-grid").forEach(function (grid) {
  grid.querySelectorAll(".g-item").forEach(function (item) {
    lbItems.push(item);
    item.addEventListener("click", function () {
      openLightbox(lbItems.indexOf(item));
    });
  });
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
document.getElementById("lbPrev").addEventListener("click", function (e) {
  e.stopPropagation();
  openLightbox(lbIndex - 1);
});
document.getElementById("lbNext").addEventListener("click", function (e) {
  e.stopPropagation();
  openLightbox(lbIndex + 1);
});
lightbox.addEventListener("click", function (e) {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", function (e) {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
});

/* Virtual tour: show the video only if the file actually exists */
(function initTour() {
  var video = document.getElementById("tourVideo");
  var placeholder = document.getElementById("tourPlaceholder");
  fetch(PROMO_VIDEO_SRC, { method: "HEAD" })
    .then(function (res) {
      if (res.ok) {
        placeholder.style.display = "none";
        video.style.display = "block";
      }
    })
    .catch(function () {
      /* file not there yet: placeholder stays visible */
    });
})();

/* Inquiry form -> WhatsApp */
document.getElementById("inquiryForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var name = document.getElementById("inqName").value.trim();
  var phone = document.getElementById("inqPhone").value.trim();
  var msg = document.getElementById("inqMsg").value.trim();
  var text =
    "Assalam-o-Alaikum, I'm " + name + " (" + phone + "). " +
    "I'm interested in The Fountain House farmhouse (25.5 kanal, Barki Road). " +
    (msg ? msg : "Please share details.");
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
});
