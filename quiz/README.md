# Quiz Engine

Data-driven quizzes inspired by team knowledge-sharing sessions. Quiz list — `index.html`, take a quiz — `quiz.html?id=<quiz-id>`.

## Local setup

`fetch` does not work over the `file://` protocol. Start an HTTP server from the repository root:

```bash
cd /path/to/pages
python3 -m http.server 8080
```

Open in your browser: [http://127.0.0.1:8080/quiz/](http://127.0.0.1:8080/quiz/)

## Adding a new quiz

1. Create `data/<quiz-id>.json` using the format below.  
   `quiz-id` must use lowercase letters, digits, and hyphens only (`a-z`, `0-9`, `-`).

2. Add an entry to `data/manifest.json`:

```json
{
  "id": "my-quiz",
  "title": "Quiz title",
  "description": "Short description for the index card",
  "icon": "🎯",
  "time": "~2 min",
  "questionCount": 5,
  "order": 6
}
```

3. Verify locally: `http://127.0.0.1:8080/quiz/quiz.html?id=my-quiz`

The `questionCount` field in the manifest must match the number of items in `questions`.

## Quiz JSON format

```json
{
  "title": "Quiz title",
  "description": "Description on the start screen",
  "icon": "🎯",
  "time": "~2 min",
  "scoreMessages": {
    "perfect": "Message at 100%",
    "good": "Message at ≥ 60%",
    "retry": "Message at < 60%"
  },
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correct": 1,
      "explanation": "General explanation (optional, fallback)",
      "correctExpl": "Explanation when correct",
      "wrongExpl": "Explanation when wrong"
    }
  ]
}
```

### Top-level fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | yes | Quiz title |
| `description` | yes | Subtitle on the start screen |
| `icon` | no | Emoji on the start screen (default 🧠) |
| `time` | no | Estimated duration, e.g. `~2 min` |
| `scoreMessages` | no | Result screen messages; generic fallbacks if omitted |
| `questions` | yes | Array of questions (minimum 1) |

### Question fields

| Field | Required | Description |
|-------|----------|-------------|
| `question` | yes | Question text |
| `options` | yes | Array of choices (2–26 items, labeled A–Z) |
| `correct` | yes | Index of the correct answer, **zero-based** (0 = A, 1 = B, …) |
| `correctExpl` | no* | Explanation when the answer is correct |
| `wrongExpl` | no* | Explanation when the answer is wrong |
| `explanation` | no | Fallback when `correctExpl` / `wrongExpl` are missing |

\* A single `explanation` is enough for both cases; `correctExpl` and `wrongExpl` take priority when present.

### Minimal question example

```json
{
  "question": "What is LoRA used for?",
  "options": ["Full fine-tuning", "Low-rank adaptation", "Quantization", "Dropout"],
  "correct": 1,
  "explanation": "LoRA adds a low-rank update to weights without retraining the full model."
}
```

## Directory layout

```
quiz/
├── index.html          # quiz list
├── quiz.html           # quiz runner
├── css/style.css
├── js/
│   ├── index.js        # loads manifest
│   └── quiz.js         # quiz logic
└── data/
    ├── manifest.json   # index registry
    └── <quiz-id>.json  # per-quiz data
```
