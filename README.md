# Memory Game

Проект для rsschool реализован.
Игра на поиск пар: 16 карточек, 8 пар. Открой две карточки — если совпали,
они остаются открытыми. Найди все пары за наименьшее число ходов.

Deploy: https://ugorphpgo.github.io/memory-game/

## Что реализовал
- перемешивание карточек при каждой новой игре
- счётчик ходов и найденных пар
- окно победы и таблица 10 лучших результатов (хранится в localStorage)

## Как запустить локально
1. git clone https://github.com/ugorphpgo/memory-game.git
2. cd memory-game
3. git switch memory-game
4. Открыть index.html в браузере

## Технологии
Чистые HTML, CSS, JavaScript. Вся разметка создаётся через document.createElement.