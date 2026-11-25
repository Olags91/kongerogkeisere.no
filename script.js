/* ============================================================
   REDIGER INNHOLDET HER – resten av siden bygges automatisk.
   Datoer skrives som "ÅÅÅÅ-MM-DD".
   ============================================================ */
const SITE = {
  members: [
    { name: "Navn Navnesen", role: "Vokal / gitar" },
    { name: "Navn Navnesen", role: "Gitar" },
    { name: "Navn Navnesen", role: "Bass" },
    { name: "Navn Navnesen", role: "Trommer" }
  ],

  // Kommende konserter (tom liste = "Ingen datoer annonsert")
  upcoming: [
    // { date: "2027-02-12", venue: "Rockefeller", city: "Oslo", ticket: "https://billett.example" }
  ],

  // Tidligere konserter – legg til nye øverst eller nederst, sorteres automatisk
  past: [
    { date: "2025-08-16", venue: "Eksempel Festival", city: "Bergen" },
    { date: "2025-03-08", venue: "Eksempel Klubb", city: "Oslo" },
    { date: "2024-11-02", venue: "Eksempel Scene", city: "Trondheim" },
    { date: "2023-06-24", venue: "Eksempel Sommerfest", city: "Kristiansand" },
    { date: "2019-05-17", venue: "Eksempel Pub", city: "Stavanger" },
    { date: "2015-09-12", venue: "Første konsert", city: "Hjemby" }
  ],

  streaming: [
    { name: "Spotify", url: "https://open.spotify.com/artist/DIN_ID" },
    { name: "Apple Music", url: "https://music.apple.com/" },
    { name: "YouTube Music", url: "https://music.youtube.com/" },
    { name: "Tidal", url: "https://tidal.com/" },
    { name: "Bandcamp", url: "https://dittband.bandcamp.com" }
  ],

  socials: [
    { name: "Instagram", url: "https://instagram.com/dittband" },
    { name: "Facebook", url: "https://facebook.com/dittband" },
    { name: "YouTube", url: "https://youtube.com/@dittband" },
    { name: "TikTok", url: "https://tiktok.com/@dittband" }
  ],

  // Video: bruk YouTube-ID (det som står etter v= i lenken). Tom id = plassholder.
  videos: [
    { title: "Live – Eksempel Festival", id: "" },
    { title: "Musikkvideo", id: "" },
    { title: "Bak kulissene", id: "" }
  ],

  // Bilder: legg filer i mappa /bilder og skriv stien, f.eks. "bilder/live1.jpg"
  gallery: [
    { src: "", alt: "Live på scenen" },
    { src: "", alt: "Øvingslokalet" },
    { src: "", alt: "Backstage" },
    { src: "", alt: "Publikum" },
    { src: "", alt: "Bandbilde" },
    { src: "", alt: "Turné" }
  ],

  // Shop: "url" peker på betalingslenke (Stripe Payment Link, Vipps eller Shopify Buy Button)
  products: [
    { name: "T-skjorte", price: "300 kr", img: "", url: "#" },
    { name: "Hettegenser", price: "600 kr", img: "", url: "#" },
    { name: "Vinyl (LP)", price: "250 kr", img: "", url: "#" },
    { name: "Klistremerker", price: "50 kr", img: "", url: "#" }
  ]
};

/* ============================================================ */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const fmt = d => new Date(d + "T12:00:00").toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });

$("year").textContent = new Date().getFullYear();

$("members").innerHTML = SITE.members.map(m => `<li>${esc(m.name)} <span>${esc(m.role)}</span></li>`).join("");

const linkHTML = l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>`;
$("streaming").innerHTML = SITE.streaming.map(linkHTML).join("");
$("socials").innerHTML = SITE.socials.map(linkHTML).join("");

// Konserter
const up = [...SITE.upcoming].sort((a, b) => a.date.localeCompare(b.date));
$("upcoming").innerHTML = up.length
  ? up.map(c => `<div class="row"><span class="date">${fmt(c.date)}</span>
      <div><strong>${esc(c.venue)}</strong><div class="where">${esc(c.city)}</div></div>
      ${c.ticket ? `<a class="btn" href="${esc(c.ticket)}" target="_blank" rel="noopener">Billetter</a>` : ""}</div>`).join("")
  : `<p class="empty">Ingen datoer annonsert akkurat nå – følg oss i sosiale medier.</p>`;

const byYear = {};
[...SITE.past].sort((a, b) => b.date.localeCompare(a.date)).forEach(c => {
  (byYear[c.date.slice(0, 4)] ||= []).push(c);
});
const years = Object.keys(byYear).sort((a, b) => b - a);
$("past").innerHTML = years.map((y, i) => `
  <details ${i === 0 ? "open" : ""}><summary>${y} <small class="where">(${byYear[y].length})</small></summary>
  ${byYear[y].map(c => `<div class="row"><span class="date">${fmt(c.date)}</span>
     <div><strong>${esc(c.venue)}</strong></div><span class="where">${esc(c.city)}</span></div>`).join("")}
  </details>`).join("");

// Video
$("videos").innerHTML = SITE.videos.map(v => `<div class="video">${v.id
  ? `<iframe src="https://www.youtube-nocookie.com/embed/${esc(v.id)}" title="${esc(v.title)}" loading="lazy" allowfullscreen></iframe>`
  : `<div class="placeholder">${esc(v.title)}</div>`}</div>`).join("");

// Galleri
$("gallery").innerHTML = SITE.gallery.map(g => `<figure data-src="${esc(g.src)}">${g.src
  ? `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">` : esc(g.alt)}</figure>`).join("");
const lb = $("lightbox");
$("gallery").addEventListener("click", e => {
  const f = e.target.closest("figure");
  if (f && f.dataset.src) { lb.querySelector("img").src = f.dataset.src; lb.hidden = false; }
});
lb.addEventListener("click", () => (lb.hidden = true));
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.hidden = true; });

// Shop
$("products").innerHTML = SITE.products.map(p => `<div class="product">
  <div class="img">${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">` : "Produktbilde"}</div>
  <div class="body"><h4>${esc(p.name)}</h4><span class="price">${esc(p.price)}</span>
  <a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">Kjøp</a></div></div>`).join("");

// Mobilmeny
const toggle = document.querySelector(".nav-toggle"), nav = $("nav");
toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", nav.classList.toggle("open")));
nav.addEventListener("click", () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
