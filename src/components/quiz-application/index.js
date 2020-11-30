/**
 * The quiz-application web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {  
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 4em;
      margin: 2em;
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
  </style>

  <div class="wrapper" id="startWindow">
    <h2>Instruction</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat totam sed distinctio? Officia reiciendis repellat necessitatibus animi ipsa in natus, harum ex optio cumque, expedita corporis quia accusamus perspiciatis facilis?</p>
    <form id="startGameForm">
      <div id="nicknameDiv">
        <label for="nicknameInput">Nickname</label>
        <input id="nicknameInput" type="text" placeholder="Anonymous" autocomplete="off">
      </div>
      <div id="startGameButton">
        <input type="submit" value="Start game">
      </div>
    </form>
  </div>
  <div class="wrapper hidden" id="questionWindow">
    <countdown-timer></countdown-timer>
    <quiz-question></quiz-question>
  </div>
  <div class="wrapper hidden" id="CongratzWindow">
    <h2>Congratulations you completed the quiz!</h2>
    <p>Time/Score: </p>
    <button id="playAgainButton" type="button">Play again</button>
  </div>
  <div class="wrapper hidden" id="gameOverWindow">
    <h2>Game Over</h2>
  </div>
  <div class="wrapper" id="highScoreWindow">
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

      this._startGameForm = this.shadowRoot.querySelector('#startGameForm')
      this._countdownTimer = this.shadowRoot.querySelector('countdown-timer')
      this._quizQuestion = this.shadowRoot.querySelector('quiz-question')
      this._startWindow = this.shadowRoot.querySelector('#startWindow')
      this._questionWindow = this.shadowRoot.querySelector('#questionWindow')
      this._CongratzWindow = this.shadowRoot.querySelector('#CongratzWindow')
      this._gameOverWindow = this.shadowRoot.querySelector('#gameOverWindow')
      this._nicknameInput = this.shadowRoot.querySelector('#nicknameInput')

      /**
       * The player's nickname.
       *
       * @type {string}
       */
      this._nickname = 'Anonymous'
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._startGameForm.addEventListener('submit', (event) => {
        this._startGame(event, this._nicknameInput.value)
      })
      this._quizQuestion.addEventListener('hasLimit', event => {
        this._countdownTimer.setAttribute('limit', event.detail.limit)
      })
      this._quizQuestion.addEventListener('wrongAnswer', event => {
        this._gameOver()
      })
      this._countdownTimer.addEventListener('timeout', event => {
        this._gameOver()
      })
      this._quizQuestion.addEventListener('loadedQuestion', event => {
        this._countdownTimer.stopTimer()
        this._countdownTimer.startTimer()
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._startGameForm.removeEventListener('click', (event) => {
        this._startGame(event)
      })
      this._quizQuestion.removeEventListener('hasLimit', event => {
        this._countdownTimer.setAttribute('limit', event.detail.limit)
      })
      this._quizQuestion.removeEventListener('wrongAnswer', event => {
        this._gameOver()
      })
      this._countdownTimer.removeEventListener('timeout', event => {
        this._gameOver()
      })
      this._quizQuestion.removeEventListener('loadedQuestion', event => {
        this._countdownTimer.stopTimer()
        this._countdownTimer.startTimer()
      })
    }

    /**
     * Handles submit events for starting the game.
     *
     * @param {Event} event - The submit event.
     * @param {string} nickname - The user's nickname.
     */
    _startGame (event, nickname) {
      event.preventDefault()
      this._nickname = nickname
      this._startWindow.classList.add('hidden')
      this._questionWindow.classList.remove('hidden')
      this.dispatchEvent(new window.CustomEvent('gameStart'))
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
      }, 2000)
    }
  })
