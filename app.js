document.addEventListener('DOMContentLoaded', function () {
const playBtn = document.getElementById('start-btn');
const chooseBtn = document.getElementById('category-btn');
const questionArea = document.getElementById('quiz');
const endArea = document.getElementById('result');
const categoryBox = document.getElementById('category-select');
const questionText = document.getElementById('question');
const answerButtons = document.querySelectorAll('.answer-btn');
const playerTurn = document.getElementById('current-player');
const answerMsg = document.getElementById('feedback');

let player = 1; 
let Questions = [];
let questionIndex = 0;
let Category = null;
let player1Score=0
let player2Score=0

function getQuestions(category) {
    fetch(`https://the-trivia-api.com/v2/questions/?limit=6&difficulties=easy,medium,hard&categories=${category}`)
        .then(response=>response.json())
        .then(data=>{
            Questions=data;
            console.log("data",data)
            showQuestion();
        })
        .catch(error => console.error('Oops!:', error));
}

// Function to display the question and answers
function showQuestion() {
    let currentQuestion = Questions[questionIndex];
    console.log("currentQuestion",currentQuestion)
    displayQuestionText(currentQuestion.question.text);
    setupAnswerChoices(currentQuestion);
    updateCurrentPlayer();
}

function displayQuestionText(questionContent) {
    questionText.textContent = questionContent; 
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

function setupAnswerChoices(currentQuestion) {
    // let Question = Questions[questionIndex];
    // questionText.textContent = Question.question.text;

    // copy of answer
    let Choices = currentQuestion.incorrectAnswers.slice();
    Choices.push(currentQuestion.correctAnswer);
    Choices = shuffleArray(Choices);
    answerButtons.forEach((button, index) => {
        button.textContent = Choices[index];
        button.onclick = function () {
            validateAnswer(Choices[index] === currentQuestion.correctAnswer);
        };
    });

}

    function validateAnswer(isCorrect) {
        if (isCorrect) {
            answerMsg.textContent = 'Yay! Right!';
            if (player===1) {
                player1Score++
            }
            else {
                player2Score++
            }
        } else {
            answerMsg.textContent = 'Oops! Wrong!';
        }
        setTimeout(() => {
            answerMsg.textContent = '';
            questionIndex++;
    
            if (questionIndex < Questions.length) {
                showQuestion();
            } else {
                finishGame();
            }
        }, 1000);
    }
    
    // function Answers(arr) {
    //     return arr.sort(() => Math.random() - 0.5);
    // }

    function finishGame() {
        questionArea.style.display = 'none'; 
        endArea.style.display = 'block'; 
        document.getElementById('final-score').textContent = 'Player 1 Score: ' + player1Score + ' | Player 2 Score: ' + player2Score;
    }    

    function hideChosenCategory() {
        if (Category) {
            const option = categoryBox.querySelector(`option[value="${Category}"]`);
            if (option) {
                option.disabled = true;
            }
        }
    }

    function updateCurrentPlayer() {
        playerTurn.textContent =`Current Player: Player ${player}`
        
        player= player==1?2:1
    }

    playBtn.addEventListener('click', function () {
        document.getElementById('setup').style.display = 'none';
        document.getElementById('category').style.display = 'block';
    });

    chooseBtn.addEventListener('click', function () {
        const pickedCategory = categoryBox.value;
        if (!pickedCategory) {
            alert("Please pick a category!");
            return;
        }
        Category = pickedCategory;
        hideChosenCategory();
        document.getElementById('category').style.display = 'none';
        questionArea.style.display = 'block';
        getQuestions(pickedCategory);
    });

    document.getElementById('restart-btn').addEventListener('click', function () {
        questionIndex = 0;
        Category = null;
        player1Score = 0;
        player2Score = 0;
        endArea.style.display = 'none';
        document.getElementById('setup').style.display='block';
    });
});

