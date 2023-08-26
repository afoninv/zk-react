import cn from 'classnames';
import { useStore } from 'effector-react';
import { cardsStore, cardPositionsStore, cardOrderStore, openedCardsStore } from 'model/store';
import Card from './Card';
import styles from './index.module.css';

type Props = {
	className: string;
};

function Main(props: Props) {
	const { className } = props;

	const cards = useStore(cardsStore);
	const cardPositions = useStore(cardPositionsStore);
	const cardOrder = useStore(cardOrderStore);
	const openedCards = useStore(openedCardsStore);

	return (
		<main id="main" className={cn(className, styles.container)}>
			{openedCards.map((openedCard) => {
				const card = cards[openedCard];
				const position = cardPositions[openedCard];
				const order = cardOrder[openedCard];

				return <Card card={card} position={position} order={order} key={card.id} />;
			})}
		</main>
	);
}

export default Main;
