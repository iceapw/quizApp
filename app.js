let currentScore = 0;
let currentQuestionIndex = 0;
let selectedAnswer = "";

const h1 = document.querySelector("h1");
const categoryList = document.querySelector("#category");
const quizForm = document.querySelector(".quizForm");
const quizContainer = document.querySelector(".quizContainer");

const submitButton = document.createElement("BUTTON");
submitButton.classList.add("submitButton");
submitButton.innerHTML = "Submit";

const formContainer = document.querySelector(".formContainer");

quizContainer.style.display = "none";



// Get category to add in option
const getCategory = async () => {
    const response = await axios.get("https://opentdb.com/api_category.php");
  
    const quizCategory = response.data.trivia_categories;
    for (let value in quizCategory) {
      const categoryOption = document.createElement("OPTION");
      categoryOption.innerHTML = quizCategory[value].name;
      categoryOption.value = quizCategory[value].id;
      console.log(categoryOption.value);
      categoryList.append(categoryOption);
    }
  };

// handle event when form was submitted
quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    quizForm.style.display = "none";
    formContainer.style.display = "none";
    quizContainer.style.display = "flex";
    getQuiz(
      quizForm.number.value,
      quizForm.category.value,
      quizForm.difficulty.value,
      quizForm.type.value
    );
  });

// when form submitted called this function and fetch data from API
const getQuiz = async (number, category, difficulty, type) => {
  const response = await axios.get(
    `https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=${type}`
  );
  console.log(response);
  quiz = response.data;
  console.log(quiz.results);
  displayQuestion();
};

function displayQuestion() {
  // clear container first and add the next question
  quizContainer.innerHTML = "";

  // Create info container
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("questionInfo");

  const categoryTag = document.createElement("span");
  const difficultyTag = document.createElement("span");

  categoryTag.innerHTML = quiz.results[currentQuestionIndex].category;
  difficultyTag.innerHTML = quiz.results[currentQuestionIndex].difficulty;

  [categoryTag, difficultyTag].forEach((tag) => {
    tag.classList.add("infoTag");
    infoContainer.appendChild(tag);
  });

  quizContainer.append(infoContainer);

  const questionTitle = document.createElement("H1");
  questionTitle.innerHTML = quiz.results[currentQuestionIndex].question;
  quizContainer.append(questionTitle);

  // Mix correct and incorrect answers together then random location in the next step
  const allChoice = [
    ...quiz.results[currentQuestionIndex].incorrect_answers,
    quiz.results[currentQuestionIndex].correct_answer,
  ];

  // Sort array in random position (shuffle the answers order)
  allChoice.sort(() => Math.random() - 0.5);

  for (let choice in allChoice) {
    const answerButton = document.createElement("BUTTON");
    answerButton.classList.add("choiceButton");
    answerButton.innerHTML = allChoice[choice];
    answerButton.value = allChoice[choice];

    answerButton.addEventListener("click", () => {
      selectedAnswer = allChoice[choice];
      console.log("Selected Answer:", selectedAnswer);

      // Remove highlight for every button then add to another one
      const allButton = document.querySelectorAll(".choiceButton");
      allButton.forEach((button) => button.classList.remove("selected"));
      // Add hilight
      answerButton.classList.add("selected");
    });
    quizContainer.append(answerButton);
  }
  quizContainer.append(submitButton);
}

submitButton.addEventListener("click", () => {
  if (!selectedAnswer) {
    alert("Please select your answer");
    return;
  }

  quizContainer.innerHTML = "";

  const resultMessage = document.createElement("div");
  resultMessage.classList.add("resultMessage");

  if (selectedAnswer === quiz.results[currentQuestionIndex].correct_answer) {
    resultMessage.classList.add("correct");
    resultMessage.innerHTML = `Correct! The answer is ${quiz.results[currentQuestionIndex].correct_answer}`;
    currentScore++;
  } else {
    resultMessage.classList.add("incorrect");
    resultMessage.innerHTML = `Incorrect. The correct answer was ${quiz.results[currentQuestionIndex].correct_answer}`;
  }

  quizContainer.appendChild(resultMessage);

  const nextButton = document.createElement("button");
  nextButton.classList.add("submitButton");
  nextButton.innerHTML =
    currentQuestionIndex < quiz.results.length - 1
      ? "Next Question"
      : "Show Results";

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    selectedAnswer = "";
    if (currentQuestionIndex < quiz.results.length) {
      displayQuestion();
    } else {
      showFinalScore();
    }
  });

  quizContainer.appendChild(nextButton);
});

function showFinalScore() {
  quizContainer.innerHTML = "";
  const finalScore = document.createElement("H1");
  finalScore.innerHTML = `Your score is: ${currentScore}/${quiz.results.length}`;

  const resetButton = document.createElement("BUTTON");
  resetButton.classList.add("submitButton");
  resetButton.innerHTML = "Play Again";

  resetButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    currentScore = 0;
    selectedAnswer = "";
    quizForm.style.display = "block";
    quizContainer.style.display = "none";
    formContainer.style.display = "block";
  });

  quizContainer.append(finalScore, resetButton);
}

getCategory();
