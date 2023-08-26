import { createEvent } from 'effector';
import { Store, Card, Position } from './store';

const createCard = createEvent<Card['id']>();
const openCard = createEvent<Card['id']>();
const createOrOpenCard = createEvent<Card['id']>();
const moveCardToTop = createEvent<Card['id']>();
const closeCard = createEvent<Card['id']>();
const setCardPosition = createEvent<{ id: Card['id']; position: Position }>();
const setCardText = createEvent<{ id: Card['id']; text: Card['text'] }>();
const updateCardId = createEvent<{ oldId: Card['id']; newId: Card['id'] }>();
const deleteCard = createEvent<Card['id']>();
const importStore = createEvent<Store>();

export {
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
};
