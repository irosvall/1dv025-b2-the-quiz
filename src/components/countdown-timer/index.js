/**
 * The countdown-timer web component module.
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
      background-color: rgb(211, 229, 233, 0.705);
      display: block;
      width: fit-content;
      font-size: 2em;
      font-weight: 1000;
      padding: 0.2em 1em;
      text-align: right;
      margin-left: auto;
    }
    time {
      margin: 0 auto;
    }
  </style>

  <time></time>  
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
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /**
       * A time element of which its text content will count down.
       *
       * @type {HTMLElement}
       */
      this._timeElement = this.shadowRoot.querySelector('time')

      /**
       * The timer's limit in seconds.
       *
       * @type {number}
       */
      this._limit = 20

      /**
       * The time left on the timer.
       *
       * @type {number}
       */
      this._timeLeft = this._limit

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
     * Get a player's total time.
     *
     * @returns {number} The total time.
     */
    get totalTime () {
      return this._totalTime
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['limit']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      // Change the first comma to a dot.
      newValue = newValue.replace(',', '.')
      // Parse newValue to a number and round it to nearest integer.
      newValue = Math.round(Number(newValue))
      if (Number.isInteger(newValue)) {
        this._limit = newValue
        this._timeLeft = this._limit
      }
    }

    /**
     * Starts the timer.
     */
    startTimer () {
      // To give a set limit the chance to be present a timeout is set.
      window.setTimeout(() => {
        this._timeElement.textContent = this._timeLeft
      }, 0)
      this._IntervalID = window.setInterval(() => {
        this._timeLeft -= 1
        this._timeElement.textContent = this._timeLeft
        if (this._timeLeft === 0) {
          this.stopTimer()
          this.dispatchEvent(new window.CustomEvent('timeout'))
        }
      }, 1000)
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      clearInterval(this._IntervalID)
      this._addTime()
      this._resetTimer()
    }

    /**
     * Resets the total time value.
     */
    resetTotalTime () {
      this._totalTime = 0
    }

    /**
     * Resets the timer values to default.
     */
    _resetTimer () {
      this._limit = 20
      this._timeLeft = 20
    }

    /**
     * Add time to the total time that's taken during game session.
     */
    _addTime () {
      this._totalTime += (this._limit - this._timeLeft)
    }
  })
