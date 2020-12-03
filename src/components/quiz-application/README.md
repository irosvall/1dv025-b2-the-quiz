# &lt;quiz-application&gt;
A web component that represents a quiz game. It has a timer that counts down in seconds, a high score board that user local webb storage, and it allows both text input questions and several options questions.

## Dependencies

### `Custom elements`
```html
   <quiz-question></quiz-question>
   <high-score></high-score>
   <countdown-timer></countdown-timer>
```
## Properties

### `nickname`
The nickname the user can change.

Default value: `Anonymous`

## Methods

### `get nickname()`
A getter that gets the user's nickname.

Parameters: none

Returns: `{string} this._nickname` - The nickname.

### `set nickname()`
A setter that sets the user's nickname.

Parameters: `{string} nickname` - The nickname

Returns: Undefined

## Styling with CSS

The startWindow element (div) is styleable using the part `startWindow`.

The questionWindow element (div) is styleable using the part `questionWindow`.

The congratzWindow element (div) is styleable using the part `congratzWindow`.

The gameOverWindow element (div) is styleable using the part `gameOverWindow`.

The highScoreWindow element (div) is styleable using the part `highScoreWindow`.

The countdown-timer custom element is styleable using the part `countdown-timer`

The quiz-question custom element is styleable using the part `quiz-question`

The high-score custom element is styleable using the part `high-score`

## Example
```html
   <quiz-application></quiz-application>
```