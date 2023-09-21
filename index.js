const colorSelector = document.querySelector("#color-select");
const dropDown = document.querySelector("#drop-down");
const button = document.querySelector("#button");
const modal = document.querySelector(".modal");
const colorSchemeEl = document.querySelector("#color-scheme");
const bottomBarEl = document.querySelector("#bottom-bar");
let colorsArr = [];
let coolDown = false;

// INITIAL COLOR FETCH ///////////////////////////////////////////////////////
fetchColors("BED6DA", "monochrome");

// EVENT LISTENER ///////////////////////////////////////////////////////
document.addEventListener("click", (event) => {
  if (event.target === button) {
    event.preventDefault();
    let hex = colorSelector.value.slice(1);
    let option = dropDown.value;
    colorSchemeEl.innerHTML = "";
    bottomBarEl.innerHTML = "";
    colorsArr = [];

    fetchColors(hex, option);
  }

  if (coolDown) {
    return;
  } else if (event.target.id === "code-el") {
    updateModal("HEX");
    navigator.clipboard.writeText(event.target.textContent);
  } else if (event.target.id === "color-el") {
    updateModal("RGB");
    navigator.clipboard.writeText(event.target.style.backgroundColor);
  }

  coolDown = true;
  setTimeout(() => {
    modal.classList.add("hidden");
    coolDown = false;
  }, 2000);
});

// FUNCTIONS ///////////////////////////////////////////////////////
async function fetchColors(hex, option) {
  const response = await fetch(
    `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${option}&count=5`
  );
  const data = await response.json();
  updateColorsArray(data);
  generateHtml();
}

function generateHtml() {
  for (let color of colorsArr) {
    bottomBarEl.innerHTML += `<div id="code-el" class="code">${color}</div>`;
    colorSchemeEl.innerHTML += `<div id="color-el" class="color" style="background-color: ${color}"></div>`;
  }
}

function updateColorsArray(data) {
  for (let color of data.colors) {
    colorsArr.push(color.hex.value);
  }
}

function updateModal(code) {
  modal.classList.remove("hidden");
  modal.textContent = `Copied ${code}!`;
}
