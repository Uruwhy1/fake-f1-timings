const container = document.getElementById("timing-container");
const raceDisplay = document.getElementById("race");
let drivers = [];
let currentFont = "Formula1";

function changeCurrentFont() {
  currentFont == "Formula1"
    ? (currentFont = "Geist Mono")
    : (currentFont = "Formula1");

  container.style.setProperty("--driver-font", currentFont);
}

function addDriver() {
  const name = document.getElementById("driver").value.trim();
  const time = document.getElementById("time").value.trim();
  const color = document.getElementById("color").value.trim();
  if (!name || !time || !color) return;

  drivers.push({ name, time, color });
  drivers.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  renderTimings();

  document.getElementById("driver").value = "";
  document.getElementById("time").value = "";
}

function parseTime(time) {
  const parts = time.split(":");
  if (parts.length !== 2) return Infinity;
  const [min, sec] = parts;
  const [s, ms] = sec.split(".");
  return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt(ms || 0);
}

function renderTimings() {
  container.innerHTML = "";
  drivers.forEach((driver, i) => {
    // wohoooo1!! vanilla js for dom manipulation!!! so fun!!!!!
    const row = document.createElement("div");
    row.classList.add("driver-row");
    row.style.setProperty("--color", driver.color);

    const leftContainer = document.createElement("div");
    leftContainer.classList.add("leftWrapper");
    const position = document.createElement("p");
    position.classList.add("position");
    position.textContent = i + 1;
    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = driver.name.toUpperCase().slice(0, 3);

    leftContainer.appendChild(position);
    leftContainer.appendChild(name);

    const rightContainer = document.createElement("div");
    rightContainer.classList.add("time");
    rightContainer.textContent = driver.time;

    row.appendChild(leftContainer);
    row.appendChild(rightContainer);

    container.appendChild(row);
  });
}

function updateRaceName() {
  const raceName = document.getElementById("race-name").value.trim();
  if (raceName) {
    raceDisplay.textContent = raceName;
    document.getElementById("race-name").value = "";
  }
}
