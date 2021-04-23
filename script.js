const BASE_URL = "https://opentdb.com/api.php?amount=11";
const TOTAL_CATEGORIES_URL = "https://opentdb.com/api_category.php";
let index = 0;
let score = 0;

// récupèrer les données de l'API
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// récupérer la data des categories de API
async function fetchCategoriesFromAPI() {
    const data = await fetchData(TOTAL_CATEGORIES_URL);
    return data.trivia_categories;
}

// récupère les questions de l'API et renvoie un objet contenant les questions et les réponses.
async function fetchQuestionsFromAPI(url) {
    const data = await fetchData(url);
    if (data.response_code === 0) {
        const questions = data.results;
        const list = [];
        questions.forEach(element => {
            const question = {
                question: decodeChars(element.question),
                answers: shuffle(element.incorrect_answers.concat(element.correct_answer)), // il faudra décoder les caractères plus tard
                correct: decodeChars(element.correct_answer)
            }
            list.push(question);
        });
        return list;
    }
    return false;
}

// Algorithme de brassage des tableaux de Fisher-Yates
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array;
}

// décode les caractères spéciaux HTML
function decodeChars(specialCharacterString) {
    const text = document.createElement('textarea');
    text.innerHTML = specialCharacterString;
    return text.value;
}

// définit le titre de la balise h1
function setTitle(string) {
    const title = document.getElementById('title');
    title.innerText = string;
}

// supprime les boutons de la balise div
function removeButtons() {
    const div = document.getElementById('buttons');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// mettre le numéro de la question en bas du quizz
function setQuestionNumber() {
    let questionNumber = index + 1;
    const h1Element = document.getElementById('question-number');
    h1Element.classList.add('number');
    h1Element.innerText = questionNumber + '/10';
}

// mettre le bouton à chaque question
function setQuestionButtons(list, answers, correct) {
    const div = document.getElementById('buttons');
    setQuestionNumber();
    answers.forEach(element => {
        const button = document.createElement('button');
        const text = document.createTextNode(decodeChars(element)); // décocade des caractères spéciaux
        button.appendChild(text);
        button.classList.add('btn');
        div.appendChild(button);
        button.addEventListener('click', () => questionButtonEventHandler(button, correct, list));
    });
}

// lancement de l'événement lors de l'activation du bouton
function questionButtonEventHandler(button, correctAnswer, list) {
    const pressedButton = button.innerText;
    if (pressedButton === correctAnswer) {
        score++;
        alert('Correct!');
    } else {
        alert('Wrong.\nCorrect Answer: ' + correctAnswer);
    }
    index++;
    removeButtons();
    startQuiz(list);
}

// enlever le numéro de la question en bas
function removeQuestionNumber() {
    const h1Element = document.getElementById('question-number');
    h1Element.classList.remove('number');
    h1Element.innerText = '';
}

// integration API giphy
const api = 'https://api.giphy.com/v1/gifs/search?';
const apiKey = '&api_key=dc6zaTOxFJmzC';

document.getElementById("gif").hidden = true;

// affichage du bouton restart à la fin du quizz
function showRestartButton() {
    removeQuestionNumber();
    const div = document.getElementById('buttons');
    const button = document.createElement('button');
    const text = document.createTextNode('Restart');
    button.classList.add('btn');
    button.appendChild(text);
    div.appendChild(button);
    button.addEventListener('click', () => document.location.reload(true));
    // affichage du gif
    if(score >= 5){
        var query = '&q=victory';
    }else{
        var query = '&q=defeat';
    }
    let url = api + apiKey + query;
    fetch(url)
    .then((resonse) => resonse.json())
    .then((response) => {
        const gif = response.data[0]
        const url = gif.images.original.url
        let gifhtml = document.getElementById("gif");
        gifhtml.src = url
      });
    document.getElementById("gif").hidden = false;
}

// Charger une question à la fois sur le quizz
function startQuiz(questionList) {
    const numberOfQuestions = questionList.length - 1;
    if (index === numberOfQuestions) {
        setTitle('Your score was ' + score + '/10');
        showRestartButton();
        return;
    }
    setTitle(questionList[index].question);
    setQuestionButtons(questionList, questionList[index].answers, questionList[index].correct);
}

// Créer un bouton pour chaque catégories de l'API
async function setCategoryButtons() {
    const categories = await fetchCategoriesFromAPI();
    const buttonList = document.getElementById('buttons');

    for (const category of categories) {
        const button = document.createElement('button');
        const text = document.createTextNode(category.name);
        button.setAttribute('id', category.id);
        button.classList.add('btn');
        button.appendChild(text);
        buttonList.appendChild(button);
        button.addEventListener('click', () => categoryButtonEventHandler(button));
    }
}

// Evénement au moment du clic sur un bouton
async function categoryButtonEventHandler(button) {
    const url = BASE_URL + '&category=' + button.id;
    const list = await fetchQuestionsFromAPI(url);
    if (list === false) {
        alert('Could not load quiz. Try again later.');
        return;
    }
    removeButtons();
    startQuiz(list);
}

function main() {
    setTitle('Quiz Categories');
    setCategoryButtons();
}

main();

//Jokes Generator
const button = document.querySelector(".container button");
const jokeDiv = document.querySelector(".container .joke p");

document.addEventListener("DOMContentLoaded", getJock);

button.addEventListener("click", getJock);

async function getJock() {
  const jokeData = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json"
    }
  });
  const jokeObj = await jokeData.json();
  jokeDiv.innerHTML = jokeObj.joke;
  console.log(jokeData);
}
// *********************
// This Code is for only the floating card in right bottom corner
// **********************

const touchButton = document.querySelector(".float-text");
const card = document.querySelector(".float-card-info");
const close = document.querySelector(".gg-close-r");

touchButton.addEventListener("click", moveCard);
close.addEventListener("click", moveCard);

function moveCard() {
  card.classList.toggle("active");
}
