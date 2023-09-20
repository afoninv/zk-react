import { Card, Position, Store } from './store';

function isObject(value: unknown): value is { [key: string]: unknown } {
	return typeof value === 'object' && value !== null;
}

function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

function isString(value: unknown): value is string {
	return typeof value === 'string';
}

function isCard(value: unknown): value is Card {
	return isObject(value) && isString(value.id) && isString(value.text);
}

function isPosition(value: unknown): value is Position {
	return isObject(value) && isNumber(value.top) && isNumber(value.left);
}

function checkStoreFormat(payload: unknown): payload is Store {
	if (!isObject(payload)) return false;

	const { cards, cardPositions, cardOrder, openedCards, closedCards } = payload;

	if (!(isObject(cards) && Object.values(cards).every(isCard))) return false;
	if (!(isObject(cardPositions) && Object.values(cardPositions).every(isPosition))) return false;
	if (!(isObject(cardOrder) && Object.values(cardOrder).every(isNumber))) return false;
	if (!(isArray(openedCards) && openedCards.every(isString))) return false;
	if (!(isArray(closedCards) && closedCards.every(isString))) return false;

	return true;
}

export default checkStoreFormat;
