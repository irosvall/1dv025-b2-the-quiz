/**
 * The high-score web component module.
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
      background-color: white;
    }
    h2 {
      color: rgb(46, 45, 60);
      font-size: 2em;
      text-align: center;
    }
    table {
      margin: 0 auto;
      width: 330px;
      max-width: 100%;
      border-collapse: collapse;
    }
    table th {
      color: rgb(26, 25, 40);
      font-size: 1.3em;
      text-align: left;
      border-bottom: solid 1px rgb(56, 55, 80);
    }
    table td {
      font-size: 1.2em;
      padding-top: 1em;
    }
  </style>

  <h2>High Score</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table> 
`

/**
 * Define custom element.
 */
customElements.define('high-score',
  /**
   * Represents a high-score custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a high-score custom element.
     *
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /**
       * The tbody element to contain the high scores.
       *
       * @type {HTMLElement}
       */
      this._tbody = this.shadowRoot.querySelector('tbody')

      /**
       * The highscores presented as objects in an array.
       *
       * @type {{name: string, score: number}[]} An array of highscore objects.
       */
      this._highScores = []
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (window.localStorage.getItem('quiz-highscore')) {
        this._highScores = JSON.parse(window.localStorage.getItem('quiz-highscore'))
        this._updateHighScores()
      }
    }

    /**
     * Check if the new score gets on the high score and if so update the high score list and render.
     *
     * @param {{name: string, score: number}} value - The score.
     */
    newScore (value) {
      debugger
      if (typeof value === 'object') {
        // If no high scores, push the score instantly to the high score list.
        if (this._highScores.length === 0) {
          this._highScores.push(value)
          this._updateHighScores()
          return
        }
        // If score better than a highscore splice it in and take away worst highscore to keep to maximum 5 scores.
        for (const [index, highscore] of this._highScores.entries()) {
          if (value.score <= highscore.score) {
            this._highScores.splice(index, 0, value)
            if (this._highScores.length === 6) {
              this._highScores.splice(5, 1)
            }
            this._updateHighScores()
            return
          }
        }
        // If score isn't better than any high score, but list is under 5 scores, push it last to the list.
        if (this._highScores.length < 5) {
          this._highScores.push(value)
          this._updateHighScores()
        }
      }
    }

    /**
     * Updates the local Webb Storage and the rendering.
     */
    _updateHighScores () {
      window.localStorage.setItem('quiz-highscore', JSON.stringify(this._highScores))
      this._renderHighScores()
    }

    /**
     * Renders the high scores into tr elements.
     */
    _renderHighScores () {
      this._tbody.textContent = ''

      const fragment = document.createDocumentFragment()
      for (const highscore of this._highScores) {
        const tr = document.createElement('tr')
        const name = document.createElement('td')
        name.textContent = `${highscore.name}`
        const score = document.createElement('td')
        score.textContent = `${highscore.score}`
        tr.appendChild(name)
        tr.appendChild(score)
        fragment.appendChild(tr)
      }
      this._tbody.appendChild(fragment)
    }
  })
