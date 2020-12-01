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

## Example
```html
   <quiz-application></quiz-application>
```