import { useStore } from 'effector-react';
import { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, useMemo, useState } from 'react';
import Link from 'components/Link';
import Menu, { MenuContentProps } from 'components/Menu';
import { closeCard, updateCardId, deleteCard, setCardText } from 'model/events';
import { Card, cardsStore } from 'model/store';
import styles from './index.module.css';

type CardMenuProps = MenuContentProps & {
	setEditMode: (value: boolean) => void;
	cardId: Card['id'];
};

function CardMenu(props: CardMenuProps) {
	const { setOpen, setEditMode, cardId } = props;

	const cards = useStore(cardsStore);

	function onDelete() {
		const backlinks: Card['id'][] = [];

		const cardIdFormatted = `[${cardId}]`;

		for (const { id, text } of Object.values(cards)) {
			if (text.includes(cardIdFormatted)) {
				backlinks.push(id);
			}
		}

		if (backlinks.length > 0 && !!cards[cardId].text.trim()) {
			const linksFormatted = backlinks.map((backlink) => `[${backlink}]`).join(', ');

			const agree = window.confirm(
				`Some cards contain link to this card: ${linksFormatted}. Are you sure you want to delete this card?`
			);

			if (!agree) {
				setOpen(false);
				return;
			}
		}

		deleteCard(cardId);
		// TODO snackbar
		setOpen(false);
	}

	function onRename() {
		setEditMode(true);
		setOpen(false);
	}

	return (
		<>
			<button onClick={onRename} className="ghost">
				Rename
			</button>
			<button onClick={onDelete} className="ghost">
				Delete card
			</button>
		</>
	);
}

const bracketsRegex = /\[|\]/;

type Props = {
	children: string;
	onMouseDown: (event: MouseEvent) => void;
	onMouseUp: (event: MouseEvent) => void;
};

function Title(props: Props) {
	const { children: cardId, onMouseDown, onMouseUp } = props;

	const cards = useStore(cardsStore);

	const [isEditMode, setEditMode] = useState(false);
	const [_cardName, setCardName] = useState(cardId);
	const cardName = _cardName.trim();

	const alreadyExists = useMemo(() => {
		return cardName in cards;
	}, [cards, cardName]);

	const hasBrackets = useMemo(() => {
		return bracketsRegex.test(cardName);
	}, [cardName]);

	const isSame = cardId === cardName;

	function cancelEdit() {
		setCardName(cardId);
		setEditMode(false);
	}

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		setCardName(event.target.value);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.code !== 'Enter') {
			if (event.code === 'Escape') cancelEdit();
			return;
		}

		if (!cardName || isSame) {
			cancelEdit();
			return;
		}

		if (alreadyExists) return;

		if (hasBrackets) return;

		// All checks passed, let's try to rename!
		const backlinks: Card['id'][] = [];

		const cardIdFormatted = `[${cardId}]`;

		for (const { id, text } of Object.values(cards)) {
			if (text.includes(cardIdFormatted)) {
				backlinks.push(id);
			}
		}

		if (backlinks.length > 0) {
			const linksFormatted = backlinks.map((backlink) => `[${backlink}]`).join(', ');

			const agree = window.confirm(
				`Some cards contain link to this card: ${linksFormatted}. Are you sure you want to rename this card?`
			);

			if (!agree) {
				cancelEdit();
				return;
			}

			const changeBacklinks = window.confirm(
				'Do you want to change those links, to keep them pointing to current card?'
			);
			if (changeBacklinks) {
				const newIdFormatted = `[${cardName}]`;
				for (const backlink of backlinks) {
					setCardText({
						id: backlink,
						text: cards[backlink].text.replaceAll(cardIdFormatted, newIdFormatted),
					});
				}
			}
		}

		updateCardId({ oldId: cardId, newId: cardName });
		cancelEdit();
	}

	function onBlur(event: FocusEvent) {
		if (event.currentTarget.contains(event.relatedTarget)) return;

		cancelEdit();
	}

	const helperText = hasBrackets ? (
		<>
			Square brackets <kbd>[</kbd> or <kbd>]</kbd> aren&apos;t allowed
		</>
	) : alreadyExists && !isSame ? (
		<>
			<Link>{cardName}</Link> already exists
		</>
	) : (
		''
	);

	function onClose(event: MouseEvent) {
		event.stopPropagation();
		closeCard(cardId);
	}

	function content(menuProps: MenuContentProps) {
		return <CardMenu {...menuProps} cardId={cardId} setEditMode={setEditMode} />;
	}

	return (
		<div className={styles.titleContainer}>
			{!isEditMode && (
				<div
					title={cardId}
					className={styles.title}
					onMouseDown={onMouseDown}
					onMouseUp={onMouseUp}
				>
					{cardId}
				</div>
			)}

			{isEditMode && (
				<div className={styles.editableTitle} tabIndex={-1} onBlur={onBlur}>
					<input
						value={_cardName}
						onChange={onChange}
						onKeyDown={onKeyDown}
						placeholder="Enter card name..."
						autoFocus
					/>
					{helperText && <div className={styles.helperText}>{helperText}</div>}
				</div>
			)}

			<Menu content={content}>
				<span className={styles.gearIcon}>⚙</span>
			</Menu>
			<button onClick={onClose}>✕</button>
		</div>
	);
}

export default Title;
