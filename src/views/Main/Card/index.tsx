import { useCallback, useEffect, useMemo, useState } from 'react';
import TextAreaWithLinks from 'components/TextAreaWithLinks';
import { CARD_WIDTH, CARD_HEIGHT, CARD_ID_PREFIX } from 'model/consts';
import { moveCardToTop, setCardPosition, setCardText } from 'model/events';
import { Card, Position } from 'model/store';
import styles from './index.module.css';
import Title from './Title';

const cardStyle = { width: CARD_WIDTH, height: CARD_HEIGHT };

type Props = {
	card: Card;
	position: Position;
	order: number;
};

function CardComponent(props: Props) {
	const { card, position, order } = props;

	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);

	const mouseMoveListener = useCallback((event: MouseEvent) => {
		setDeltaX((x) => x + event.movementX);
		setDeltaY((y) => y + event.movementY);
	}, []);

	const onMouseDown = useCallback(() => {
		moveCardToTop(card.id);
	}, []);

	const onTextareaFocus = useCallback(() => {
		moveCardToTop(card.id);
	}, []);

	const onTitleCapture = useCallback(() => {
		document.addEventListener('mousemove', mouseMoveListener);
	}, []);

	const onTitleRelease = useCallback(() => {
		const newPosition = {
			left: deltaX + position.left,
			top: deltaY + position.top,
		};

		setDeltaX(0);
		setDeltaY(0);
		setCardPosition({ id: card.id, position: newPosition });

		document.removeEventListener('mousemove', mouseMoveListener);
	}, [deltaX, deltaY, position]);

	useEffect(() => {
		return () => document.removeEventListener('mousemove', mouseMoveListener);
	}, []);

	const style = useMemo(() => {
		const left = deltaX + position.left;
		const top = deltaY + position.top;

		return { ...cardStyle, left, top, zIndex: order };
	}, [position, order, deltaX, deltaY]);

	return (
		<div
			id={CARD_ID_PREFIX + card.id}
			className={styles.container}
			style={style}
			onMouseDown={onMouseDown}
		>
			<Title onMouseDown={onTitleCapture} onMouseUp={onTitleRelease}>
				{card.id}
			</Title>

			<TextAreaWithLinks
				value={card.text}
				onChange={(value) => setCardText({ id: card.id, text: value })}
				onFocus={onTextareaFocus}
			/>
		</div>
	);
}

export default CardComponent;
