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
    <tr>
      <th>Name</th>
      <th>Score</th>
    </tr>
    <tr id="score"></tr>
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

      // Get the table element from the shadow root.
      this._table = this.shadowRoot.querySelector('table')

      /**
       * The highscores presented as objects in an array.
       *
       * @type {{name: string, score: number}[]} An array of highscore objects.
       */
      this._highScores = []
    }

    /**
     * Sets the highscore.
     *
     * @param {{name: string, score: number}} value - The score.
     */
    set highScore (value) {
      if (typeof value === 'object') {
        if (this._highScores.length === 0) {
          this._highScores.push(value)
          this.updateLocalWebbStorage()
          return
        }
        for (const [index, highscore] of this._highScores.entries()) {
          if (value.score <= highscore.score) {
            this._highScores.splice(index, 0, value)
            if (this._highScores.length === 6) {
              this._highScores.splice(5, 1)
            }
            this.updateLocalWebbStorage()
            break
          }
        }
      }
    }

    /**
     * Updates the local Webb Storage.
     */
    updateLocalWebbStorage () {
      window.localStorage.setItem('quiz-highscore', JSON.stringify(this._highScores))
    }

    _renderHighScores () {
      
    }
  })
