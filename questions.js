import { scienceQuestions } from "./Data/science.js";
import { technologyQuestions } from "./Data/technology.js";
import { historyQuestions } from "./Data/history.js";


//CATEGORY MAP
export const questionsByCategory = {
  science: scienceQuestions,
  technology: technologyQuestions,
  history: historyQuestions,
};


/*
export const questions = [ 
...scienceQuestions, 
...technologyQuestions, 
...historyQuestions ];
*/ 

/*
// QUESTION REPOSITORY // 
import { javascriptQuestions } from "../data/javascript.js";
import { cssQuestions } from "../data/css.js";
import { htmlQuestions } from "../data/html.js";

const questions = [
  ...javascriptQuestions,
  ...cssQuestions,
  ...htmlQuestions
];

export function getAllQuestions() {
  return [...questions];
}

export function getQuestionsByCategory(category) {
  return questions.filter(
    question => question.category === category
  );
}

//app.js// 
import {
  getAllQuestions,
  getQuestionsByCategory
} from "./repositories/questionRepository.js";
 
*/