const app = document.getElementById("app");

export function showScreen(screenName) {
  app.dataset.state = screenName;
}
