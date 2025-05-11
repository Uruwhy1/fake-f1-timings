const container = document.getElementById("timing-container");
const raceDisplay = document.getElementById("race");
const colorPicker = document.getElementById("colorPicker");

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

  clearAll();
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
    row.addEventListener("mouseup", () => removeRow(row, driver));

    if (driver.color == "white") {
      row.style.setProperty("--name-background", "#000");
      row.style.setProperty("--position-color", "#000");
    } else {
      row.style.setProperty("--name-background", "#fff");
      row.style.setProperty("--position-color", "#fff");
    }

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

function removeRow(htmlElement, driver) {
  htmlElement.remove();
  drivers = drivers.filter((d) => d.name !== driver.name);
}

function updateBackgroundColor() {
  const selectedColor = colorPicker.value;
  document.body.style.backgroundColor = selectedColor;
  colorCode.textContent = selectedColor.toUpperCase();
}

colorPicker.addEventListener("input", updateBackgroundColor);

function clearAll() {
  document.getElementById("driver").value = "";
  document.getElementById("time").value = "";
  document.getElementById("color").value = "";
  document.getElementById("bulk-import").value = "";
}

function importDrivers() {
  let string = document.getElementById("bulk-import").value;
  let driversImport = parseBulkImport(string);

  driversImport.forEach((d) => drivers.push(d));

  drivers.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  renderTimings();
}

function parseBulkImport(importString) {
  if (!importString || importString.trim() === "") return [];

  const entries = importString.split("|");
  const parsedDrivers = [];

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const parts = entry.split("-");

    if (parts.length < 3) {
      console.error(`Invalid format in entry: ${entry}`);
      continue;
    }

    const name = parts[0].trim();

    const color = parts[parts.length - 1].trim();

    let time;
    if (parts.length === 3) {
      time = parts[1].trim();
      if (!time.includes(":")) {
        if (time.includes(".")) {
          time = `0:${time}`;
        } else {
          time = `${time}:000`;
        }
      }
    }

    parsedDrivers.push({
      name,
      time,
      color,
    });
  }

  return parsedDrivers;
}

function generateAIPrompt() {
  const promptText = `Convert these racing timings to bulk import format. Use exactly this structure:
DriverName-LapTime-Color separated by pipes. If the drivers have weird characters, replace them with normal ones.

Example conversions:
Input: "VER 1:23.456 (Red)"
Output: "VER-1:23.456-red"

Input: "Hamilton, 1:24.567, #000000"
Output: "Hamilton-1:24.567-black"

Input format: [Your current format description here]
Output format: driver-time-color (time format MM:SS.mmm, color names or hex)`;

  navigator.clipboard
    .writeText(promptText)
    .then(() =>
      alert(
        "AI prompt copied to clipboard! 📋\nPaste this into your AI assistant."
      )
    )
    .catch((err) => console.error("Copy failed:", err));
}
