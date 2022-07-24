//html variables
const wrapper = document.querySelector(".wrapper")
const title = document.querySelector('.title')
const introText = document.querySelector('.intro-text')

const settings = document.querySelector('.settings')
const radioBtn8 = document.querySelector('.radio-btn-8')
const radioBtn16 = document.querySelector('.radio-btn-16')
const radioBtn24 = document.querySelector('.radio-btn-24')
const humanStartInput = document.getElementById("human-start")
const startingPlayerInputs = document.getElementsByClassName('starting-player')
const difficultyInputs = document.getElementsByClassName('difficulty-input')
const deckSizeInputs = document.getElementsByClassName('deck-size-input')

const cardsContainer = document.querySelector('.container--cards')
const cardDisplay = document.getElementById("cards")
const winnerScreenHuman = document.querySelector('.winner-screen--human')
const winnerScreenComputer = document.querySelector('.winner-screen--computer')
const winnerScreenTie = document.querySelector('.winner-screen--tie')
const humanFinalScore = document.querySelectorAll('.human-final-score')
const computerFinalScore = document.querySelectorAll('.computer-final-score')

const startButton = document.querySelector('.start-button')
const exitButton = document.querySelector('.exit-button')
const playAgainButton = document.querySelector('.play-again-button')
const infoButton = document.querySelector('.info')
const closeButton = document.querySelector('.close')

const difficultyExplanation = document.querySelector('.difficulty--explanation')
const modalBackground = document.querySelector('.modal--background')

const scoreboard = document.querySelector('.scoreboard')
const humanScoreDisplay = document.querySelector('#human-score')
const computerScoreDisplay = document.querySelector('#computer-score')
const humanEmojisDisplay = document.querySelector('#human-emojis')
const computerEmojisDisplay = document.querySelector('#computer-emojis')
const humanPlayerDisplay = document.querySelector(".player--human")
const computerPlayerDisplay = document.querySelector(".player--computer")

//Viewport variable
let vh = document.documentElement.clientHeight

//Game logic variables

const images = ["🐈", "🦉", "🐟", "🐝", "🐨", "🐸", "🐘", "🦋", "🐙", "🦘", "🦄", "🦇"]
         //thus [0,     1,    2,    3     4,    5,    6,    7,    8,    9,    10,   11 ]



let numsArray = []
let shuffledNumsArray = []
let shuffledCardsArray = []
let htmlCardsArray = []
let pairedCardsArray = []



// the cards chosen by the players: [shuffledIndex, image]
let card1 = []
let card2 = []

let isHumanTurn 
let turnCount = 0

let humanScoreCount = 0
let computerScoreCount = 0

let difficulty = ""
let deckSize


// Game logic: 
// - the eventual cards are represented by numsArray
// - numsArray is shuffled to become shuffledNumsArray
// - for each num in shuffledNumsArray, a html div object with a data-attribute for its index (shuffledIndex) are pushed to htmlCardsArray
// - throughout the game, the html div objects (cards) are visible or hidden as needed.
// - to avoid selecting, and thus revealling the emojis used as the card images should players double-click on a card or click close to one, the emojis are only added to a card when it is shown.


function setScreen1(){
    //Reset from screen2 in cases where vh is less than 670px
    wrapper.classList.add("flow-content")
    cardsContainer.classList.remove("margin-top-1-rem")

    // General
    title.style.display = "block"
    introText.style.display = "block"
    settings.style.display = "block"
    cardsContainer.style.display = "none"
    scoreboard.style.display = "none"

    startButton.style.display = "block"
    exitButton.style.display = "none"
    playAgainButton.style.display = "none"


    cardDisplay.style.display = "flex"
    scoremessage.style.display = "none"
    winnerScreenHuman.style.display = "none"
    winnerScreenComputer.style.display = "none"
    winnerScreenTie.style.display = "none"
}

setScreen1()


infoButton.addEventListener("click", openInfo)
closeButton.addEventListener("click", closeInfo)
startButton.addEventListener("click", startGame)
exitButton.addEventListener("click", setScreen1)
playAgainButton.addEventListener("click", setScreen1)


function openInfo (){
    difficultyExplanation.style.display = "flex"
    modalBackground.style.display = "block"
}

