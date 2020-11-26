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
    }
  })
