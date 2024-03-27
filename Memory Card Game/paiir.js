
const levels = [
    { rows: 2, columns: 4, cardClass: 'card-level-1' },
    { rows: 3, columns: 4, cardClass: 'card-level-2' },
    // Add more levels as needed
];

class AudioController {
    constructor() {

        this.bgMusic = new Audio('assets/txt.mp3');
        this.flipSound = new Audio('assets/rotate.wav');
        this.matchSound = new Audio('assets/match.wav');
        this.victorySound = new Audio('assets/clickstart.mp3');
        this.gameOverSound = new Audio('assets/gameover.wav');
        this.startSound = new Audio('assets/clickstart.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;

        this.startSound = new Audio('assets/clickstart.mp3');
        this.startSound.volume = 0.5;
        this.startSound.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
        });
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    clickMusic(){
    this.startSound.play();
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }

}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    initGame() {
        this.gameContainer = document.getElementById('game-container');
    
        const overlays = Array.from(document.getElementsByClassName('overlay-text'));
        overlays.forEach((overlay) => {
            overlay.addEventListener('click', () => {
                overlay.classList.remove('visible');
                this.startLevel();
            });
        });

        this.startLevel();
    }

    startLevel() {
        if (this.currentLevel < levels.length) {
            const currentLevelConfig = levels[this.currentLevel];
    
            // Set the rows and columns based on the current level
            const rows = currentLevelConfig.rows;
            const columns = currentLevelConfig.columns;
            const cardClass = currentLevelConfig.cardClass;
    
            this.cardsArray = this.generateShuffledCards(rows, columns, cardClass);
    
            // Other setup logic as needed
    
        } else {
            alert('Congratulations! You completed all levels.');
        }
    }
    
    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = false;
        this.audioController.startMusic();
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.countdown = this.startCountdown();
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            console.log("Time Remaining:", this.timeRemaining);
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    
    
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1200);
    }
    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');

        // Assuming overlayText is the reference to your overlay text element
        let victoryOverlay = document.getElementById('victory-text');

        victoryOverlay.addEventListener('animationend', () => {
            this.currentLevel++; // Increment to proceed to the next level
            this.cleanUpCurrentLevel(); // Clean up current level resources
            this.startLevel(); // Start the next level
        });
    }

    cleanUpCurrentLevel() {
        // 1. Remove Event Listeners
        this.cardsArray.forEach(card => {
            card.removeEventListener('click', this.flipCardHandler);
        });

        // 2. Reset Variables
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = false;

        // 3. Clear Intervals or Timeouts
        clearInterval(this.countdown);

        // 4. Reset UI Elements
        this.timer.innerText = '';
        this.ticker.innerText = '';

        // 5. Release Resources (assuming you have a method to stop music)
        this.audioController.stopMusic();
    }
}
        
        
    

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}


const game = new MixOrMatch(100, levels);

// Assuming victoryOverlay is the reference to your victory overlay text element
let victoryOverlay = document.getElementById('victory-text');

victoryOverlay.addEventListener('animationend', function () {
    game.restartGame();
});

document.addEventListener('DOMContentLoaded', ready);

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(500, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            // game.audioController.clickMusic();
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

//     // Play startSound music when the page loads
//     document.body.addEventListener('click', () => {
//         game.audioController.clickMusic();
//     });
}

const textContainer = document.getElementById('glowText');
const text = textContainer.textContent.trim();
textContainer.innerHTML = '';
text.split('').forEach(letter => {
  const span = document.createElement('span');
  span.textContent = letter;
  textContainer.appendChild(span);
})