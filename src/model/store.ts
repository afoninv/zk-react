import { createStore } from 'effector';
import { CARD_WIDTH, CARD_HEIGHT, CARD_ID_PREFIX } from './consts';
import {
	createCard,
	openCard,
	createOrOpenCard,
	moveCardToTop,
	closeCard,
	setCardPosition,
	setCardText,
	updateCardId,
	deleteCard,
	importStore,
} from './events';
import safelyLoadStore from './safelyLoadStore';

type Card = {
	id: string;
	text: string;
};

type Position = {
	top: number;
	left: number;
};

type Store = {
	cards: { [key: Card['id']]: Card };
	cardPositions: { [key: Card['id']]: Position };
	cardOrder: { [key: Card['id']]: number };
	openedCards: Card['id'][];
	closedCards: Card['id'][];
};

let storeInLS: Store;

const loadedStore = safelyLoadStore(localStorage.getItem('zk-react/v1'));
if (loadedStore === null) {
	console.warn(
		'localStorage is empty or has corrupted data; initializing with default empty state'
	);

	storeInLS = {
		cards: {},
		cardPositions: {},
		cardOrder: {},
		openedCards: [],
		closedCards: [],
	};
} else {
	storeInLS = loadedStore;
}

const store = createStore<Store>(storeInLS);

window.setInterval(function syncWithLS() {
	if (storeInLS !== store.getState()) {
		storeInLS = store.getState();
		window.localStorage.setItem('zk-react/v1', JSON.stringify(storeInLS));
	}
}, 5000);

/*
	Derived stores
*/
const cardsStore = store.map(({ cards }) => cards);
const cardPositionsStore = store.map(({ cardPositions }) => cardPositions);
const cardOrderStore = store.map(({ cardOrder }) => cardOrder);
const openedCardsStore = store.map(({ openedCards }) => openedCards);
const closedCardsStore = store.map(({ closedCards }) => closedCards);

/*
	Helper functions
*/
function randomPosition(maxTop: number, maxLeft: number) {
	return { top: Math.floor(Math.random() * maxTop), left: Math.floor(Math.random() * maxLeft) };
}
function intersects(positionA: Position, positionB: Position) {
	return (
		positionB.top + CARD_HEIGHT > positionA.top &&
		positionB.top < positionA.top + CARD_HEIGHT &&
		positionB.left + CARD_WIDTH > positionA.left &&
		positionB.left < positionA.left + CARD_WIDTH
	);
}
function findPositionForCard(
	openedCards: Card['id'][],
	cardPositions: { [key: Card['id']]: Position }
) {
	const containerDimensions = document.getElementById('main')!.getBoundingClientRect();

	const maxTop = containerDimensions.height - CARD_HEIGHT;
	const maxLeft = containerDimensions.width - CARD_WIDTH;

	let position = randomPosition(maxTop, maxLeft);

	for (let i = 0; i < 100; i++) {
		if (!openedCards.some((openedCard) => intersects(cardPositions[openedCard], position))) {
			break;
		}

		position = randomPosition(maxTop, maxLeft);
	}

	return position;
}

/*
	Event subscription
*/
function onCreateCard(state: Store, id: Card['id']) {
	if (id in state.cards) throw new Error(`Trying to create already existing card: ${id}`);

	const newCard = { id, text: '' };
	const position = findPositionForCard(state.openedCards, state.cardPositions);

	const cards = { ...state.cards, [newCard.id]: newCard };
	const openedCards = state.openedCards.concat(newCard.id);
	const cardPositions = { ...state.cardPositions, [newCard.id]: position };

	return { ...state, cards, cardPositions, openedCards };
}
store.on(createCard, onCreateCard);

function onOpenCard(state: Store, id: Card['id']) {
	if (state.openedCards.includes(id)) {
		// a bit awkward
		const textarea = document.getElementById(CARD_ID_PREFIX + id)!.querySelector('textarea')!;
		textarea.focus();
		return onMoveCardToTop(state, id);
	}

	const openedCards = state.openedCards.concat(id);
	// TODO Should we remove this card from 'Recently closed' list or not?

	return { ...state, openedCards };
}
store.on(openCard, onOpenCard);

