# &lt;quiz-question&gt;
A web component that fetches and display interactive questions for the user. If all the questions are answered correctly the user wins, but if one question gets answered wrong the user looses.

## Methods

### `getQuestion()`
A method that when called will fetch and display interactive questions till the user loose or win.

Parameters: none

Returns: undefined

### `resetQuestions()`
A method that when called will reset the URL:s that _fetchQuestion() and _fetchAnswer() uses to get the questions.

Parameters: none

Returns: undefined

## Events

| Event Name       | Fired When                     |
| ---------------- | ------------------------------ |
| `loadedQuestion` | The question has loaded.       |
| `hasLimit`       | The question has a time limit. |
| `wrongAnswer`    | The user answers wrong.        |
| `rightAnswer`    | The user answers correctly.    |
| `gameWin`        | The user wins the quiz.        |

## Example
```html
   <quiz-question></quiz-question>
```