function closeInfo (){
    difficultyExplanation.style.display = "none"
    modalBackground.style.display = "none"
}

function startGame (){
    setStartingPlayer()
    setDifficulty()
    setDeckSize()
    setScreen2()
    createNumsArray()
    resetGame() 
    shuffleNums()
    createCards()
    dealCards()
    playerTurnShadow()
    startMessage()
    let delay = setDelayForDealingCards()
    selectHumanOrComputerTurn(delay)
}

function setStartingPlayer(){
    if(humanStartInput.checked){
        isHumanTurn = true
    }else{
        isHumanTurn = false
    }
    console.log(`humanStartinput is ${humanStartInput.checked}`)
}


function setDifficulty (){
    for(let i = 0; i < difficultyInputs.length; i++){
        if(difficultyInputs[i].checked){
            difficulty = difficultyInputs[i].value
            break
        }
    }
}

function setDeckSize(){
    for(let i = 0; i < deckSizeInputs.length; i++){
        if(deckSizeInputs[i].checked){
            deckSize = parseInt(deckSizeInputs[i].value, 10)
            if(deckSize === 24){
                cardDisplay.style.width = "100%"
            }else{
                cardDisplay.style.width = "245px"
            }
            break
        }
    }
}

function setScreen2(){
    if(deckSize == 24 && vh < 670){
        title.style.display = "none"
        wrapper.classList.remove("flow-content")
        cardsContainer.classList.add("margin-top-1-rem")
    }

    introText.style.display = "none"
    settings.style.display = "none"
    cardsContainer.style.display = "flex"
    scoreboard.style.display = "block"

    startButton.style.display = "none"
    exitButton.style.display = "block"
    playAgainButton.style.display = "none"
}

function createNumsArray(){
    for(let i = 0; i < deckSize; i++){
        numsArray.push(Math.floor(i/2))
    }
}
function resetGame () {
    cardDisplay.innerHTML = ""

    shuffledNumsArray = []
    shuffledCardsArray = []
    htmlCardsArray = []
    pairedCardsArray = []

    card1 = []
    card2 = []

    sameTurn = false
    turnCount = 0

    humanScoreCount = 0
    humanScoreDisplay.textContent = humanScoreCount
    computerScoreCount = 0
    computerScoreDisplay.textContent = computerScoreCount

    humanEmojisDisplay.textContent = ""
    computerEmojisDisplay.textContent = ""
}

function shuffleNums (){
    for(let i = numsArray.length; i > 0; i--){
        const randomNum = Math.floor(Math.random() * numsArray.length)
        //WARNING must use Number() otherwise chosenNum is an object
        let chosenNum = Number(numsArray.splice(randomNum, 1))
        shuffledNumsArray.push(chosenNum)
    }
}

function createCards () {
    for(let i = 0; i < shuffledNumsArray.length; i++){
        let image = shuffledNumsArray[i]

        // find the index of the image's pair
        let imagesIndexes = []
        let pairIndex

        for(let index = 0; index < shuffledNumsArray.length; index++){
            if(shuffledNumsArray[index] === image){
                imagesIndexes.push(index)
            }
        }

        imagesIndexes.forEach(imageIndex => {
            if(imageIndex !== i){
                pairIndex = imageIndex
            }
        })

        //set state for the card
        let card = {
            shuffledIndex: i,
            image: image,
            indexOfPair: pairIndex,
            available: true,
            remembered: false,
            rememberedOnTurn: turnCount,
        }

        shuffledCardsArray.push(card)

        //create the html for the card
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card")

        // Enable access to cards via their index in the shuffledCardsArray
        cardDiv.dataset.shuffledIndex = i

        // Append the card
        cardDisplay.appendChild(cardDiv)

        //create an Array that represents all the cardDivs
        htmlCardsArray.push(cardDiv)
    }
}

function dealCards () {
    let cardIndex = 0

    const intervalID = setInterval(() => {
        if (cardIndex >= shuffledCardsArray.length){
            clearInterval(intervalID)
        }else{
            htmlCardsArray[cardIndex].style.visibility = "visible"
            cardIndex ++
        }
    }, 400)
}

