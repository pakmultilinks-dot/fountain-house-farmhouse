/* The Fountain House - Emerald Editorial.
   Lightbox gallery + WhatsApp inquiry form. No animation gimmicks. */
(function () {
  var WA_NUMBER = "923204409542";

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var items = [];
  var current = 0;

  function collect() {
    items = [];
    var figs = document.querySelectorAll("#photoGrid .g-item");
    for (var i = 0; i < figs.length; i++) {
      items.push({
        full: figs[i].getAttribute("data-full"),
        caption: figs[i].getAttribute("data-caption") || "",
        el: figs[i]
      });
      (function (idx) {
        figs[idx].addEventListener("click", function () { openLb(idx); });
      })(i);
    }
  }

  function openLb(i) {
    current = i;
    render();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function render() {
    var it = items[current];
    lbImg.src = it.full;
    lbImg.alt = it.caption;
    lbCap.textContent = it.caption;
  }
  function step(d) {
    current = (current + d + items.length) % items.length;
    render();
  }

  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* Touch swipe */
  var touchX = null;
  lightbox.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  collect();

  /* ---------- Inquiry form -> WhatsApp ---------- */
  var form = document.getElementById("inquiryForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("inqName").value.trim();
    var phone = document.getElementById("inqPhone").value.trim();
    var msg = document.getElementById("inqMsg").value.trim();
    var text = "Assalam-o-Alaikum, I am " + name + " (" + phone + "). " +
      "I am interested in The Fountain House farmhouse (25.5 kanal, Barki Road, Lahore). " +
      (msg ? msg : "Please share details.");
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
  });
})();
