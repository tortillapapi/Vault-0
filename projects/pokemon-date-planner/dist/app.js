const screens = {
  invite: document.querySelector("#screen-invite"),
  confirm: document.querySelector("#screen-confirm"),
  date: document.querySelector("#screen-date"),
  food: document.querySelector("#screen-food"),
  activity: document.querySelector("#screen-activity"),
  final: document.querySelector("#screen-final")
};

const state = {
  date: "",
  time: "",
  food: "",
  foodType: "",
  activity: "",
  activityType: "",
  noDodges: 0
};

const noLines = [
  "No ran away!",
  "No used Double Team.",
  "No is hiding in tall grass.",
  "No fainted. YES is super effective.",
  "That button is not emotionally available."
];

const typeMessages = {
  fire: "Fire-type dinner energy. Bold choice.",
  water: "Water-type flow. Very smooth.",
  grass: "Grass-type soft date. Extremely cute.",
  electric: "Electric-type spark detected.",
  fairy: "Fairy-type romance unlocked.",
  dragon: "Dragon-type appetite. Respect.",
  dark: "Dark-type cozy mode activated.",
  flying: "Flying-type memory route selected.",
  psychic: "Psychic-type surprise. I already knew."
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  document.querySelector(".dex-frame").dataset.screen = name;
}

function todayIso() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function moveNoButton() {
  const noBtn = document.querySelector("#noBtn");
  const zone = document.querySelector(".chase-zone");
  const maxX = Math.max(20, zone.clientWidth - noBtn.offsetWidth - 8);
  const maxY = Math.max(12, zone.clientHeight - noBtn.offsetHeight - 6);
  const x = Math.round(Math.random() * maxX);
  const y = Math.round(Math.random() * maxY);
  noBtn.style.transform = `translate(${x - maxX / 2}px, ${y - maxY / 2}px) rotate(${Math.random() * 10 - 5}deg)`;
  state.noDodges += 1;
  document.querySelector("#noMessage").textContent = noLines[state.noDodges % noLines.length];
}

function selectChoice(container, button) {
  container.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("selected", item === button);
    item.setAttribute("aria-selected", item === button ? "true" : "false");
  });
}

function formatDate(isoDate) {
  if (!isoDate) return "the chosen day";
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function inviteText() {
  const date = formatDate(state.date);
  const typeLine = typeMessages[state.foodType] || "Rare date energy detected.";
  return [
    "Date mission unlocked:",
    "",
    `When: ${date} at ${state.time}`,
    `Food: ${state.food}`,
    `Side quest: ${state.activity}`,
    "",
    typeLine,
    "",
    "Glad you didn't say no. Be ready, trainer."
  ].join("\n");
}

function updateFinal() {
  const date = formatDate(state.date);
  const summary = `${date} at ${state.time}. We are getting ${state.food}, then doing ${state.activity}. ${typeMessages[state.activityType] || "Rare encounter confirmed."}`;
  document.querySelector("#finalSummary").textContent = summary;
  const email = document.querySelector("#emailInput").value.trim();
  const subject = "Rare Date Dex mission unlocked";
  const body = inviteText();
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: email,
    su: subject,
    body
  });
  document.querySelector("#gmailLink").href = `https://mail.google.com/mail/?${params.toString()}`;
  window.localStorage.setItem("rareDateDex:lastMission", JSON.stringify({ ...state, summary, updatedAt: new Date().toISOString() }));
}

document.querySelector("#dateInput").min = todayIso();

document.querySelector("#yesBtn").addEventListener("click", () => showScreen("confirm"));
document.querySelector("#noBtn").addEventListener("pointerenter", moveNoButton);
document.querySelector("#noBtn").addEventListener("focus", moveNoButton);
document.querySelector("#noBtn").addEventListener("click", moveNoButton);
document.querySelector("#okayBtn").addEventListener("click", () => showScreen("date"));

document.querySelector("#setDateBtn").addEventListener("click", () => {
  const date = document.querySelector("#dateInput").value;
  const time = document.querySelector("#timeInput").value;
  if (!date || !time) {
    document.querySelector("#setDateBtn").textContent = "pick both first 😭";
    setTimeout(() => {
      document.querySelector("#setDateBtn").textContent = "set the date! ♥";
    }, 1200);
    return;
  }
  state.date = date;
  state.time = time;
  showScreen("food");
});

document.querySelector("#foodChoices").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  selectChoice(event.currentTarget, button);
  state.food = button.dataset.value;
  state.foodType = button.dataset.type;
  document.querySelector("#foodBtn").disabled = false;
});

document.querySelector("#foodBtn").addEventListener("click", () => showScreen("activity"));

document.querySelector("#activityChoices").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  selectChoice(event.currentTarget, button);
  state.activity = button.dataset.value;
  state.activityType = button.dataset.type;
  document.querySelector("#activityBtn").disabled = false;
});

document.querySelector("#activityBtn").addEventListener("click", () => {
  updateFinal();
  showScreen("final");
});

document.querySelector("#emailInput").addEventListener("input", updateFinal);

document.querySelector("#copyBtn").addEventListener("click", async () => {
  const text = inviteText();
  await navigator.clipboard.writeText(text);
  document.querySelector("#copyStatus").textContent = "Copied. The mission briefing is ready.";
});

document.querySelector("#restartBtn").addEventListener("click", () => {
  Object.assign(state, { date: "", time: "", food: "", foodType: "", activity: "", activityType: "", noDodges: 0 });
  document.querySelector("#dateInput").value = "";
  document.querySelector("#timeInput").value = "";
  document.querySelector("#emailInput").value = "";
  document.querySelectorAll(".selected").forEach((item) => item.classList.remove("selected"));
  document.querySelector("#foodBtn").disabled = true;
  document.querySelector("#activityBtn").disabled = true;
  document.querySelector("#copyStatus").textContent = "Normal people text. We made a tiny website.";
  showScreen("invite");
});
