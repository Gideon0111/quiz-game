//import { questionsByCategory } from "./questions.js";
import { state, updateState, resetState } from "./stateManager.js";
import { renderQuestion, showResults, showLoading, showError, setTransitionDirection, triggerShake, enableNavigationButton} from "./ui.js";
import { showScreen } from "./screen.js";
import { loadProgress, clearProgress } from "./storage.js"; 
import { fetchQuestions } from "./questionsService.js";

export async function startQuiz() { // CHANGED — now async
  updateState("status", "loading");
  showLoading(); 

  try {
    const questions = await fetchQuestions(state.selectedCategory); // NEW-fetch instead of direct lookup
    updateState("activeQuestions", questions);
    updateState("currentQuestionIndex", 0);
    updateState("score", 0);
    updateState("selectedAnswer", null);
    updateState("status", "success");
    renderCurrentQuestion();
  } catch (error) {
    updateState("status", "error");
    showError(
      "We couldn't load the questions. Please check your connection and try again.",
      () => startQuiz() 
    );
  }
}

export async function resumeQuiz() { // CHANGED — now async
  const saved = loadProgress();
  if (!saved || !saved.selectedCategory) return false;

  try {
    const questions = await fetchQuestions(saved.selectedCategory);
    if (!questions || questions.length === 0) return false;

    updateState("selectedCategory", saved.selectedCategory);
    updateState("activeQuestions", questions);
    updateState("currentQuestionIndex", saved.currentQuestionIndex || 0);
    updateState("answers", saved.answers || []);
    updateState("score", 0);
    updateState("quizFinished", false);
    updateState("status", "success");

    renderCurrentQuestion();
    return true;
  } catch (error) {
    // Resume failed — wipe the stale save and fall back to category screen cleanly.
    // No error UI here because we haven't shown the quiz screen yet.
    console.warn("Could not resume saved quiz:", error);
    clearProgress();
    return false;
  }
}

function renderCurrentQuestion() {
  const savedAnswer = state.answers[state.currentQuestionIndex] || null;
  updateState("selectedAnswer", savedAnswer);
  
  const currentQuestion = state.activeQuestions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.activeQuestions.length - 1;

  renderQuestion(currentQuestion, handleChoiceSelection, isLastQuestion, savedAnswer, state.currentQuestionIndex > 0, handleBack, state.currentQuestionIndex + 1, state.activeQuestions.length);
}

export function handleBack() {
  if (state.currentQuestionIndex === 0) return;
  setTransitionDirection("back");
  updateState("currentQuestionIndex", state.currentQuestionIndex - 1);
  renderCurrentQuestion();
}

function handleChoiceSelection(choice) {
  updateState("selectedAnswer", choice);

  const updatedAnswers = [...state.answers];
  updatedAnswers[state.currentQuestionIndex] = choice;
  updateState("answers", updatedAnswers);
  
  const isLast = state.currentQuestionIndex === state.activeQuestions.length - 1;
  enableNavigationButton(isLast);
}
// SCORE LOGIC 
export function handleNext() {
  if (!state.selectedAnswer) {
    triggerShake(document.getElementById("next-btn")); // NEW — shake instead of silent fail
    return;
  }
  setTransitionDirection("forward");
  updateState("currentQuestionIndex", state.currentQuestionIndex +1);
  renderCurrentQuestion();
}

export function handleSubmit() {
  if (state.quizFinished) return;

  let finalScore = 0; 
  state.activeQuestions.forEach((question, index) => {
    if(state.answers[index] ===question.answer) {
        finalScore++;
      }
    });

    updateState("score", finalScore);
    updateState("quizFinished", true);

    clearProgress(); 

showResults(finalScore, state.activeQuestions.length, handlePlayAgain);
  }

function handlePlayAgain() {
  resetState();
  showScreen("start");
}