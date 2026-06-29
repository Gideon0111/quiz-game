import { questionsByCategory } from "./questions.js";

export async function fetchQuestions(category) {
  // SIMULATED NETWORK DELAY — remove this block when connecting a real API.
  // It exists now so you can actually see and test the loading state locally.
  await new Promise((resolve) => setTimeout(resolve, 500)); 

  const questions = questionsByCategory[category];

  // Treat missing or empty categories as a fetch failure —
  // same behaviour you'd get from a real API returning 404 or an empty array
  if (!questions || questions.length === 0) {
    throw new Error(`No questions found for category: "${category}"`);
  }
  return questions;
}
