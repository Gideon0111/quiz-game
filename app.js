import { showScreen } from "./screen.js";
import { startQuiz, handleNext, handleSubmit } from "./quizEngine.js";
import { updateState, resetState } from "./stateManager.js";
import { showConfirmationPopup } from "./ui.js";

//START SCREEN - SELECT CATEGORY SCREEN
const startBtn = document.getElementById("btn-start");
startBtn.addEventListener("click", () => {
  showScreen("category");
});

const categoryButtons = document.querySelectorAll(
  "#category-screen [data-category]"
);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetState(); // Clear any previous quiz state
    updateState("selectedCategory", button.dataset.category);

    document.getElementById("js-course-title").textContent =
      button.textContent.trim();
    showScreen("quiz");
    startQuiz(); 
  });
});

document.getElementById("next-btn").addEventListener("click", handleNext);

document.getElementById("submit-btn").addEventListener("click", () => {
  showConfirmationPopup(handleSubmit);
});