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
      background-color: lightblue;
      display: inline-block;
      font-size: 1.5em;
      font-weight: 1000;
      padding: 0.5em 1.4em;
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

      // Get the time element from the shadow root.
      this._timeElement = this.shadowRoot.querySelector('time')

      /**
       * The timer's limit in seconds.
       *
       * @type {number}
       */
      this.limit = 20

      /**
       * The time left on the timer.
       *
       * @type {number}
       */
      this._timeLeft = this.limit

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
        this.limit = newValue
        this._timeLeft = this.limit
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
      this.limit = 20
      this._timeLeft = 20
    }

    /**
     * Add time to the total time that's taken during game session.
     */
    _addTime () {
      this._totalTime += (this.limit - this._timeLeft)
    }
  })
