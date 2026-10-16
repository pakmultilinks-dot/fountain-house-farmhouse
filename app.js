/* The Fountain House - minimal site logic.
   Contact + price live in exactly one place each: change them here. */
const WA_NUMBER = "923204409542";
const PRICE_TEXT = "PKR 18 Crore";

/* Gallery lightbox: tap a photo to view it full screen */
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
(function () {
  var sx = 0;
  lightbox.addEventListener("touchstart", function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();

/* Inquiry form -> opens WhatsApp to Al Jannat Associates with the message prefilled */
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