function playerTurnShadow (){
    if(isHumanTurn){
        humanPlayerDisplay.style.boxShadow = "var(--shadow--player)"
        computerPlayerDisplay.style.boxShadow = "unset"
    }else{
        humanPlayerDisplay.style.boxShadow = "unset"
        computerPlayerDisplay.style.boxShadow = "var(--shadow--player)"
    }
}

function startMessage (){
    if(isHumanTurn){
        startmessagehuman.style.display = "block"
    }else{
        startmessagecomputer.style.display = "block"
    }
}

function setDelayForDealingCards (ishumanTurn){
    let delay 
    
    if(ishumanTurn){
        delay = 0
    }else{
        delay = deckSize * 400
    }
    return delay
}

function selectHumanOrComputerTurn (delay){
    const timeoutID = setTimeout(()=>{
        if(isHumanTurn){
            makeCardsClickable()
        }else{
            computerTurn()
        }
        clearTimeout(timeoutID)
    }, delay)
}


//So human can start their turn
function makeCardsClickable() {
    htmlCardsArray.forEach(card => {
        //Exclude (invisible) cards that have already been paired 
        const index = parseInt(card.dataset.shuffledIndex, 10)

        if(pairedCardsArray.includes(index) === false)
        card.addEventListener("click", humanClicksOnCard)
    })
}

function humanClicksOnCard(e) {
    //Get data that represents the clicked card
    let cardIndex = parseInt(e.target.dataset.shuffledIndex, 10)
    let cardImage = shuffledCardsArray[cardIndex].image

    //Assign values from the first card clicked
    assign_values: {
        if(card1.length === 0){
            card1.push(cardIndex, cardImage)
            showCard(card1, 0)
            rememberCard(card1)

        //Assign values from the second card clicked, then update scores and end the human's turn
        }else if(card1.length === 2 && cardIndex != card1[0]){
            card2.push(cardIndex, cardImage)
            showCard(card2, 0)
            rememberCard(card2)
            //Must immediately stop humans from selecting other cards
            clearCardsClickable()

            compareCards()  //And update score
            endTurnOrGame()

        // If a card is double-clicked accidently or deliberately:
        }else{
            break assign_values
        }
    }
}

function showCard(currentCard, delay) {
    const timeoutId = setTimeout (()=>{
        //this function accepts the selected card (unless it's been clicked on more than once)
        //delay will be 0ms for human turns and longer for computer turns
        let index = currentCard[0]
        let image = currentCard[1] 
        let card = htmlCardsArray[index]

        //show card front
        card.style.backgroundColor = "var(--background--card-front)"
        card.style.color = "unset"

        //show card image
        if (image == 0){
            card.textContent = images[0]
        }else if(image == 1){
            card.textContent = images[1]
        }else if(image == 2){
            card.textContent = images[2]
        }else if(image == 3){
            card.textContent = images[3]
        }else if(image == 4){
            card.textContent = images[4]
        }else if(image == 5){
            card.textContent = images[5]
        }else if(image == 6){
            card.textContent = images[6]
        }else if(image == 7){
            card.textContent = images[7]
        }else if(image == 8){
            card.textContent = images[8]
        }else if(image == 9){
            card.textContent = images[9]
        }else if(image == 10){
            card.textContent = images[10]
        }else{
            card.textContent = images[11]
        }       
        
        clearTimeout(timeoutId)

    }, delay)
}

function rememberCard(card){
    let currentCard = shuffledCardsArray[card[0]]
    currentCard.remembered = true
    currentCard.rememberedOnTurn = turnCount
}

function clearCardsClickable (){
    htmlCardsArray.forEach(card=> {
        card.removeEventListener("click", humanClicksOnCard)
    })
}

function compareCards() {
    if(card1[1] === card2[1]){
        let card1Index = card1[0]
        let card2Index = card2[0]

        makeCardUnavailable(card1)
        makeCardUnavailable(card2)

        //Save the indexes of the paired cards
        pairedCardsArray.push(card1Index, card2Index)

        updateScore()
    }
}

