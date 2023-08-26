import cn from 'classnames';
import { useStore } from 'effector-react';
import { ChangeEvent, FocusEvent, KeyboardEvent, useMemo, useState } from 'react';
import { createCard, openCard } from 'model/events';
import { cardsStore } from 'model/store';
import styles from './index.module.css';

type LinkProps = {
	children: string;
};

function Link(props: LinkProps) {
	const { children } = props;

	const trimmed = children.slice(1, children.length - 1);

	return (
		<span className={styles.link} onClick={() => openCard(trimmed)}>
			{children}
		</span>
	);
}

const bracketsRegex = /\[|\]/;

function CreateNewButton() {
	const cards = useStore(cardsStore);

	const [isEditMode, setEditMode] = useState(false);
	const [_cardName, setCardName] = useState('');
	const cardName = _cardName.trim();

	const alreadyExists = useMemo(() => {
		return cardName in cards;
	}, [cards, cardName]);

	const hasBrackets = useMemo(() => {
		return bracketsRegex.test(cardName);
	}, [cardName]);

	function cancelEdit() {
		setCardName('');
		setEditMode(false);
	}

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		setCardName(event.target.value);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.code === 'Enter') {
			if (!cardName.trim()) return;

			if (alreadyExists) return;

			if (hasBrackets) return;

			createCard(cardName.trim());
			cancelEdit();
		} else if (event.code === 'Escape') {
			cancelEdit();
		}

		return;
	}

	function onBlur(event: FocusEvent) {
		if (event.currentTarget.contains(event.relatedTarget)) return;

		cancelEdit();
	}

	const helperText = hasBrackets ? (
		<>
			Square brackets <kbd>[</kbd> or <kbd>]</kbd> aren&apos;t allowed
		</>
	) : alreadyExists ? (
		<>
			<Link>{`[${cardName}]`}</Link> already exists
		</>
	) : (
		''
	);

	return (
		<div className={styles.container} tabIndex={-1} onBlur={onBlur}>
			{!isEditMode && (
				<button className={cn('accent', styles.button)} onClick={() => setEditMode(true)}>
					new
				</button>
			)}

			{isEditMode && (
				<>
					<input
						value={_cardName}
						onChange={onChange}
						onKeyDown={onKeyDown}
						placeholder="Enter card name..."
						autoFocus
						className={styles.input}
					/>

					{helperText && <div className={styles.helperText}>{helperText}</div>}
				</>
			)}
		</div>
	);
}

export default CreateNewButton;
