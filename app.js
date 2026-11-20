/* ========== Data — aynı iş kuralları (Python konsol projesi) ========== */
const MENU = {
  U101: { ad: "Espresso", fiyat: 90, icon: "espresso" },
  U102: { ad: "Latte", fiyat: 130, icon: "latte" },
  U103: { ad: "Cappuccino", fiyat: 120, icon: "cappuccino" },
  U104: { ad: "Tost", fiyat: 150, icon: "toast" },
  U105: { ad: "Cheesecake", fiyat: 180, icon: "cake" },
  U106: { ad: "Su", fiyat: 25, icon: "water" },
  U107: { ad: "Sandviç", fiyat: 160, icon: "sandwich" },
  U108: { ad: "Çay", fiyat: 40, icon: "tea" },
};

const masalar = { 1: [], 2: [], 3: [], 4: [], 5: [] };
let sepet = [];
let aktifMasa = null;
let seciliKasaMasa = null;
let qtyUrunKodu = null;

const ICONS = {
  espresso: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 9h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4V9z"/><path d="M16 11h2.5a2.5 2.5 0 010 5H16"/><path d="M8 4c.5 1 .5 2 0 3M11 4c.5 1 .5 2 0 3M14 4c.5 1 .5 2 0 3"/></svg>`,
  latte: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10h13v4.5A4.5 4.5 0 0112.5 19h-4A4.5 4.5 0 014 14.5V10z"/><path d="M17 12h2a2.5 2.5 0 010 5h-2"/><ellipse cx="10.5" cy="10" rx="5.5" ry="2"/></svg>`,
  cappuccino: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 11h12v3a4 4 0 01-4 4H9a4 4 0 01-4-4v-3z"/><path d="M17 13h1.8a2.2 2.2 0 010 4.4H17"/><path d="M7 8c1.2-1.5 2.8-1.5 4 0s2.8 1.5 4 0"/></svg>`,
  toast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="6" width="16" height="12" rx="3"/><path d="M8 10h8M8 14h5"/></svg>`,
  cake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 18h16v2H4zM5 11h14l-1 7H6l-1-7z"/><path d="M8 11V9a2 2 0 012-2h0a2 2 0 012 2v2M14 11V8.5A1.5 1.5 0 0115.5 7h0"/></svg>`,
  water: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z"/></svg>`,
  sandwich: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 9l9-4 9 4v2H3V9zM3 13h18v2l-9 4-9-4v-2z"/><path d="M5 11h14"/></svg>`,
  tea: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 9h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4V9z"/><path d="M16 11h2.5a2.5 2.5 0 010 5H16"/><path d="M6 20h10M10 4v2"/></svg>`,
};

function $(sel) {
  return document.querySelector(sel);
}

function $$(sel) {
  return [...document.querySelectorAll(sel)];
}

function formatTL(n) {
  return `${n} TL`;
}

function adisyonToplami(adisyon) {
  return adisyon.reduce((t, k) => t + k.fiyat * k.adet, 0);
}

function sepetToplami() {
  return adisyonToplami(sepet);
}

function sepetAdet() {
  return sepet.reduce((t, k) => t + k.adet, 0);
}

function masaDurumu(masaNo) {
  return masalar[masaNo].length > 0 ? "DOLU" : "BOŞ";
}

function masaGecerliMi(masaNo) {
  return Object.prototype.hasOwnProperty.call(masalar, masaNo);
}

function toast(msg, type = "ok") {
  const stack = $("#toast-stack");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add("is-out");
    setTimeout(() => el.remove(), 280);
  }, 2600);
}

