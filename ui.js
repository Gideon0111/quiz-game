const questionElement = document.querySelector('#js-question');
const choicesElement = document.querySelector('#js-choices');
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const backBtn = document.getElementById("back-btn");
const questionCounterElement = document.querySelector('#question-counter'); 
const progressFillElement = document.querySelector('#progress-fill'); 

//ANNOUNCE QUESTION AND RESULT 
questionElement.setAttribute("aria-live", "polite");
questionElement.setAttribute("aria-atomic", "true");

choicesElement.setAttribute("role", "radiogroup");
choicesElement.setAttribute("aria-label", "Answer choices");

let currentBackHandler = null; 
let currentChoiceHandler = null; 
let _transitionDirection = "init"; // "init" | "forward" | "back"

export function setTransitionDirection(direction) {
  _transitionDirection = direction;
}

export function triggerShake(element) {
  if (!element) return;
  element.classList.remove("shake");
  void element.offsetWidth; 
  element.classList.add("shake");
  element.addEventListener("animationend", () => {
    element.classList.remove("shake");
  }, { once: true });
}

export function enableNavigationButton(isLastQuestion) {
  if (isLastQuestion) {
    submitBtn.disabled = false;
    submitBtn.classList.remove("btn--disabled");
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove("btn--disabled");
  }
}

//REMOVING E.LISTENER FROM EVERY CHOICE BUTTON
choicesElement.addEventListener('click', (event) => {
  const button = event.target.closest('.choice-item');
  if (!button) return; // defensive guard

  document.querySelectorAll('.choice-item').forEach((btn) => {
    btn.classList.remove('selected', 'pulse');
    btn.setAttribute('aria-checked', 'false'); 
  });
  button.classList.add('selected');
  button.setAttribute('aria-checked', 'true'); 

  // Pulse only on real user click, not on state-restored selections
  void button.offsetWidth;
  button.classList.add('pulse');
  button.addEventListener('animationend', () => {
    button.classList.remove('pulse');
  }, { once: true });

  const choice = button.dataset.choice; // NEW — read the choice off the DOM instead of a closure
  if (currentChoiceHandler) currentChoiceHandler(choice);
  });

export function showLoading() {
  questionElement.classList.remove("question--forward", "question--back", "question--init", "results-reveal");
  questionElement.textContent = '';

  choicesElement.innerHTML = '<div class="spinner" role="status" aria-label="Loading questions"></div>';
  nextBtn.classList.add("hidden");
  submitBtn.classList.add("hidden");
  backBtn.classList.add("hidden");

  if (questionCounterElement) questionCounterElement.textContent = '';
  if (progressFillElement) progressFillElement.style.width = '0%';
  currentChoiceHandler = null;
} 

// Shown when the fetch fails for any reason.
export function showError(message, onRetry) {
  questionElement.classList.remove("question--forward", "question--back", "question--init", "results-reveal");
  questionElement.textContent = message || "Something went wrong. Please try again.";
  choicesElement.innerHTML = '';
  nextBtn.classList.add("hidden");
  submitBtn.classList.add("hidden");
  backBtn.classList.add("hidden");
  currentChoiceHandler = null;

  if (typeof onRetry === "function") {
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Try Again";
    retryBtn.classList.add("btn", "btn--primary");
    retryBtn.setAttribute("aria-label", "Retry loading questions");
    retryBtn.addEventListener("click", onRetry, { once: true }); 
    choicesElement.appendChild(retryBtn);
  }
}

