const macros = [
  {
    title: "세이렌 해협 낮/저녁 (화살머리 오징어)",
    type: "squid",
    zone: "normal",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.10>
/e 10초 <se.1> <wait.8>
/e 18초 <se.1> <wait.7>
/e 25초 <se.1>`
  },
  {
    title: "세이렌 해협 낮/저녁 [환해류] (넓적머리 오징어)",
    type: "squid",
    zone: "current",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.3>
/e 3초 <se.1> <wait.1>
/e 4초 <se.1>`
  },
  {
    title: "쿠가네 저녁/밤 (한치오징어)",
    type: "squid",
    zone: "normal",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.13>
/e 13초 <se.1> <wait.11>
/e 24초 <se.1>`
  },
  {
    title: "쿠가네 저녁/밤 [환해류] (칼머리 오징어)",
    type: "squid",
    zone: "current",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.4>
/e 4초 <se.1> <wait.2>
/e 6초 <se.1>`
  },
  {
    title: "홍옥해 밤/낮 (무늬 오징어)",
    type: "squid",
    zone: "normal",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.10>
/e 10초 <se.1> <wait.8>
/e 18초 <se.1> <wait.6>
/e 24초 <se.1>`
  },
  {
    title: "홍옥해 밤/낮 [환해류] (파초 오징어)",
    type: "squid",
    zone: "current",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.3>
/e 3초 <se.1> <wait.1>
/e 4초 <se.1>`
  },
  {
    title: "홍옥해 밤/낮 [환해류] (큰살 오징어)",
    type: "squid",
    zone: "current",
    code: `/micon "낚싯대 던지기"
/시전 "낚싯대 던지기" <wait.5>
/e 5초 <se.1> <wait.3>
/e 8초 <se.1>`
  }
];

const container = document.querySelector(".container");

function escapeHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* 카드 */
function renderCards() {
  container.innerHTML = "";

  macros.forEach(m => {
    const card = document.createElement("div");
    card.className = `card ${m.type} ${m.zone}`;

    card.innerHTML = `
      <h2 class="title">${m.title}</h2>

      <pre class="code">${escapeHTML(m.code)}</pre>

      <div class="tags"></div>

      <button class="copy-btn" data-code="${encodeURIComponent(m.code)}">
        <span class="icon">📋</span>
        <span class="text">Copy</span>
      </button>
    `;

    container.appendChild(card);
  });
}

/* 태그 */
function renderTags() {
  document.querySelectorAll(".card").forEach(card => {
    const tagBox = card.querySelector(".tags");

    if (card.classList.contains("squid"))
      tagBox.innerHTML += `  <span class="tag type"><span class="emoji">🦑</span>오징어</span>`;

    if (card.classList.contains("normal"))
      tagBox.innerHTML += `<span class="tag zone">기본</span>`;

    if (card.classList.contains("current"))
      tagBox.innerHTML += `<span class="tag zone">🌊 환해류</span>`;
  });
}

/* 복사 */
document.addEventListener("click", e => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const text = decodeURIComponent(btn.dataset.code);

  navigator.clipboard.writeText(text).then(() => {
    const icon = btn.querySelector(".icon");
    const label = btn.querySelector(".text");

    icon.textContent = "✔";
    label.textContent = "복사됨";

    setTimeout(() => {
      icon.textContent = "📋";
      label.textContent = "Copy";
    }, 1000);
  });
});

/* 테마 */
const toggleBtn = document.getElementById("toggleTheme");

function updateThemeUI() {
  toggleBtn.innerHTML = document.body.classList.contains("dark")
    ? "🌙 Dark"
    : "☀️ Light";
}

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
  updateThemeUI();
};

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

updateThemeUI();

/* 필터 */
let activeType = localStorage.getItem("type") || "all";
let activeZone = localStorage.getItem("zone") || "all";

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.type !== undefined) {
      activeType = btn.dataset.type;
      localStorage.setItem("type", activeType);
      document.querySelectorAll("[data-type]").forEach(b => b.classList.remove("active"));
    }

    if (btn.dataset.zone !== undefined) {
      activeZone = btn.dataset.zone;
      localStorage.setItem("zone", activeZone);
      document.querySelectorAll("[data-zone]").forEach(b => b.classList.remove("active"));
    }

    btn.classList.add("active");
    applyFilter();
  });
});

function applyFilter() {
  document.querySelectorAll(".card").forEach(card => {
    const typeOk = activeType === "all" || card.classList.contains(activeType);
    const zoneOk = activeZone === "all" || card.classList.contains(activeZone);
    card.classList.toggle("hide", !(typeOk && zoneOk));
  });
}

function restoreFilterUI() {
  document.querySelectorAll("[data-type]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === activeType);
  });

  document.querySelectorAll("[data-zone]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.zone === activeZone);
  });
}

/* 실행 */
renderCards();
renderTags();
restoreFilterUI();
applyFilter();