store.on(createOrOpenCard, (state: Store, id: Card['id']) => {
	if (id in state.cards) {
		return onOpenCard(state, id);
	} else {
		return onCreateCard(state, id);
	}
});

let largestOrder = Object.values(cardOrderStore.getState()).reduce(
	(acc, order) => Math.max(acc, order),
	-1
);
function onMoveCardToTop(state: Store, id: Card['id']) {
	if (state.cardOrder[id] === largestOrder) return state;

	const cardOrder = { ...state.cardOrder, [id]: ++largestOrder };

	return { ...state, cardOrder };
}
store.on(moveCardToTop, onMoveCardToTop);

store.on(closeCard, (state: Store, id: Card['id']) => {
	const cardIdx = state.openedCards.findIndex((openedCard) => openedCard === id);
	if (cardIdx === -1) throw new Error(`Card not found when trying to close it: ${id}`);

	const openedCards = state.openedCards.filter((openedCard) => openedCard !== id);
	const closedCards = state.closedCards.filter((closedCard) => closedCard !== id);

	closedCards.push(id);
	if (closedCards.length > 10) closedCards.shift();

	return { ...state, openedCards, closedCards };
});

store.on(setCardPosition, (state: Store, payload: { id: Card['id']; position: Position }) => {
	const { id, position } = payload;

	if (!(id in state.cardPositions))
		throw new Error(`Card position not found when trying to save it: ${id}`);

	const cardPositions = { ...state.cardPositions, [id]: position };

	return { ...state, cardPositions };
});

store.on(setCardText, (state: Store, payload: { id: Card['id']; text: Card['text'] }) => {
	const { id, text } = payload;

	if (!(id in state.cards)) throw new Error(`Card not found when trying to change it: ${id}`);

	const changedCard = { ...state.cards[id], text };
	const cards = { ...state.cards, [id]: changedCard };

	return { ...state, cards };
});

store.on(updateCardId, (state: Store, payload: { oldId: Card['id']; newId: Card['id'] }) => {
	const { oldId, newId } = payload;
	if (!(oldId in state.cards))
		throw new Error(`Card not found when trying to update its id: ${oldId}`);
	if (newId in state.cards) throw new Error(`Conflict when trying to update card id: ${newId}`);

	const cards = { ...state.cards };
	const newCard = { ...cards[oldId], id: newId };
	cards[newId] = newCard;
	delete cards[oldId];

	const cardPositions = { ...state.cardPositions };
	cardPositions[newId] = cardPositions[oldId];
	delete cardPositions[oldId];

	const cardOrder = { ...state.cardOrder };
	cardOrder[newId] = cardOrder[oldId];
	delete cardOrder[oldId];

	const openedCards = state.openedCards.map((openedCard) =>
		openedCard === oldId ? newId : openedCard
	);
	const closedCards = state.closedCards.map((closedCard) =>
		closedCard === oldId ? newId : closedCard
	);

	// Explicitly NO SPREAD `...state` here, in case we add more state (so will need to update card there, too).
	return { cards, cardPositions, cardOrder, openedCards, closedCards };
});

store.on(deleteCard, (state: Store, id: Card['id']) => {
	if (!(id in state.cards)) throw new Error(`Card not found when trying to delete it: ${id}`);

	const cards = { ...state.cards };
	delete cards[id];

	const cardPositions = { ...state.cardPositions };
	delete cardPositions[id];

	const cardOrder = { ...state.cardOrder };
	delete cardOrder[id];

	const openedCards = state.openedCards.filter((openedCard) => openedCard !== id);
	const closedCards = state.closedCards.filter((closedCard) => closedCard !== id);

	// Explicitly NO SPREAD `...state` here, in case we add more state (so will need to delete card from it, too).
	return { cards, cardPositions, cardOrder, openedCards, closedCards };
});

store.on(importStore, (_: Store, payload: Store) => payload);

export {
	store as _fullStore,
	cardsStore,
	cardPositionsStore,
	cardOrderStore,
	openedCardsStore,
	closedCardsStore,
};
export type { Store, Card, Position };