function endTurnOrGame () {
    let outcome = checkEndOfGame()
    let delay1 = isHumanTurn? 1000 : 3500
    let delay2 = isHumanTurn? 3000 : 5500
    let delay3 = isHumanTurn? 3000 : 6000

    const timeoutID = setTimeout(()=>{
        highlightPairedCards()
        showPairMessage()
        countTurn()
        forgetCard()
        updateIsHumanTurn() // ALERT: best left in this timeOut, if placed too close before playerTurnMessage() it is not updated in time!
        clearTimeout(timeoutID)
    },delay1)

    if(outcome !== "continueGame"){
        const timeoutID1 = setTimeout(()=> {
            startButton.style.display = "none"
            exitButton.style.display = "none"
            playAgainButton.style.display = "block"
            humanFinalScore.forEach(score => score.textContent = humanScoreCount)
            computerFinalScore.forEach(score => score.textContent = computerScoreCount)

            cardDisplay.style.display = "none"
            hidePairMessage()
            scoreMessage()
	//new code below
		hideStartMessage()
		hidePlayerMessage()
	//new code above

            if(outcome === "humanWinner"){
                winnerScreenHuman.style.display = "block"
            }else if(outcome === "computerWinner"){
                winnerScreenComputer.style.display = "block"
            }else{
                winnerScreenTie.style.display = "block"
            }

            clearTimeout(timeoutID1)
        }, delay2)
    }else{
        const timeoutID2 = setTimeout(() => {
            hideShownCards()
            clearCard1AndCard2()
            hideStartMessage()
            hidePairMessage()
            hidePlayerTurnMessage()
            playerTurnMessage()
            playerTurnShadow()
            selectHumanOrComputerTurn(0)
            clearTimeout(timeoutID2)
        }, delay3)
    }
}

function checkEndOfGame (){
    let outcome = ""
    
    if(humanScoreCount + computerScoreCount === shuffledCardsArray.length / 2){
        if(humanScoreCount > computerScoreCount){
           outcome = "humanWinner"
        }else if(computerScoreCount > humanScoreCount){
           outcome = "computerWinner"
        }else{
           outcome = "tieWinner"
        }
    }else{
        outcome = "continueGame"
    }
    return outcome
}

function highlightPairedCards(){
    if(card1[1] === card2[1]){
        htmlCardsArray[card1[0]].style.boxShadow = "var(--shadow--pair)"
        htmlCardsArray[card2[0]].style.boxShadow = "var(--shadow--pair)"

        //Update scoreboard
        displayScoreValue()
        displayScoreEmojis(card1[1])
    }
}

function showPairMessage(){
    if(card1[1]===card2[1]){
        hidePlayerTurnMessage()
        if(isHumanTurn){
            pairmessagehuman.style.display = "block"
        }else{
            pairmessagecomputer.style.display = "block"
        }
    }
}

function countTurn(){
    turnCount++
}

function forgetCard(){
    if(difficulty === "medium"){
        let memoryStrength = Math.floor(deckSize / 4)
        
        shuffledCardsArray.forEach(card => {
                if(turnCount - card.rememberedOnTurn > memoryStrength){
                        card.remembered = false
                }
        })
    }
}

function updateIsHumanTurn(){
    if(card1[1] === card2[1]){
        isHumanTurn = isHumanTurn
        sameTurn = true
    }else{
        isHumanTurn = !isHumanTurn
        sameTurn = false
    }
}

function hidePairMessage (){
    pairmessagehuman.style.display = "none"
    pairmessagecomputer.style.display = "none"
}

function scoreMessage (){
    scoremessage.style.display = "block"
}

function hideShownCards() {
    //turn cards face down
    htmlCardsArray.forEach(card => {
        card.textContent = ""
        card.style.backgroundColor = "var(--clr-primary-400)"
    })
    //Make paired cards invisible
    htmlCardsArray.forEach(card => {
        if (pairedCardsArray.includes(parseInt(card.dataset.shuffledIndex, 10))){
            card.style.visibility = "hidden"
        }
    })
}

function clearCard1AndCard2 (){
    card1 = []
    card2 = []
}

function hideStartMessage(){
        startmessagehuman.style.display = "none"
        startmessagecomputer.style.display = "none"
}


function hidePlayerTurnMessage(){
    continueturnhuman.style.display = "none"
    newturnhuman.style.display = "none"
    continueturncomputer.style.display = "none"
    newturncomputer.style.display = "none"
}

