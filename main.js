const STORAGE_KEY='memory-game-results';
const backImg='assets/images/card-back.webp';
const game = {
    moves:0, // number of moves
    pairs:0, // completed pairs state
    first:null,
    locked:false,
    timer: null,
}
const images=[
    'assets/images/dog-1-cocker.webp',
    'assets/images/dog-2-retriever.webp',
    'assets/images/dog-3-beagle.webp',
    'assets/images/dog-4-dalmatian.webp',
    'assets/images/dog-5-shiba.webp',
    'assets/images/dog-6-poodle.webp',
    'assets/images/dog-7-bulldog.webp',
    'assets/images/dog-8-greyhound.webp',
];


const body=document.body;


function el(tag,className,...children) {
    const node=document.createElement(tag);
    if (className) node.className=className;
    node.append(...children);
    return node;
}
function shuffle(images){
    for(let i=images.length-1;i>0;i--){
        const randomIndex=Math.floor(Math.random()*(i+1));
        const temp = images[i];
        images[i] = images[randomIndex];
        images[randomIndex] = temp;
    }
}
function createCard(image){
    const img=el('img','card__img');
    const backImage=el('img','card__img');
    img.src=image;
    backImage.src=backImg;
    img.alt='dog card';
    const card=el('div','card',
        el('div','card__back',backImage),
        el('div','card__face',img));
    card.dataset.image=image;
    return card;
}



function makeDeck(images) {
    const cards =[];
    images.forEach((image)=> {
        for (let i = 0; i < 2; i++) {
            cards.push(createCard(image));
        }
    });
    shuffle(cards);
    return cards;
}
function startGame(){
    clearTimeout(game.timer);
    game.timer=null;
    game.first=null;
    game.locked=false;
    game.moves=0;
    game.pairs=0;
    board.replaceChildren(...makeDeck(images));
    updateStats();
}

function updateStats(){
    movesEl.textContent = `Ходов: ${game.moves}`;
    pairsEl.textContent = `Пар собрано: ${game.pairs} из 8`;
}

function loadResults(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveResults(results){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function addResults(results,moves,date){
    return[...results,{moves,date}]
        .sort((a,b)=>a.moves - b.moves || a.date - b.date)
        .slice(0,10);
}

function formatDate(timestamp){
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${day}.${month}.${date.getFullYear()}`;
}

function renderLeaders(results) {
    if(results.length===0) return el('p',null,"Пока нет результатов");
    const head = el('thead',null,el('tr',null,el('th',null,' Место'),el('th',null,' Ходы'),el('th',null,'Дата')));
    const rows = results.map((r,i) => el('tr',null,el('td',null,i+1),el('td',null,r.moves),el('td',null,formatDate(r.date)))
    );
    return el('table','leaders',head,el('tbody',null,...rows));
}

function finishGame(){
    if (game.moves<=12){
        openModal([el('p','victory',`Да вы читер! Вы справились за ${game.moves} хода(-ов)`)],[modalNewGame,modalClose]);
    }else if(game.moves>=22){
        openModal([el('p','victory',`Это было очень медленно, рад что вы растягивали удовольствие! Вы справились за ${game.moves} хода(-ов)`)],[modalNewGame,modalClose]);
    }else {
        openModal([el('p','victory',`Победа! Вы справились ${game.moves} хода(-ов)`)],[modalNewGame,modalClose])
    }
    saveResults(addResults(loadResults(),game.moves,Date.now()));
}

function pick(card){
    if(card===null||game.locked||card.classList.contains('is-open')) return;
    card.classList.add('is-open');
    if (!game.first) {
        game.first = card;
        return;
    }
    const a = game.first;
    const b = card;
    game.first = null;
    game.moves++;
    if (a.dataset.image === b.dataset.image) {
        a.classList.add('is-matched');
        b.classList.add('is-matched');
        game.pairs++;
        if (game.pairs===8) {
            updateStats();
            finishGame();}
    } else {
        game.locked = true;
        game.timer = setTimeout(() => {
            a.classList.remove('is-open');
            b.classList.remove('is-open');
            game.locked = false;
            game.timer = null;
        }, 1000);
    }
    updateStats();
}

function openModal(content, actions){
    modalBody.replaceChildren(...content);
    modalActions.replaceChildren(...actions)
    modal.showModal();
}

function closeModal(){
    modal.close();
}


const movesEl=el('span','move__count');
const pairsEl=el('span','pair__count');
const statsEl = el('div','stats',movesEl,pairsEl);
const newGameBtn=el('button','newGame__button','Новая игра');
const leaderBoardBtn=el('button','leaderboard__button','Таблица лидеров');
const header=el('header','header',leaderBoardBtn,newGameBtn,statsEl);
const modal=el('dialog','modal');
const modalNewGame =el('button','newGame__button','Новая игра');
const modalClose=el('button','close','Закрыть');
const modalActions=el('div','modal__controls');
const modalBody=el('div','modal__body');
modalClose.type='button';

newGameBtn.setAttribute('type','button');
leaderBoardBtn.setAttribute('type','button');

const board= el('div','board');
startGame();

body.append(header,board);
modal.append(el('div','modal__box',modalBody,modalActions));
document.body.append(modal);
newGameBtn.addEventListener('click',startGame);
modalNewGame.addEventListener('click',()=>{
    closeModal();
    startGame();
});
modalClose.addEventListener('click',closeModal);

modal.addEventListener('click',(event)=>{
    if (event.target===modal) {
        closeModal()
    }
});

board.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    pick(card);
});

leaderBoardBtn.addEventListener('click',()=>{
    openModal([el('h2','modal__title','Таблица лидеров'), renderLeaders(loadResults())],[modalClose]);
});