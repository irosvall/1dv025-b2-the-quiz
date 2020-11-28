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
      <input type="text" placeholder="Answer.." autocomplete="off">
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
       * The h2 element for the question to be displayed in.
       *
       * @type {HTMLElement}
       */
      this._question = this.shadowRoot.querySelector('#question')

      /**
       * The form element for the text answer type of questions.
       *
       * @type {HTMLElement}
       */
      this._textAnswerForm = this.shadowRoot.querySelector('#textAnswerForm')

      /**
       * The input element for the text answer type of questions.
       *
       * @type {HTMLElement}
       */
      this._textAnswerinput = this.shadowRoot.querySelector('#textAnswerForm input')

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
      this._questionURL = 'http://courselab.lnu.se/question/1'
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
      this._textAnswerForm.addEventListener('submit', event => {
        event.preventDefault()
        this._fetchAnswer(event, `${this._textAnswerinput.value}`.toLowerCase())
      })
      this.addEventListener('rightAnswer', event => {
        this._fetchQuestions(event)
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
      this._textAnswerForm.removeEventListener('submit', event => {
        event.preventDefault()
        this._fetchAnswer(event, `${this._textAnswerinput.value}`.toLowerCase())
      })
      this.removeEventListener('rightAnswer', event => {
        this._fetchQuestions(event)
      })
    }

    /**
     * Handles gameStart events. Fetches the questions.
     *
     * @param {Event} event - The gameStart event.
     */
    async _fetchQuestions (event) {
      this._radioAnswerForm.classList.add('hidden')
      this._textAnswerForm.classList.add('hidden')

      let res = await window.fetch(`${this._questionURL}`)
      res = await res.json()
      console.log(res)

      this._answerURL = res.nextURL
      this._question.textContent = `${res.question}`

      if (res.alternatives) {
        this._renderRadioAnswerForm(res.alternatives)
      } else {
        this._textAnswerinput.value = ''
        this._textAnswerForm.classList.remove('hidden')
        this._textAnswerinput.focus()
      }

      this.dispatchEvent(new window.CustomEvent('loadedQuestion'))

      if (res.limit) {
        this.dispatchEvent(new window.CustomEvent('hasLimit', { detail: { limit: `${res.limit}` } }))
      }
    }

    /**
     * Render answer option for radio buttons.
     *
     * @param {object} alternatives - The answer options.
     */
    _renderRadioAnswerForm (alternatives) {
      this._radioButtons.innerHTML = ''
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
      for (const prop in event.path[0]) {
        if (event.path[0][prop].checked) {
          this._fetchAnswer(event, event.path[0][prop].id)
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

      if (res.status === 400) {
        this._questionURL = 'http://courselab.lnu.se/question/1'
        this._answerURL = ''
        this.dispatchEvent(new window.CustomEvent('wrongAnswer'))
      } else if (res.status === 200) {
        res = await res.json()
        this._questionURL = res.nextURL
        this.dispatchEvent(new window.CustomEvent('rightAnswer'))
      }
    }
  })