function showScreen(id) {
  $$(".screen").forEach((s) => {
    const active = s.id === id;
    s.classList.toggle("is-active", active);
    s.hidden = !active;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) {
  $(id).hidden = false;
}

function closeModals() {
  $$(".modal").forEach((m) => {
    m.hidden = true;
  });
  qtyUrunKodu = null;
}

function renderCustomerTables() {
  const grid = $("#customer-table-grid");
  grid.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const busy = masaDurumu(i) === "DOLU";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `table-card${busy ? " is-busy" : ""}`;
    btn.innerHTML = `
      <div class="table-num">${i}</div>
      <div class="table-state"><span class="dot"></span>${masaDurumu(i)}</div>
      <div class="table-meta">${busy ? formatTL(adisyonToplami(masalar[i])) : "Sipariş vermek için seçin"}</div>
    `;
    btn.addEventListener("click", () => enterCustomer(i));
    grid.appendChild(btn);
  }
}

function renderCashierTables() {
  const grid = $("#cashier-table-grid");
  grid.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const busy = masaDurumu(i) === "DOLU";
    const selected = seciliKasaMasa === i;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `table-card${busy ? " is-busy" : ""}${selected ? " is-selected" : ""}`;
    btn.innerHTML = `
      <div class="table-num">${i}</div>
      <div class="table-state"><span class="dot"></span>${masaDurumu(i)}</div>
      <div class="table-meta">${busy ? `${masalar[i].length} kalem · ${formatTL(adisyonToplami(masalar[i]))}` : "Boş masa"}</div>
    `;
    btn.addEventListener("click", () => selectCashierTable(i));
    grid.appendChild(btn);
  }
}

function renderMenu() {
  const grid = $("#menu-grid");
  grid.innerHTML = "";
  Object.entries(MENU).forEach(([kod, urun]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "product-card";
    btn.innerHTML = `
      <div class="product-icon">${ICONS[urun.icon] || ICONS.espresso}</div>
      <p class="product-code">${kod}</p>
      <p class="product-name">${urun.ad}</p>
      <p class="product-price">${formatTL(urun.fiyat)}</p>
    `;
    btn.addEventListener("click", () => openQtyModal(kod));
    grid.appendChild(btn);
  });
}

function renderCart() {
  const list = $("#cart-list");
  const badge = $("#cart-badge");
  const total = $("#cart-total");
  badge.textContent = String(sepetAdet());
  total.textContent = formatTL(sepetToplami());

  if (sepet.length === 0) {
    list.innerHTML = `<div class="empty"><p>Sepetiniz boş. Menüden ürün ekleyin.</p></div>`;
    return;
  }

  list.innerHTML = "";
  sepet.forEach((kalem) => {
    const row = document.createElement("div");
    row.className = "line-item";
    row.innerHTML = `
      <p class="name">${kalem.ad}</p>
      <p class="sum">${formatTL(kalem.fiyat * kalem.adet)}</p>
      <p class="meta">${kalem.kod} · ${formatTL(kalem.fiyat)} × ${kalem.adet}</p>
      <button type="button" class="remove" data-kod="${kalem.kod}">Sil</button>
    `;
    row.querySelector(".remove").addEventListener("click", () => sepettenSil(kalem.kod));
    list.appendChild(row);
  });
}

function renderAdisyonStrip() {
  const strip = $("#adisyon-strip");
  const chips = $("#adisyon-chips");
  const totalEl = $("#adisyon-strip-total");
  const status = $("#customer-masa-status");
  const adisyon = masalar[aktifMasa] || [];

  status.textContent = masaDurumu(aktifMasa);
  status.classList.toggle("is-busy", adisyon.length > 0);

  if (adisyon.length === 0) {
    strip.hidden = true;
    return;
  }

  strip.hidden = false;
  totalEl.textContent = formatTL(adisyonToplami(adisyon));
  chips.innerHTML = adisyon
    .map(
      (k) =>
        `<span class="chip"><strong>${k.ad}</strong> ×${k.adet} · ${formatTL(k.fiyat * k.adet)}</span>`
    )
    .join("");
}

