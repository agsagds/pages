document.addEventListener('DOMContentLoaded', async () => {
  const listContainer = document.getElementById('quizList');

  try {
    const response = await fetch('data/manifest.json');
    if (!response.ok) throw new Error('Manifest not found');
    const manifest = await response.json();
    const quizzes = [...manifest.quizzes].sort((a, b) => a.order - b.order);

    listContainer.replaceChildren();

    quizzes.forEach((quiz) => {
      const card = document.createElement('a');
      card.className = 'quiz-card';
      card.href = `quiz.html?id=${quiz.id}`;

      const icon = document.createElement('div');
      icon.className = 'quiz-icon';
      icon.textContent = quiz.icon;

      const info = document.createElement('div');
      info.className = 'quiz-info';

      const title = document.createElement('h3');
      title.textContent = quiz.title;

      const desc = document.createElement('p');
      desc.textContent = quiz.description;

      const meta = document.createElement('div');
      meta.className = 'quiz-meta';
      meta.textContent = `${quiz.questionCount} вопросов · ${quiz.time}`;

      info.append(title, desc, meta);

      const arrow = document.createElement('div');
      arrow.className = 'quiz-arrow';
      arrow.textContent = '→';

      card.append(icon, info, arrow);
      listContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading manifest:', error);
    listContainer.replaceChildren();
    const err = document.createElement('p');
    err.className = 'quiz-list-error';
    err.textContent = 'Не удалось загрузить список квизов. Запустите через HTTP-сервер.';
    listContainer.appendChild(err);
  }
});
