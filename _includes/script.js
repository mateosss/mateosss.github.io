// Liquid sectiono

const themes = {
  {% for theme in site.themes %}
  "{{- theme[0] -}}": {
    {% for color in theme[1] %}
    "{{- color[0] -}}": "{{- color[1] -}}",
    {% endfor %}
  },
  {% endfor %}
}

const serverDefaultTheme = "{{- site.default-theme -}}";
const defaultTheme = localStorage.theme || serverDefaultTheme;

// Raw js sectioon

{% raw %}

// Set startup theme
setThemeCSS(defaultTheme)
window.addEventListener("load", () => setThemeUI(defaultTheme))

function setThemeCSS(name) {
  const root = document.querySelector(":root");
  const theme = themes[name];
  for (let [k, v] of Object.entries(theme)) {
    if (k.startsWith("_")) continue;
    root.style.setProperty(`--c-${k}`, v);
  }
}

function setThemeUI(name) {
  const themeToggle = document.querySelector("#themeToggle");
  themeToggle.innerHTML = `${themes[name]._display_name} Mode`;
}

function setTheme(name) {
  setThemeCSS(name);
  setThemeUI(name);
  localStorage.theme = name;
}

let inDarkMode = defaultTheme == "dark";
function toggleDarkMode() {
  const theme = inDarkMode ? "light" : "dark";
  setTheme(theme);
  inDarkMode = !inDarkMode;
}

{% endraw %}
