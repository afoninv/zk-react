import { useStore } from 'effector-react';
import { createCard, openCard } from 'model/events';
import { Card, cardsStore } from 'model/store';
import styles from './index.module.css';

type Props = {
	children: Card['id'];
};

function Link(props: Props) {
	const { children: cardId } = props;

	const cards = useStore(cardsStore);

	const exists = cardId in cards;

	return (
		<span
			className={exists ? styles.link : styles.emptyLink}
			onClick={exists ? () => openCard(cardId) : () => createCard(cardId)}
		>
			[{cardId}]
		</span>
	);
}

export default Link;
