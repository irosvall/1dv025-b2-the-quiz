/**
 * The quiz-question web component module.
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
      display: block;
    }
    .hidden {
      display: none;
    }
  </style>

  <h2 id="question"></h2>
  <form id="Searchform">
    <div id="textAnswerMethod" class="hidden">
      <div id="textAnswer">
          <input type="text" placeholder="Answer..">
      </div>
      <div id="submitTextAnswer">
          <input type="submit" value="Submit">
      </div>
    </div>
    <div id="radioAnswerMethod" class="hidden">
      <div id="radioAnswer"></div>
      <div id="submitRadioAnswer">
          <input type="submit" value="Submit">
      </div>
    </div>
  </form>
`

/**
 * Define custom element.
 */
customElements.define('quiz-question',
  /**
   * Represents a quiz-question custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a quiz-question custom element.
     *
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /**
       * The quiz application.
       *
       * @type {HTMLElement}
       */
      this.quizApplication = document.querySelector('quiz-application')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.quizApplication.addEventListener('gameStart', event => {
        this._fetchQuestions(event)
      })
    }

    /**
     * Handles gameStart events.
     *
     * @param {Event} event - The input event.
     */
    async _fetchQuestions (event) {
      let res = await window.fetch('http://courselab.lnu.se/question/21')
      res = await res.json()
      console.log(res)

      if (res.limit) {
        this.quizApplication.dispatchEvent(new window.CustomEvent('hasLimit', { detail: { limit: `${res.limit}` } }))
      }
    }
  })
