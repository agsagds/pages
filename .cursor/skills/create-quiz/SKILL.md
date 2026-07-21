---
name: create-quiz
description: >-
  Creates or updates data-driven quizzes under quiz/data for the pages quiz engine:
  JSON file, manifest entry, shuffled options, impersonal Russian wording, and
  correctExpl/wrongExpl. Use when the user sends quiz questions, meeting notes/
  transcript context, asks to add a quiz, shuffle answers, or make questions
  безличными; also when mentioning quiz.html, manifest.json, or knowledge-sharing quizzes.
---

# Create quiz (pages)

Build quizzes for this repo’s quiz engine. Format details: [quiz/README.md](../../../quiz/README.md).

## Defaults (unless the user overrides)

| Requirement | Default |
|-------------|---------|
| Language | Russian (match existing team quizzes) |
| Tone | **Безличные** вопросы и пояснения |
| Option order | **Shuffle** options per question; recompute `correct` |
| Explanations | Prefer `correctExpl` + `wrongExpl` |
| Scope | Implement when content is clear — do not over-clarify |
| Commit | Only if the user asks |

### Безличные формулировки

Avoid: «обсуждалось», «по словам участников», «по мнению докладчика», «на встрече», «не озвучивали».

Use: «Какой…?», «Что особенно важно…?», «Для чего полезны…?», «Какое ограничение…?»

Apply the same to `scoreMessages`, `correctExpl`, and `wrongExpl`.

### Shuffle

1. Keep the user’s correct answer text.
2. Randomize option order **per question** (different permutations).
3. Set `correct` to the new **zero-based** index.
4. In `wrongExpl`, letter hints (вариант B) must match **post-shuffle** positions (A=0 …).

## Workflow

Copy and track:

```
- [ ] Pick id / title / description / icon / time
- [ ] Write quiz/data/<id>.json
- [ ] Append entry to quiz/data/manifest.json (next order)
- [ ] Validate JSON + counts + correct indices
```

### Inputs

1. **Questions** (ideal): stem, options A–D, correct letter, why correct / why wrong.
2. **Context** (optional): meeting notes / transcript — use to tighten explanations and descriptions; do not contradict explicit correct answers.

If only a transcript is given: draft 5–10 questions from key takeaways, then apply defaults (impersonal + shuffle) and implement unless the user asked for a draft-only review.

If questions are complete: implement immediately with defaults.

### Files

1. Create `quiz/data/<quiz-id>.json`  
   - `quiz-id`: `a-z`, `0-9`, `-` only  
   - Prefer a distinct id from existing quizzes (`lora`, `peft`, `ai-assisted-dev`, …)

2. Update `quiz/data/manifest.json`:

```json
{
  "id": "<quiz-id>",
  "title": "<same as JSON title>",
  "description": "<same as JSON description>",
  "icon": "<emoji>",
  "time": "~3 мин",
  "questionCount": <N>,
  "order": <max existing order + 1>
}
```

`questionCount` **must** equal `questions.length`.

### JSON shape

```json
{
  "title": "…",
  "description": "…",
  "icon": "🧪",
  "time": "~3 мин",
  "scoreMessages": {
    "perfect": "Отлично! …",
    "good": "Хороший результат. …",
    "retry": "Перечитайте … и попробуйте снова."
  },
  "questions": [
    {
      "question": "…",
      "options": ["…", "…", "…", "…"],
      "correct": 0,
      "correctExpl": "Верно! …",
      "wrongExpl": "Неверно. … (вариант X). …"
    }
  ]
}
```

### Validate

```bash
python3 -c "
import json
qid='<quiz-id>'
q=json.load(open(f'quiz/data/{qid}.json'))
m=json.load(open('quiz/data/manifest.json'))
e=next(x for x in m['quizzes'] if x['id']==qid)
assert e['questionCount']==len(q['questions'])
for i,qq in enumerate(q['questions']):
  assert 0 <= qq['correct'] < len(qq['options']), i
print('ok', len(q['questions']))
"
```

Local check: `http://127.0.0.1:8080/quiz/quiz.html?id=<quiz-id>` (HTTP server from repo root).

## Content quality

- Plausible distractors; one clearly correct answer grounded in the provided material.
- Do not invent facts absent from questions/context.
- Avoid duplicating an existing quiz’s exact stems; new angle / session is fine.
- `time`: ~2 мин for ~5 Q, ~3–4 мин for ~8–10 Q, ~5 мин for ~12 Q.

## After create

Briefly report: id, question count, that options were shuffled, path to open the quiz. Do not commit/push unless asked.
