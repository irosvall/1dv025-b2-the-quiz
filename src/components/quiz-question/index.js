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
      height: 100%;
      position: relative; 
    }
    .hidden {
      display: none;
    }
    #radioButtons {
      margin-left: 1.5em;
      display: flex;
      flex-flow: column wrap;
    }
    #radioButtons label {
      display: block;
      width: max-content;
      padding: 0.5em;
      font-size: 1.3em;
    }
    #radioButtons label input {
      width: 18px;
      height: 18px;
      margin: 0 6px -8px 6px;
    }
    #submitRadioAnswer input {
      cursor: pointer;
      background-color: rgb(252, 230, 217);
      font-size: 1.3em;
      padding: 0.4em 0.8em;
      border-radius: 0.5em;
      display: block;
      position: absolute;
      bottom: 3em;
      left: 45%;
    }
    #textAnswerForm {
      text-align: center;
    }
    #textInput, #submitTextAnswer {
      display: inline-block;
      margin-top: 2em;
    }
    #textAnswerForm input {
      font-size: 1.25em;
      padding: 0.2em 0.3em;
    }
    #submitTextAnswer input {
      cursor: pointer;
      background-color: rgb(252, 230, 217);
      margin-left: 0.3em;
      border-radius: 0.5em;
      padding: 0.3em 0.5em;
    }
    h2 {
      margin-top: 0;
      color: rgb(46, 45, 60);
      font-size: 2em;
      text-align: center;
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

      /* EVENT HANDLERS */

      /**
       * Handles submit events for when the user submit radio button answers.
       *
       * @param {Event} event - The submit event.
       */
      this._onRadioButtonSubmit = event => {
        this._getRadioButtonAnswer(event)
      }

      /**
       * Handles submit events for when the user submit text input answers.
       *
       * @param {Event} event - The submit event.
       */
      this._ontextInputSubmit = event => {
        event.preventDefault()
        this._fetchAnswer(`${this._textAnswerinput.value}`.toLowerCase())
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._radioAnswerForm.addEventListener('submit', this._onRadioButtonSubmit)
      this._textAnswerForm.addEventListener('submit', this._ontextInputSubmit)
      this.addEventListener('rightAnswer', this.getQuestion)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._radioAnswerForm.removeEventListener('submit', this._onRadioButtonSubmit)
      this._textAnswerForm.removeEventListener('submit', this._ontextInputSubmit)
      this.removeEventListener('rightAnswer', this.getQuestion)
    }

    /**
     * Fetches the questions and display them with interactive answer forms.
     * Handles rightAnswer events for when the user answer correct and needs another question.
     */
    async getQuestion () {
      this._hidePreviousQuestion()

      let res
      try {
        res = await this._fetchQuestion()
      } catch {
        this._question.textContent = 'Problem with the game, come back later.'
        console.log(Error('Couldn\'t fetch the question'))
      }

      this._answerURL = res.nextURL

      // Displays the question.
      this._question.textContent = `${res.question}`

      // Give radio button answer alternative if the property alternatives exist.
      if (res.alternatives) {
        this._renderRadioAnswerForm(res.alternatives)
      } else {
        this._rendertextAnswerForm()
      }

      this.dispatchEvent(new window.CustomEvent('loadedQuestion'))

      // Creates an event if the response has a time limit.
      if (res.limit) {
        this.dispatchEvent(new window.CustomEvent('hasLimit', { detail: { limit: `${res.limit}` } }))
      }
    }

    /**
     * Fetch question and parse it from JSON.
     *
     * @returns {Promise<object>} A Promise from the fetched question that resolves into a JavaScript object.
     */
    async _fetchQuestion () {
      const res = await window.fetch(`${this._questionURL}`)
      return res.json()
    }

    /**
     * Render the answer option for radio buttons.
     *
     * @param {object} alternatives - The answer options.
     */
    _renderRadioAnswerForm (alternatives) {
      this._radioButtons.textContent = ''
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
     * Runs when submit events for when the user submit radio button answers occurs.
     * It iterates through the properties of the event till the checked answer is found and sends its value to get the question.
     *
     * @param {Event} event - The submit event.
     */
    _getRadioButtonAnswer (event) {
      event.preventDefault()

      for (const prop in event.path[0]) {
        try {
          if (event.path[0][prop].checked) {
            this._fetchAnswer(event.path[0][prop].id)
            break
          }
          // Has to check one button to continue.
        } catch {
          break
        }
      }
    }

    /**
     * Render the answer option for a text field.
     */
    _rendertextAnswerForm () {
      this._textAnswerinput.value = ''
      this._textAnswerForm.classList.remove('hidden')
      this._textAnswerinput.focus()
    }

    /**
     * Runs when submit events for answered questions occurs.
     * Fetches the answers.
     *
     * @param {string} answer - The answer.
     */
    async _fetchAnswer (answer) {
      const jsonAnswer = JSON.stringify({ answer: `${answer}` })
      let res
      try {
        res = await window.fetch(`${this._answerURL}`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: `${jsonAnswer}`
        })
      } catch {
        this._question.textContent = 'Problem with the game, come back later.'
        console.log(Error('Couldn\'t fetch the answer'))
        return
      }
      this._checkHTTPstatus(res)
    }

    /**
     * Check the HTTP Response status to see the user's progress through the game.
     *
     * @param {JSON} res - The HTTP Response.
     */
    async _checkHTTPstatus (res) {
      if (res.status === 400) {
        this.dispatchEvent(new window.CustomEvent('wrongAnswer'))
      } else if (res.status === 200) {
        res = await res.json()
        // Finds the next question. If it doesn't exist player wins.
        if (res.nextURL) {
          this._questionURL = res.nextURL
          this.dispatchEvent(new window.CustomEvent('rightAnswer'))
        } else {
          this.dispatchEvent(new window.CustomEvent('gameWin'))
        }
      } else if (res.status === 500) {
        this._question.textContent = 'Problem with the game, come back later.'
      }
    }

    /**
     * Hides the previous question by setting the class hidden on it.
     */
    _hidePreviousQuestion () {
      if (!this._radioAnswerForm.classList.contains('hidden')) {
        this._radioAnswerForm.classList.add('hidden')
      }
      if (!this._textAnswerForm.classList.contains('hidden')) {
        this._textAnswerForm.classList.add('hidden')
      }
    }

    /**
     * Resets the URL's to their default values.
     */
    resetQuestions () {
      this._questionURL = 'http://courselab.lnu.se/question/1'
      this._answerURL = ''
    }
  })