export function renderQuestion(question, handleChoiceSelection, isLastQuestion,selectedAnswer, showBackButton, handleBackCallback, currentQuestionNumber, totalQuestions) {
  // Guard — if renderQuestion is somehow called with bad data, fail loudly
  // in development but gracefully in production rather than crashing silently
  if (!question || !question.choices) {
  showError("This question could not be displayed.");
  return;
  }
  // NEW — animate question text entrance based on current direction
  questionElement.classList.remove("question--forward", "question--back", "question--init", "results-reveal");
  void questionElement.offsetWidth; 
  questionElement.classList.add(`question--${_transitionDirection}`);
  questionElement.textContent = question.question;
  choicesElement.innerHTML = '';

  // Drive the progress indicator from real data
  if (questionCounterElement && totalQuestions) {
    questionCounterElement.textContent = `Question ${currentQuestionNumber} of ${totalQuestions}`;
  }
  if (progressFillElement && totalQuestions) {
    const percent = Math.round((currentQuestionNumber / totalQuestions) * 100);
    progressFillElement.style.width = `${percent}%`;
  }

  // BACK BUTTON
  backBtn.classList.toggle("hidden", !showBackButton);

  if (currentBackHandler) {
    backBtn.removeEventListener('click', currentBackHandler);
    currentBackHandler = null;
  }
  if (showBackButton && handleBackCallback) {
    currentBackHandler = handleBackCallback;
    backBtn.addEventListener('click', currentBackHandler);
  }
  currentChoiceHandler = handleChoiceSelection;

  //CHECKS IF THE USER ALREADY PICKED AN ANSWER
  const hasSelection = selectedAnswer !=null; 

  if (isLastQuestion) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
    submitBtn.disabled = !hasSelection;
    submitBtn.classList.toggle("btn--disabled", !hasSelection);
  } else {
    submitBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    nextBtn.disabled = !hasSelection;
    nextBtn.classList.toggle("btn--disabled", !hasSelection);
  }
  // HIGHLIGHT THE CHOICE IN THE PREVIOUS QUESTION IF THE BACK BTN FIRES
  question.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.classList.add("choice-item"); 
    button.dataset.choice = choice;
    button.setAttribute("role", "radio");  
    const isSelected = choice === selectedAnswer;
    button.setAttribute("aria-checked", isSelected ? "true" : "false"); 
    if (isSelected) button.classList.add("selected"); 
  
   choicesElement.appendChild(button);
  });
    _transitionDirection = "forward";
}   
 
export function showResults(score, total, onPlayAgain) {
  // A-NEW — results reveal animation
  questionElement.classList.remove("question--forward", "question--back", "question--init");
  void questionElement.offsetWidth;
  questionElement.classList.add("results-reveal");

  questionElement.textContent = `Quiz Complete! You scored: ${score} out of ${total}.`;
  choicesElement.innerHTML = '';
  nextBtn.classList.add("hidden");
  submitBtn.classList.add("hidden");
  backBtn.classList.add("hidden");

  if (questionCounterElement) questionCounterElement.textContent = "Quiz Complete"; 
  if (progressFillElement) progressFillElement.style.width = "100%";               

  if (currentBackHandler) {
    backBtn.removeEventListener('click', currentBackHandler);
    currentBackHandler = null;
  }
currentChoiceHandler = null; 

  if (typeof onPlayAgain === "function") {
    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = "Play Again";
    playAgainBtn.classList.add("btn", "btn--primary", "play-again-btn");
    playAgainBtn.addEventListener('click', onPlayAgain, { once: true });
    choicesElement.appendChild(playAgainBtn);
  }
}

export function showConfirmationPopup(onConfirm) {
  if (document.querySelector(".modal-overlay")) return; // Guard Clause 

  const previouslyFocusedElement = document.activeElement;
  
  const overlay = document.createElement("div"); 
  overlay.classList.add("modal-overlay", "modal-overlay--visible");
  overlay.innerHTML = `
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="result-modal-title" aria-describedby="confirm-modal-message">
    <h2 class="modal-title" id="result-modal-title">Submit your answers?</h2>
    <p class="modal-message" id="confirm-modal-message">
    Are you sure you want to submit? You won't be able to change your answers.
    </p>
    <div class="modal-actions">
      <button id="confirm-no" class="btn btn--primary">Go Back</button>
      <button id="confirm-yes" class="btn btn--primary">Yes, Submit</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const modalCard = overlay.querySelector(".modal-card"); //NEW
  const confirmYes = overlay.querySelector("#confirm-yes");
  const confirmNo = overlay.querySelector("#confirm-no");
  
  const closeModal = () => {
    overlay.remove();
    document.removeEventListener("keydown", handleKeydown);
    if (previouslyFocusedElement) previouslyFocusedElement.focus();
  };

    function handleKeydown(event) {
    if (event.key === "Escape") { closeModal();
      return;
    }
    if (event.key === "Tab") { trapFocus(event, modalCard); }
  }

  document.addEventListener("keydown", handleKeydown);
  confirmNo.focus();

  confirmYes.addEventListener("click", () => { 
      closeModal();
      if (typeof onConfirm ==="function")  onConfirm();
      }, { once: true });

  confirmNo.addEventListener("click", closeModal, { once: true });
}

// PLACING FOCUS ON THE BTNS ON THE POPUP MODAL
function trapFocus(event, container) {
  const focusable = Array.from(
    container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}