// CONSTANT VARIABLES - STORES DATA 
export const state = {
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswer: null,
  quizFinished: false,
  selectedCategory: null,
  activeQuestions: [],
  answers: []
};

//1. READ STATE
export function getState() {
  return state;
}
//2.UPDATE
export function updateState(key, value) {
  state[key] = value;
}

//3. RESET 
export function resetState() {
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.selectedAnswer = null;
  state.quizFinished = false;
  state.activeQuestions = [];  
  state.selectedCategory = null; 
  state.answers = [];
}

