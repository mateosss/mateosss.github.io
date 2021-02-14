let inDarkMode = false;
const root = document.documentElement;

function toggleDarkMode(dark) {
  const darkModeToggle = document.querySelector("#darkModeToggle");
  const newbg = inDarkMode ? "white" : "black";
  const newfg = inDarkMode ? "black" : "white";
  const newlabel = inDarkMode ? "Dark" : "Light"
  root.style.setProperty("--c-bg", newbg)
  root.style.setProperty("--c-fg", newfg)
  inDarkMode = !inDarkMode;
  darkModeToggle.innerHTML = `${newlabel} Mode`;
}