function playerTurnMessage () {
    if (isHumanTurn && sameTurn){
        continueturnhuman.style.display = "block"
    }else if(isHumanTurn && sameTurn === false){
        newturnhuman.style.display = "block"
    }else if(isHumanTurn === false && sameTurn === true){
        continueturncomputer.style.display = "block"
    }else{
        newturncomputer.style.display = "block"
    }
}

function updateScore(){
    if (isHumanTurn){
        humanScoreCount++
    }else{
        computerScoreCount++
    }
}


function displayScoreValue(){
    if (isHumanTurn){
        humanScoreDisplay.textContent = humanScoreCount
    }else{
        computerScoreDisplay.textContent = computerScoreCount
    }
}

function displayScoreEmojis (index){
    let emoji = document.createTextNode(`${images[index]} `)
    let emojisDisplay

    isHumanTurn ?    
        emojisDisplay = humanEmojisDisplay: 
        emojisDisplay = computerEmojisDisplay
    
    emojisDisplay.appendChild(emoji)
}



function computerTurn(){
    let success = false
    
    if(difficulty === "hard" || difficulty === "medium"){
        //First check for pairs and finish turn if successful
        
        for(let index = 0; index < shuffledCardsArray.length; index++){

            let card = shuffledCardsArray[index]
            let pairedCardIndex = card.indexOfPair
            let pairedCard = shuffledCardsArray[pairedCardIndex]

            if(card.available && card.remembered && pairedCard.remembered){
                card1.push(card.shuffledIndex, card.image)
                card2.push(pairedCard.shuffledIndex, pairedCard.image)

                success = true
                makeCardUnavailable(card1)
                makeCardUnavailable(card2)
                compareCards()
                showComputerCards()
                endTurnOrGame()
                break
            }
        }
        
        if(success===false){

            //Make card1 a random card
            getRandomCard(card1)
        
            //select card2 by checking whether pairedCard of card1 is remembered
            let card1Index = card1[0]
            let pairedCardIndex = shuffledCardsArray[card1Index].indexOfPair

            if(shuffledCardsArray[pairedCardIndex].remembered){
                card2.push(pairedCardIndex)
                card2.push(shuffledCardsArray[pairedCardIndex].image)

                success = true
                
                compareCards()  //And update score
                showComputerCards()
                endTurnOrGame()
            }
        }

        if(success===false){
            //Make card2 a random card
            getRandomCard(card2)
            compareCards()  //And update score
            showComputerCards()
            endTurnOrGame()
        }
    }

    if(difficulty==="easy"){
        getRandomCard(card1)
        getRandomCard(card2)

        compareCards()  //And update score
        showComputerCards()
        endTurnOrGame()
    }
}

function makeCardUnavailable (cardX){
    let index = cardX[0]
    shuffledCardsArray[index].available = false
}

function showComputerCards(){
    showCard(card1, 1500)
    showCard(card2, 2500)
}

function getRandomCard(cardX) {
    let card = cardX
    let availableCardsArray = createAvailableCardsArray()
    let randomIndex = getRandomNum(availableCardsArray)
    let cardIndex = availableCardsArray[randomIndex]
    card.push (cardIndex)
    card.push (shuffledCardsArray[cardIndex].image)
    rememberCard(cardX)
    
    if(card===card1){
        makeCardUnavailable(card1)
    }else{
        makeCardAvailable(card1)
    }
}

function createAvailableCardsArray (){
    let array = []
    for(let i = 0; i < shuffledCardsArray.length; i++){
        if(shuffledCardsArray[i].available === true){
            array.push(i)
        }
    }
    return array
}

function getRandomNum(availableCardsArray) {
    return Math.floor(Math.random() * availableCardsArray.length)
}

function makeCardAvailable (cardX){
    let index = cardX[0]
    shuffledCardsArray[index].available = true
}


// LANGUAGE LOGIC

const languageInputs = document.querySelectorAll('.radio-btn--language')
const frenchInput = document.querySelector('#french')
const englishInput = document.querySelector('#english')


