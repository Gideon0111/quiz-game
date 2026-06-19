const app = document.getElementById("app");

export function showScreen(screenName) {
  app.dataset.state = screenName;
}




/*

const screens = {
  start:    document.getElementById("screen-start"),
  category: document.getElementById("category-screen"),
  quiz:     document.getElementById("screen-question"),
};

// Maps screen keys to the data-state values your CSS expects
const stateMap = {
  start:    "start",
  category: "category",
  quiz:     "question",
};

export function showScreen(screenName) {
  Object.values(screens).forEach((screen) => {
    screen.classList.add("hidden");
  });
  screens[screenName].classList.remove("hidden");
  // app.dataset.state = stateMap[screenName]; // ← This was the missing line
}
*/


//MY ORIGINAL SCRIPT FOR THIS FILE//
/*const screens = {
  start: document.getElementById("screen-start"),
  category: document.getElementById("category-screen"),
  quiz: document.getElementById("screen-question"),
};


export function showScreen(screenName) {

  Object.values(screens).forEach(screen => {
    screen.classList.add("hidden");
  });

  screens[screenName].classList.remove("hidden");
}*/

/*
export function showScreen(screenName) {
  const current = getCurrentScreen();
  current.classList.add('screen--exit');

  setTimeout(() => {
    current.classList.add('hidden');
    current.classList.remove('screen--exit');
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('screen--enter');
  }, 300); // matches CSS transition duration
}*/