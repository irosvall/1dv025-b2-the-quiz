/**
 * The quiz-application web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

import '../high-score/'
import '../quiz-question/'
import '../countdown-timer/'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {  
      margin: 2em;
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 4em;
      grid-template-areas: 
        "gridleft gridright";
    }
    .gridleft {
      grid-area: gridleft;
    }
    .gridright {
      grid-area: gridright;
    }
    .wrapper {
      background-color: white;
      padding: 2em;
      height: 70vh;
      max-height: 100%;
      border: solid 2px grey;
      border-radius: 10px;
    }
    .hidden {
      display: none;
    }
    #gameOverWindow {
      transition: background-color 2s ease;
      background-color: red;
    }
    #startGameForm {
      text-align: center;
    }
    #startGameForm label {
      display: inline-block;
      font-size: 1.25em;
      padding-bottom: 0.2em;
    }
    #startGameForm input, #playAgainButton {
      display: block;
      font-size: 1.25em;
      margin: 0 auto;
      padding: 0.2em 0.3em;
    }
    #startGameButton input, #playAgainButton {
      cursor: pointer;
      background-color: rgb(252, 230, 217);
      margin-top: 2em;
      padding: 0.5em 1em;
    }
    #CongratzWindow p {
      margin-top: 3em;
      margin-bottom: 0;
      text-align: center;
      font-size: 1.7em;
    }
    h2 {
      color: rgb(46, 45, 60);
      font-size: 2em;
    }
    p {
      font-size: 1.15em;
      line-height: 1.5em;
    }
  </style>

  <div class="gridleft wrapper" id="startWindow">
    <h2>Instructions</h2>
    <p>To win this quiz you need to answer all questions correctly. The questions are either answered with text or you will be displayed with several options where only one alternative is correct. The questions are timed and if the time runs out or you answer one question wrong you loose the quiz. If you win the quiz you have a chance to be displayed on the high score board. The less time taken during the quiz the better standing you will have.</p>
    <form id="startGameForm">
      <div id="nicknameDiv">
        <label for="nicknameInput">Nickname:</label>
        <input id="nicknameInput" type="text" placeholder="Anonymous" autocomplete="off" autofocus>
      </div>
      <div id="startGameButton">
        <input type="submit" value="Start game">
      </div>
    </form>
  </div>
  <div class="gridleft wrapper hidden" id="questionWindow">
    <countdown-timer></countdown-timer>
    <quiz-question></quiz-question>
  </div>
  <div class="gridleft wrapper hidden" id="CongratzWindow">
    <h2>Congratulations you completed the quiz!</h2>
    <p></p>
    <button id="playAgainButton" type="button">Play again</button>
  </div>
  <div class="gridleft wrapper hidden" id="gameOverWindow">
    <h2>Game Over</h2>
  </div>
  <div class="gridright wrapper" id="highScoreWindow">
    <high-score></high-score>
  </div>  
`

/**
 * Define custom element.
 */
