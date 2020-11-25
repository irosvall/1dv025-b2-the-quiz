/**
 * The wiki-search web component module.
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
      background-color: blue;
      display: inline-block;
      font-size: 1.2em;
    }
  </style>

  <time datetime=""></time>  
`
/**
 * Define custom element.
 */
customElements.define('countdown-timer',
  /**
   * Represents a countdown-timer custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a countdown-timer custom element.
     *
     * @param {number} timer - The time limit in seconds.
     */
    constructor (timer = 20) {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the time element in the shadow root.
      this._timeElement = this.shadowRoot.querySelector('time')

      /**
       * The timer in seconds.
       *
       * @type {number}
       */
      this.timer = timer

      /**
       * The time left on the timer.
       *
       * @type {number}
       */
      this._timeLeft = this.timer

      /**
       * The total time a game session has taken.
       *
       * @type {number}
       */
      this._totalTime = 0

      /**
       * The ID of the interval used for the timer.
       *
       * @type {number}
       */
      this._IntervalID = null
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      debugger
      this._IntervalID = window.setInterval(() => {
        if (this._timeLeft === 0) {
          this.stopTimer()
          this.dispatchEvent(new window.CustomEvent('timeout'))
          return
        }
        this._timeElement.textContent = this._timeLeft
        this._timeLeft -= 1
      }, 1000)
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      clearInterval(this._IntervalID)
      this._addTime()
    }

    /**
     * Add time to the total time that's taken during game session.
     */
    _addTime () {
      this._totalTime += (this.timer - this._timeLeft)
    }
  })
