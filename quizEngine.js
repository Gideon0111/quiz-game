import { questionsByCategory } from "./questions.js";
import { state, updateState, resetState } from "./stateManager.js";
import { renderQuestion, showResults } from "./ui.js";
import { showScreen } from "./screen.js";

export function startQuiz () {
  const filtered = questionsByCategory[state.selectedCategory] || [];
  updateState("activeQuestions", filtered);
  updateState("currentQuestionIndex", 0);
  updateState("score", 0);
  updateState("selectedAnswer", null);
  renderCurrentQuestion();
}

function renderCurrentQuestion() {

  const savedAnswer = state.answers[state.currentQuestionIndex] || null;
  updateState("selectedAnswer", savedAnswer);
  
  const currentQuestion = state.activeQuestions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.activeQuestions.length - 1;

  renderQuestion(currentQuestion, handleChoiceSelection, isLastQuestion, savedAnswer, state.currentQuestionIndex > 0, handleBack);
}

export function handleBack() {
  if (state.currentQuestionIndex === 0) return;
  updateState("currentQuestionIndex", state.currentQuestionIndex - 1);
  renderCurrentQuestion();
}

function handleChoiceSelection(choice) {
  updateState("selectedAnswer", choice);

  const updatedAnswers = [...state.answers];
  updatedAnswers[state.currentQuestionIndex] = choice;
  updateState("answers", updatedAnswers);

  renderCurrentQuestion();
}
// CHECK HERE FOR SCORE LOGIC 
export function handleNext() {
  if (!state.selectedAnswer) return; // Guard: must have selected something
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

showResults(finalScore, state.activeQuestions.length, handlePlayAgain);
  }

function handlePlayAgain() {
  resetState();
  showScreen("start");
}