function renderBill() {
  const list = $("#bill-list");
  const footer = $("#bill-footer");
  const title = $("#bill-title");
  const subtitle = $("#bill-subtitle");
  const total = $("#bill-total");

  if (!seciliKasaMasa) {
    title.textContent = "Adisyon";
    subtitle.textContent = "Bir masa seçin";
    footer.hidden = true;
    list.innerHTML = `<div class="empty"><p>Detay için dolu bir masa seçin.</p></div>`;
    return;
  }

  const adisyon = masalar[seciliKasaMasa];
  title.textContent = `Masa ${seciliKasaMasa}`;
  subtitle.textContent = masaDurumu(seciliKasaMasa);

  if (adisyon.length === 0) {
    footer.hidden = true;
    list.innerHTML = `<div class="empty"><p>Masa ${seciliKasaMasa} şu anda BOŞ. Adisyon bulunmuyor.</p></div>`;
    return;
  }

  footer.hidden = false;
  total.textContent = formatTL(adisyonToplami(adisyon));
  list.innerHTML = "";
  adisyon.forEach((kalem) => {
    const row = document.createElement("div");
    row.className = "line-item";
    row.innerHTML = `
      <p class="name">${kalem.ad}</p>
      <p class="sum">${formatTL(kalem.fiyat * kalem.adet)}</p>
      <p class="meta">${kalem.kod} · ${formatTL(kalem.fiyat)} × ${kalem.adet}</p>
    `;
    list.appendChild(row);
  });
}

function openQtyModal(kod) {
  const urun = MENU[kod];
  if (!urun) {
    toast("Geçersiz ürün kodu!", "err");
    return;
  }
  qtyUrunKodu = kod;
  $("#qty-title").textContent = urun.ad;
  $("#qty-price").textContent = `${kod} · ${formatTL(urun.fiyat)}`;
  $("#qty-input").value = "1";
  openModal("#modal-qty");
}

function sepeteEkle(kod, adet) {
  const urun = MENU[kod];
  if (!urun) {
    toast("Geçersiz ürün kodu!", "err");
    return false;
  }
  if (!Number.isInteger(adet) || adet <= 0) {
    toast("Adet pozitif tam sayı olmalıdır!", "err");
    return false;
  }

  const mevcut = sepet.find((k) => k.kod === kod);
  if (mevcut) {
    mevcut.adet += adet;
  } else {
    sepet.push({ kod, ad: urun.ad, fiyat: urun.fiyat, adet });
  }

  renderCart();
  toast(`${adet} adet ${urun.ad} sepete eklendi.`);
  return true;
}

function sepettenSil(kod) {
  const once = sepet.length;
  sepet = sepet.filter((k) => k.kod !== kod);
  if (sepet.length === once) {
    toast("Bu ürün sepette bulunamadı!", "err");
    return;
  }
  renderCart();
  toast("Ürün sepetten silindi.");
}

function sepetiTemizle() {
  if (sepet.length === 0) {
    toast("Sepet zaten boş.", "err");
    return;
  }
  sepet = [];
  renderCart();
  toast("Sepet temizlendi.");
}

function siparisiOnayla() {
  if (sepet.length === 0) {
    toast("Boş sepet onaylanamaz!", "err");
    return;
  }
  if (!masaGecerliMi(aktifMasa)) {
    toast("Geçersiz masa numarası!", "err");
    return;
  }

  const adisyon = masalar[aktifMasa];
  sepet.forEach((sepetKalem) => {
    const mevcut = adisyon.find((a) => a.kod === sepetKalem.kod);
    if (mevcut) {
      mevcut.adet += sepetKalem.adet;
    } else {
      adisyon.push({
        kod: sepetKalem.kod,
        ad: sepetKalem.ad,
        fiyat: sepetKalem.fiyat,
        adet: sepetKalem.adet,
      });
    }
  });

  sepet = [];
  renderCart();
  renderAdisyonStrip();
  toast(`Sipariş onaylandı! Masa ${aktifMasa} adisyonuna eklendi.`);
}

