# &lt;countdown-timer&gt;

A web component that represents a countdown timer that counts down in seconds.

## Attributes

### `limit`

A Number attribute which, if specified, will be the starting point of the countdown timer in seconds.

Default value: `20`

## Methods

### `startTimer()`
A method that starts the timer when called. It counts down in seconds and render it as text content to the time element.

Parameters: none

Returns: undefined

### `stopTimer()`
A method that stops the timer when called. The timer interval is cleared, the timer's default value gets reset and the total time went by gets summed up.

Parameters: none

Returns: undefined

### `resetTotalTime()`
A method that the total time that's went by when called.

Parameters: none

Returns: undefined

### `get totalTime()`
A getter that gets the total time that has went by.

Parameters: none

Returns: {number} this._totalTime - The total time.

## Events

| Event Name | Fired When           |
| ---------- | -------------------- |
| `timeout`  | The time is out. |

## Example
```html
   <countdown-timer limit="8"></countdown-timer>
```