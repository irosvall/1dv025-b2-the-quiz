/**
 * The quiz-application web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

import '../quiz-question/'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      background-color: white;
    }
  </style>

  <div class="wrapper" id="startWindow">
    <h2>Instruction</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat totam sed distinctio? Officia reiciendis repellat necessitatibus animi ipsa in natus, harum ex optio cumque, expedita corporis quia accusamus perspiciatis facilis?</p>
    <nickname-form></nickname-form>
    <button id="startGameButton" type="button">Start game</button>
  </div>
  <div class="wrapper" id="questionWindow">
    <countdown-timer limit="50,5"></countdown-timer>
    <quiz-question></quiz-question>
  </div>
  <div class="wrapper" id="startWindow">
    <h2>Congratulations you completed the quiz!</h2>
    <p>Time/Score: </p>
    <button id="playAgainButton" type="button">Play again</button>
  </div>
  <div class="wrapper" id="gameOverWindow">
    <h2>Game Over</h2>
  </div>
  <div id="highScoreWindow">
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

      this._startGameButton = this.shadowRoot.querySelector('#startGameButton')
      this._countdownTimer = this.shadowRoot.querySelector('countdown-timer')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._startGameButton.addEventListener('click', () => {
        this.dispatchEvent(new window.CustomEvent('gameStart'))
      })
      this.addEventListener('hasLimit', event => {
        console.log(event)
        this._countdownTimer.setAttribute('limit', event.detail.limit)
      })
    }
  })
