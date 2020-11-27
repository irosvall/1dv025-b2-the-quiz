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
    #radioButtons label {
      display: block;
      padding: 0.5em;
    }
    #textInput, #submitTextAnswer {
      display: inline-block;
    }
  </style>

  <h2 id="question"></h2>
  <form id="textAnswerForm" class="hidden">
    <div id="textInput">
      <input type="text" placeholder="Answer..">
    </div>
    <div id="submitTextAnswer">
      <input type="submit" value="Submit">
    </div>
  </form>
  <form id="radioAnswerForm" class="hidden">
    <div id="radioButtons"></div>
    <div id="submitRadioAnswer">
      <input type="submit" value="Submit">
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

      /**
       * The form element for the text answer type of questions.
       *
       * @type {HTMLElement}
       */
      this._textAnswerForm = this.shadowRoot.querySelector('#textAnswerForm')

      /**
       * The form element for the radio answer type of questions.
       *
       * @type {HTMLElement}
       */
      this._radioAnswerForm = this.shadowRoot.querySelector('#radioAnswerForm')

      /**
       * A placeholder, div element, for the radio buttons.
       *
       * @type {HTMLElement}
       */
      this._radioButtons = this.shadowRoot.querySelector('#radioButtons')

      /**
       * The URL to fetch the answer.
       *
       * @type {string}
       */
      this._answerURL = ''

      /**
       * The URL to fetch the question.
       *
       * @type {string}
       */
      this._questionURL = ''
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.quizApplication.addEventListener('gameStart', event => {
        this._fetchQuestions(event)
      })
      this._radioAnswerForm.addEventListener('submit', event => {
        this._getRadioButtonAnswer(event)
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.quizApplication.removeEventListener('gameStart', event => {
        this._fetchQuestions(event)
      })
      this._radioAnswerForm.removeEventListener('submit', event => {
        this._getRadioButtonAnswer(event)
      })
    }

    /**
     * Handles gameStart events. Fetches the questions.
     *
     * @param {Event} event - The gameStart event.
     */
    async _fetchQuestions (event) {
      let res = await window.fetch('http://courselab.lnu.se/question/21')
      res = await res.json()
      console.log(res)

      this._answerURL = res.nextURL

      if (res.alternatives) {
        this._renderRadioAnswerForm(res.alternatives)
      } else {
        this._textAnswerForm.classList.remove('hidden')
      }

      if (res.limit) {
        this.quizApplication.dispatchEvent(new window.CustomEvent('hasLimit', { detail: { limit: `${res.limit}` } }))
      }
    }

    /**
     * Render answer option for radio buttons.
     *
     * @param {object} alternatives - The answer options.
     */
    _renderRadioAnswerForm (alternatives) {
      const fragment = document.createDocumentFragment()

      for (const alt in alternatives) {
        const input = document.createElement('input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', 'radio')
        input.setAttribute('id', `${alt}`)
        const label = document.createElement('label')
        label.appendChild(input)
        label.appendChild(document.createTextNode(`${alternatives[alt]}`))
        fragment.appendChild(label)
      }
      this._radioButtons.appendChild(fragment)
      this._radioAnswerForm.classList.remove('hidden')
    }

    /**
     * Handles submit events for answered radio button questions.
     *
     * @param {Event} event - The submit event.
     */
    _getRadioButtonAnswer (event) {
      event.preventDefault()
      console.log(event)
      for (const prop in event.path[0]) {
        if (event.path[0][prop].checked) {
          this._fetchAnswer(event, event.path[0][prop].id)
          console.log(event.path[0][prop].id)
          break
        }
      }
    }

    /**
     * Handles submit events for answered questions. Fetches the answers.
     *
     * @param {Event} event - The submit event.
     * @param {string} answer - The answer.
     */
    async _fetchAnswer (event, answer) {
      const jsonAnswer = JSON.stringify({ answer: `${answer}` })
      let res = await window.fetch(`${this._answerURL}`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: `${jsonAnswer}`
      })
      res = await res.json()
      console.log(res)
    }
  })
