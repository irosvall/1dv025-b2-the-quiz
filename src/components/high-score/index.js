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

      // Get the tbody element from the shadow root.
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
        this.updateHighScores()
      }
    }

    /**
     * Check if the new score gets on the high score and if so update the high score list and render.
     *
     * @param {{name: string, score: number}} value - The score.
     */
    newScore (value) {
      if (typeof value === 'object') {
        if (this._highScores.length === 0) {
          this._highScores.push(value)
          this.updateHighScores()
          return
        }
        for (const [index, highscore] of this._highScores.entries()) {
          if (value.score <= highscore.score) {
            this._highScores.splice(index, 0, value)
            if (this._highScores.length === 6) {
              this._highScores.splice(5, 1)
            }
            this.updateHighScores()
            break
          } else if (this._highScores.length < 5) {
            this._highScores.push(value)
            this.updateHighScores()
            break
          }
        }
      }
    }

    /**
     * Updates the local Webb Storage and the rendering.
     */
    updateHighScores () {
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