function enterCustomer(masaNo) {
  if (!masaGecerliMi(masaNo)) {
    toast("Masa numarası 1-5 arasında olmalıdır!", "err");
    return;
  }
  aktifMasa = masaNo;
  sepet = [];
  $("#customer-masa-no").textContent = String(masaNo);
  renderMenu();
  renderCart();
  renderAdisyonStrip();
  $("#cart-panel").classList.remove("is-collapsed");
  showScreen("screen-customer");
}

function leaveCustomer() {
  sepet = [];
  aktifMasa = null;
  toast("Ana menüye dönüldü. Onaylanmamış sepet iptal edildi.");
  showScreen("screen-landing");
}

function selectCashierTable(masaNo) {
  seciliKasaMasa = masaNo;
  renderCashierTables();
  renderBill();
}

function openPayModal() {
  if (!seciliKasaMasa) {
    toast("Önce bir masa seçin.", "err");
    return;
  }
  if (masalar[seciliKasaMasa].length === 0) {
    toast(`Masa ${seciliKasaMasa} zaten BOŞ. Hesap kapatılamaz!`, "err");
    return;
  }
  const toplam = adisyonToplami(masalar[seciliKasaMasa]);
  $("#pay-lead").textContent = `Masa ${seciliKasaMasa} adisyonunu kapatmak üzeresiniz.`;
  $("#pay-total").textContent = formatTL(toplam);
  openModal("#modal-pay");
}

function hesabiKapatOnay() {
  if (!seciliKasaMasa || masalar[seciliKasaMasa].length === 0) {
    closeModals();
    return;
  }
  const no = seciliKasaMasa;
  masalar[no] = [];
  closeModals();
  renderCashierTables();
  renderBill();
  toast(`Ödeme alındı. Masa ${no} artık BOŞ.`);
}

function bindEvents() {
  $("#btn-musteri").addEventListener("click", () => {
    renderCustomerTables();
    showScreen("screen-tables");
  });

  $("#btn-kasa").addEventListener("click", () => {
    seciliKasaMasa = null;
    renderCashierTables();
    renderBill();
    showScreen("screen-cashier");
  });

  $$("[data-back='landing']").forEach((btn) => {
    btn.addEventListener("click", () => {
      sepet = [];
      aktifMasa = null;
      seciliKasaMasa = null;
      showScreen("screen-landing");
    });
  });

  $("#btn-customer-back").addEventListener("click", leaveCustomer);

  $("#btn-toggle-cart").addEventListener("click", () => {
    $("#cart-panel").classList.toggle("is-collapsed");
  });

  $("#btn-confirm-order").addEventListener("click", siparisiOnayla);
  $("#btn-clear-cart").addEventListener("click", sepetiTemizle);
  $("#btn-close-bill").addEventListener("click", openPayModal);
  $("#btn-pay-confirm").addEventListener("click", hesabiKapatOnay);

  $$("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModals);
  });

  $("#qty-minus").addEventListener("click", () => {
    const input = $("#qty-input");
    const v = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    input.value = String(v);
  });

  $("#qty-plus").addEventListener("click", () => {
    const input = $("#qty-input");
    const v = Math.max(1, (parseInt(input.value, 10) || 1) + 1);
    input.value = String(v);
  });

  $("#btn-qty-add").addEventListener("click", () => {
    const raw = $("#qty-input").value.trim();
    const adet = Number(raw);
    if (!/^\d+$/.test(raw) || adet <= 0) {
      toast("Adet pozitif tam sayı olmalıdır!", "err");
      return;
    }
    if (sepeteEkle(qtyUrunKodu, adet)) {
      closeModals();
      if (window.matchMedia("(max-width: 980px)").matches) {
        $("#cart-panel").classList.remove("is-collapsed");
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });
}

bindEvents();
showScreen("screen-landing");
