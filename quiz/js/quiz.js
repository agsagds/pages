let quizData = null;
let loadFailed = false;
let current = 0;
let score = 0;
let answered = false;

const letters = ['A', 'B', 'C', 'D'];
const QUIZ_ID_PATTERN = /^[a-z0-9-]+$/;

const DEFAULT_SCORE_MESSAGES = {
  perfect: 'Безупречно! Отличный результат!',
  good: 'Хороший результат! Есть потенциал для роста.',
  retry: 'Стоит повторить материал и попробовать снова.'
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const quizId = params.get('id');

  if (!quizId || !QUIZ_ID_PATTERN.test(quizId)) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`data/${quizId}.json`);
    if (!response.ok) throw new Error('Quiz not found');
    quizData = await response.json();
    initQuiz();
  } catch (error) {
    console.error('Error loading quiz:', error);
    loadFailed = true;
    document.getElementById('quizTitle').textContent = 'Ошибка загрузки';
    document.getElementById('quizDesc').textContent = 'Квиз не найден или повреждён';
    document.getElementById('quizMeta').textContent = '';
    document.getElementById('btnStart').disabled = true;
  }
});

function initQuiz() {
  document.title = `${quizData.title} — SA Knowledge Sharing`;
  document.getElementById('quizTitle').textContent = quizData.title;
  document.getElementById('quizDesc').textContent = quizData.description;
  document.getElementById('quizMeta').textContent =
    `${quizData.questions.length} вопросов · ${quizData.time || '~3 мин'}`;
  document.getElementById('quizIcon').textContent = quizData.icon || '🧠';
  document.getElementById('scoreTot').textContent = `/ ${quizData.questions.length}`;
}

function startQuiz() {
  if (loadFailed || !quizData) return;

  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('quizScreen').classList.add('active');
  current = 0;
  score = 0;
  render();
}

function render() {
  answered = false;
  const q = quizData.questions[current];

  document.getElementById('questionBadge').textContent = `Вопрос ${current + 1}`;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('progressCounter').textContent =
    `${current + 1} / ${quizData.questions.length}`;
  document.getElementById('progressFill').style.width =
    `${((current + 1) / quizData.questions.length) * 100}%`;

  const list = document.getElementById('optionsList');
  list.replaceChildren();

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';

    const letterSpan = document.createElement('span');
    letterSpan.className = 'opt-letter';
    letterSpan.textContent = letters[i];

    const textSpan = document.createElement('span');
    textSpan.className = 'option-text';
    textSpan.textContent = opt;

    btn.append(letterSpan, textSpan);
    btn.addEventListener('click', () => select(i));
    list.appendChild(btn);
  });

  document.getElementById('explanation').classList.remove('visible');
  document.getElementById('btnNext').classList.remove('visible');
}

function getExplanationText(q, isCorrect) {
  if (isCorrect) {
    return q.correctExpl || q.explanation || '';
  }
  return q.wrongExpl || q.explanation || '';
}

function select(idx) {
  if (answered) return;
  answered = true;

  const q = quizData.questions[current];
  const btns = document.querySelectorAll('.option-btn');
  const isCorrect = idx === q.correct;

  btns.forEach((b, i) => {
    b.classList.add('disabled');
    if (i === q.correct) b.classList.add('correct');
    if (i === idx && !isCorrect) b.classList.add('wrong', 'shake');
  });

  if (isCorrect) score++;

  const header = document.getElementById('expHeader');
  const icon = document.getElementById('expIcon');
  const title = document.getElementById('expTitle');
  const text = document.getElementById('expText');

  header.className = `exp-header ${isCorrect ? 'correct-header' : 'wrong-header'}`;
  icon.textContent = isCorrect ? '✓' : '✗';
  title.textContent = isCorrect ? 'Правильно!' : 'Неправильно';
  text.textContent = getExplanationText(q, isCorrect);

  const explanation = document.getElementById('explanation');
  explanation.classList.add('visible');
  explanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const next = document.getElementById('btnNext');
  next.textContent =
    current < quizData.questions.length - 1 ? 'Далее →' : 'Результаты';
  next.classList.add('visible');
}

function nextQuestion() {
  current++;
  if (current < quizData.questions.length) {
    render();
    document.getElementById('questionBadge').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    showResults();
  }
}

function getScoreMessage() {
  const total = quizData.questions.length;
  const percentage = (score / total) * 100;
  const messages = quizData.scoreMessages || DEFAULT_SCORE_MESSAGES;

  if (percentage === 100) return messages.perfect;
  if (percentage >= 60) return messages.good;
  return messages.retry;
}

function showResults() {
  document.getElementById('quizScreen').classList.remove('active');
  document.getElementById('resultScreen').classList.add('active');

  document.getElementById('scoreNum').textContent = score;
  document.getElementById('statCorr').textContent = score;
  document.getElementById('statWrong').textContent = quizData.questions.length - score;
  document.getElementById('scoreMsg').textContent = getScoreMessage();
}

function restartQuiz() {
  document.getElementById('resultScreen').classList.remove('active');
  document.getElementById('startScreen').classList.add('active');
  current = 0;
  score = 0;
}
