const STORAGE_KEY = "quizProgress";

export function saveProgress(state) {
  try {
    const progressToSave = {
      selectedCategory: state.selectedCategory,
      currentQuestionIndex: state.currentQuestionIndex,
      answers: state.answers,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
  } catch (error) {
    console.warn("Unable to save quiz progress:", error);
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to load saved quiz progress:", error);
    return null;
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to clear saved quiz progress:", error);
  }
}