/**
 * The quiz-application web component module.
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

  <div class="wrapper" id="startWindow">
    <h2>Instruction</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat totam sed distinctio? Officia reiciendis repellat necessitatibus animi ipsa in natus, harum ex optio cumque, expedita corporis quia accusamus perspiciatis facilis?</p>
    <nickname-form></nickname-form>
    <button id="startGameButton" type="button">Start game</button>
  </div>
  <div class="wrapper" id="questionWindow">
    <countdown-timer></countdown-timer>
    <h2 id="question"></h2>
  </div>
  <div class="wrapper" id="startWindow">
    <h2>Congratulations you completed the quiz!</h2>
    <p>Time/Score: </p>
    <button id="playAgainButton" type="button">Play again</button>
  </div>
  <div class="wrapper" id="gameOverWindow">
    <h2>Game Over</h2>
  </div>
  <high-score></high-score>  
`