customElements.define('quiz-application',
  /**
   * Represents a quiz-application custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a quiz-application custom element.
     *
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /**
       * The form element for starting the game.
       *
       * @type {HTMLElement}
       */
      this._startGameForm = this.shadowRoot.querySelector('#startGameForm')

      /**
       * The button element for restarting the game.
       *
       * @type {HTMLElement}
       */
      this._playAgainButton = this.shadowRoot.querySelector('#playAgainButton')

      /**
       * The countdown-timer element.
       *
       * @type {HTMLElement}
       */
      this._countdownTimer = this.shadowRoot.querySelector('countdown-timer')

      /**
       * The quiz-question element.
       *
       * @type {HTMLElement}
       */
      this._quizQuestion = this.shadowRoot.querySelector('quiz-question')

      /**
       * A div element holding the start window content.
       *
       * @type {HTMLElement}
       */
      this._startWindow = this.shadowRoot.querySelector('#startWindow')

      /**
       * A div element holding the question window content.
       *
       * @type {HTMLElement}
       */
      this._questionWindow = this.shadowRoot.querySelector('#questionWindow')

      /**
       * A div element holding the congratulations for winning the game window content.
       *
       * @type {HTMLElement}
       */
      this._CongratzWindow = this.shadowRoot.querySelector('#CongratzWindow')

      /**
       * A div element holding the game over window content.
       *
       * @type {HTMLElement}
       */
      this._gameOverWindow = this.shadowRoot.querySelector('#gameOverWindow')

      /**
       * The input element to write in a nickname.
       *
       * @type {HTMLElement}
       */
      this._nicknameInput = this.shadowRoot.querySelector('#nicknameInput')

      /**
       * The high-score element.
       *
       * @type {HTMLElement}
       */
      this._highScore = this.shadowRoot.querySelector('high-score')

      /**
       * The player's nickname.
       *
       * @type {string}
       */
      this.nickname = ''

      /* EVENT HANDLERS */

      /**
       * Handles submit events for when the game starts.
       *
       * @param {Event} event - The submit event.
       */
      this._handleStartGame = event => {
        this._startGame(event, this._nicknameInput.value)
      }

      /**
       * Handles hasLimit events for when the questions has a timer limit.
       *
       * @param {Event} event - The hasLimit event.
       */
      this._handleHasLimit = event => {
        this._countdownTimer.setAttribute('limit', event.detail.limit)
      }

      /**
       * Handles wrongAnswer and timeout events, which causes game over.
       */
      this._handleGameOver = () => {
        this._gameOver()
      }

      /**
       * Handles loadedQuestion events.
       */
      this._handleLoadedQuestion = () => {
        this._countdownTimer.stopTimer()
        this._countdownTimer.startTimer()
      }

      /**
       * Handles gameWin events.
       */
      this._handleGameWin = () => {
        this._gameWin()
      }

      /**
       * Handles click events for when the start over button is pressed.
       */
      this.handleStartOver = () => {
        this._startOver()
      }
    }

    /**
     * Get the nickname.
     *
     * @returns {string} The nickname.
     */
    get nickname () {
      return this._nickname
    }

    /**
     * Validates and sets the nickname.
     *
     * @param {string} nickname - The nickname.
     */
    set nickname (nickname) {
      if (nickname !== '') {
        this._nickname = nickname
      } else {
        this._nickname = 'Anonymous'
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._startGameForm.addEventListener('submit', this._handleStartGame)
      this._quizQuestion.addEventListener('hasLimit', this._handleHasLimit)
      this._quizQuestion.addEventListener('wrongAnswer', this._handleGameOver)
      this._countdownTimer.addEventListener('timeout', this._handleGameOver)
      this._quizQuestion.addEventListener('loadedQuestion', this._handleLoadedQuestion)
      this._quizQuestion.addEventListener('gameWin', this._handleGameWin)
      this._playAgainButton.addEventListener('click', this.handleStartOver)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._startGameForm.removeEventListener('submit', this._handleStartGame)
      this._quizQuestion.removeEventListener('hasLimit', this._handleHasLimit)
      this._quizQuestion.removeEventListener('wrongAnswer', this._handleGameOver)
      this._countdownTimer.removeEventListener('timeout', this._handleGameOver)
      this._quizQuestion.removeEventListener('loadedQuestion', this._handleLoadedQuestion)
      this._quizQuestion.removeEventListener('gameWin', this._handleGameWin)
      this._playAgainButton.removeEventListener('click', this.handleStartOver)
      this._countdownTimer.stopTimer()
    }

    /**
     * Handles submit events for starting the game.
     *
     * @param {Event} event - The submit event.
     * @param {string} nickname - The user's nickname.
     */
    _startGame (event, nickname) {
      event.preventDefault()
      this.nickname = nickname

      // Makes the quiz always start at the first question.
      this._quizQuestion.resetQuestions()

      // Resets the time/score
      this._countdownTimer.resetTotalTime()

      this._startWindow.classList.add('hidden')
      this._questionWindow.classList.remove('hidden')
      this._quizQuestion.getQuestion()
    }

    /**
     * Handles events for when the user fails the quiz.
     */
    _gameOver () {
      this._countdownTimer.stopTimer()
      this._questionWindow.classList.add('hidden')
      this._gameOverWindow.classList.remove('hidden')
      window.setTimeout(() => {
        this._gameOverWindow.classList.add('hidden')
        this._startWindow.classList.remove('hidden')
        this._nicknameInput.focus()
      }, 2000)
    }

    /**
     * Handles events for when the user finnishes the quiz.
     */
    _gameWin () {
      this._countdownTimer.stopTimer()
      const totalTime = this._countdownTimer.totalTime
      this._highScore.newScore({ name: this._nickname, score: totalTime })
      this.shadowRoot.querySelector('#CongratzWindow p').textContent = `Time/Score: ${totalTime}s`
      this._questionWindow.classList.add('hidden')
      this._CongratzWindow.classList.remove('hidden')
    }

    /**
     * Handles events for when the user clicks the play again button.
     */
    _startOver () {
      this._CongratzWindow.classList.add('hidden')
      this._startWindow.classList.remove('hidden')
      this._nicknameInput.focus()
    }
  })
