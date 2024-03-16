//loading effect
/* eslint-env es6 */
setTimeout(() => {
	document.getElementById("info_loading").classList.add("hide");
}, 3000);

// dom declaration
const startButton = document.getElementById("start");
const levelText = document.getElementById("level");
const info = document.getElementById("info_overlay");
const infoButton = document.getElementById("info_button");
const scoreText = document.getElementById("score");

// arrayMain for referencing the random set of color
// arrayInGame for set of colors in every level always clear every level
const arrayBox = ["pad-green", "pad-yellow", "pad-red", "pad-blue"];
const arrayMain = [];
const arrayInGame = [];
let highestScore = 0;
let currentScore = 0;

// set the function to reset game and restart
function resetGame() {
	
	arrayMain.length = arrayInGame.length = currentScore = 0;
	levelText.innerText = "Level " + 1;
	startButton.innerText = "Start";
	disableBoxButton(true, true);
	disbleStartButton(false);
}

//disble a button box logic or UI style
function disableBoxButton(isDisable, isDisabledUI) {
	for (const element of document.getElementsByClassName("box")) {
		element.disabled = isDisable;

		if (isDisabledUI) element.classList.add("disable");
		else element.classList.remove("disable");
	}
}
// funciton to disable start button once pressed
function disbleStartButton(enabler) {
	startButton.disabled = enabler;

	if (enabler) startButton.classList.add("disable");
	else startButton.classList.remove("disable");
}

// add glow effect
function activeBox(boxID) {
	const box = document.getElementById(boxID);
	startButton.classList.add("hide");
	box.classList.add("pad-press");
	playSound("sound-1");

	setTimeout(() => {
		box.classList.remove("pad-press");
	}, 400);
	
}
// 
function addColorRandom() {
	arrayMain.push(arrayBox[Math.round(Math.random() * 3)]);
	console.log(arrayMain);
}

function playColorSet() {
	startButton.innerText = "Wait";
	addColorRandom();

	//use for playing the next color set
	let index = 0;
	const glowEach = setInterval(() => {
		activeBox(arrayMain[index++]);

		if (index === arrayMain.length) {
			startButton.innerText = "Guess";
			disableBoxButton(false, false);
			clearInterval(glowEach);
		}
	}, 600);
}

function checkColorSet() {
	//lose
	if (!isArrayStartsWith(arrayMain, arrayInGame)) loseLevel();
	//win
	else if (arrayInGame.length === arrayMain.length && arrayInGame.length !== 0) winLevel();
}

function loseLevel() {
	playSound("lose");
	startButton.classList.add("hide");
	
	showLostInfo(true);
	resetGame();
	
}

//reset ingame array and add one color randomly
function winLevel() {
	arrayInGame.length = 0;
	levelText.innerText = `Current: ${(arrayMain.length + 1).toString()}`;

	disableBoxButton(true);
	playSound("win");

	setTimeout(() => {
		disableBoxButton(true, true);
		disbleStartButton(false);
	}, 100000);

	currentScore++;

	if (currentScore > highestScore || highestScore === 0) {
		scoreText.innerText = `highest : ${++highestScore}`;
	}
	playColorSet();
}

//utils
function playSound(soundName) {
	switch (soundName) {
		case "sound-1":
			new Audio("./assets/simon-says-sound-1.mp3").play();
			break;
		case "win":
			new Audio("./assets/simon-says-sound-2.mp3").play();
			break;
		case "lose":
			new Audio("./assets/simon-says-sound-3.mp3").play();
			break;
		case "try":
			new Audio("./assets/simon-says-sound-4.mp3").play();
			break;
		case "start":
			new Audio("./assets/simon-says-sound-4.mp3").play();
			break;
		default:
	}
}

function showLostInfo(enabler) {
	if (enabler) {
		playSound("lose");
		disbleStartButton(true);
		disableBoxButton(true, true);
		info.classList.remove("hide");
		
	} else {
		info.classList.add("hide");
		startButton.classList.remove("hide");
	}
}

function isArrayStartsWith(first, second) {
	const firstArray = [...first];
	const secondArray = [...second];

	for (let index = 0; index < secondArray.length; index++)
		if (firstArray[index] !== secondArray[index]) return false;

	return true;
}

//function clicking all box
for (const item of document.getElementsByClassName("box"))
	item.addEventListener("click", () => {
		const id = item.getAttribute("id");
		arrayInGame.push(id);
		checkColorSet();
		playSound("sound-1");
	});

infoButton.addEventListener("click", () => {
	playSound("try");
	showLostInfo(false);
});

startButton.addEventListener("click", () => {
	disbleStartButton(true);
	disableBoxButton(true, false);
	playColorSet();
	playSound("start");
});

// starting point
resetGame();