const en = {
    titlemain: "Memory",
    intro1: "Turn over two cards each turn.",
    intro2: "Found a pair? Get another turn!",
    intro3: "Uncover the most pairs to win.",
    intro4: "Can you beat the computer?", 
    titlestartingplayer: "Starting player",
    player1: "Me",
    player2: "Computer",
    titledifficulty: "Difficulty",
    difficulty1: "Easy",
    difficulty2: "Medium",
    difficulty3: "Hard",
    titlenumcards: "Number of cards",
    titlediffexplan: "Difficulty levels",
    titleeasy: "Easy",
    paraeasy: "The computer randomly chooses two cards each turn.",
    titlemedium: "Medium",
    paramedium: "The computer remembers the cards played on the most recent turns (the last 2, 4 or 6 turns, depending on the deck size).",
    titlehard: "Difficult",
    parahard: "The computer remembers every card played!",
    titlehuman: "Me",
    titlecomputer: "Computer",
    startmessagehuman: "You start. Choose two cards.",
    startmessagecomputer: "It's the computer's turn first",
    continueturnhuman: "Your turn continues",
    continueturncomputer: "The computer's turn continues",
    newturnhuman: "It's your turn",
    newturncomputer: "It's the computer's turn",
    pairmessagehuman: "You found a pair!",
    pairmessagecomputer: "The computer found a pair 😅",
    winnerhuman1: "Congratulations!",
    winnerhuman2: "You beat the computer!",
    winnercomputer1: "The computer won!",
    winnercomputer2: "Better luck next time!",
    winnertie1: "It's a tie!",
    winnertie2: "Good effort!",
    scoremessage: "Score",
    startbutton: "Start game",
    exitbutton: "Exit game",
    playagainbutton: "Play again",
}


const fr = {
    titlemain: "Memory",
    intro1: "Retourne deux cartes à chaque tour.",
    intro2: "Tu as trouvé une paire? Rejoue!",
    intro3: "Découvre le plus de paires pour gagner.",
    intro4: "Seras-tu meilleur que l'ordinateur?", 
    titlestartingplayer: "Joueur qui commence",
    player1: "Moi",
    player2: "Ordinateur",
    titledifficulty: "Niveau de difficulté",
    difficulty1: "Facile",
    difficulty2: "Moyen",
    difficulty3: "Difficile",
    titlenumcards: "Nombre de cartes",
    titlediffexplan: "Les niveaux de difficulté",
    titleeasy: "Facile",
    paraeasy: "L'ordinateur retourne deux cartes au hasard à chaque tour.",
    titlemedium: "Moyen",
    paramedium: "L'ordinateur se souvient des cartes retournées aux tours les plus récents (les derniers 2, 4 ou 6 tours, selon le nombre de cartes en jeu).",
    titlehard: "Difficile",
    parahard: "L'ordinateur se souvient de toutes les cartes déjà retournées!",
    titlehuman: "Moi",
    titlecomputer: "Ordinateur",
    startmessagehuman: "Tu commences. Choisis deux cartes.",
    startmessagecomputer: "C'est à l'ordinateur de commencer",
    continueturnhuman: "C'est encore ton tour",
    continueturncomputer: "C'est encore le tour de l'ordinateur",
    newturnhuman: "C'est à toi de jouer",
    newturncomputer: "C'est à l'ordinateur de jouer",
    pairmessagehuman: "Tu as trouvé une paire!",
    pairmessagecomputer: "L'ordinateur a trouvé une paire 😅",
    winnerhuman1: "Félicitations!",
    winnerhuman2: "Tu a vaincu l'ordinateur!",
    winnercomputer1: "L'ordinateur a gagné!",
    winnercomputer2: "Retente ta chance!",
    winnertie1: "Egalité entre vous!",
    winnertie2: "Bel effort!",
    scoremessage: "Score",
    startbutton: "Jouer",
    exitbutton: "Sortir",
    playagainbutton: "Rejouer",
}


function setLanguage (){
    if(englishInput.checked){
        english = true
    }else{
        english = false
    }
}

translate()


function translate (){
    setLanguage()

    let language

    if(english){
        language = en
    }else{
        language = fr
    }

	const elements = document.getElementsByTagName("*")
	
	for(let i = 0; i < elements.length; i++){
		const element = elements[i]
        if(element.id){
            const elemId = element.id
            if(language[elemId]){
                element.textContent = language[elemId]
                if(english){
                    element.lang = "en"
                }else{
                    element.lang ="fr"
                }
            }
        }
    }
}

frenchInput.addEventListener("click", translate)
englishInput.addEventListener("click", translate)


// END OF LANGUAGE LOGIC
