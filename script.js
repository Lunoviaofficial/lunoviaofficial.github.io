const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");
    toggleBtn.textContent = "☀";
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
    toggleBtn.textContent = "☾";
  }
});

