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
    img.src=image;
    img.alt='dog card';
    const card=el('div','card',
        el('div','card__back'),
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

const board= el('div','board',...makeDeck(images));

body.append(board);

