import cn from 'classnames';
import { ChangeEvent, Fragment, KeyboardEvent } from 'react';
import Link from 'components/Link';
import { CARD_REGEX } from 'model/consts';
import { createOrOpenCard } from 'model/events';
import styles from './index.module.css';

// TODO rows count to be calculated according to CARD_HEIGHT values (with necessary adjustments for header etc)
const ROWS = 16;
const ROWS_HEIGHT = ROWS * 16 + 8; // 16 rows * 16 line height + 8px textarea padding

let autofocusAllowed = false;

window.setTimeout(() => (autofocusAllowed = true), 1000);

function getLinkMarkup(text: string) {
	const matches = text.matchAll(CARD_REGEX);

	const result = [];

	let textKey = 1;
	let markupKey = -1;
	let end = 0;

	for (const match of matches) {
		const matchStart = match.index as number;
		const matchText = match[0] as string;

		const leadingText = text.slice(end, matchStart);
		if (leadingText) {
			result.push(<Fragment key={textKey++}>{leadingText}</Fragment>);
		}

		end = matchStart + matchText.length;

		const trimmed = text.slice(matchStart + 1, end - 1);

		result.push(<Link key={markupKey--}>{trimmed}</Link>);
	}

	const trailingText = text.slice(end);
	if (trailingText) {
		result.push(<Fragment key={textKey++}>{trailingText}</Fragment>);
	}

	return result;
}

type Props = {
	value: string;
	onChange: (value: string) => void;
	onFocus: () => void;
};

function TextAreaWithLinks(props: Props) {
	const { value, onChange, onFocus } = props;

	function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
		if (event.target.scrollHeight > ROWS_HEIGHT) {
			console.warn('Too large text');
			return;
		}

		onChange(event.target.value);
	}

	function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.code !== 'Enter' || !(event.ctrlKey || event.metaKey || event.altKey)) return;

		event.preventDefault();

		const target = event.target as HTMLTextAreaElement;
		const cursorAt = target.selectionStart;

		const matches = value.matchAll(CARD_REGEX);

		for (const match of matches) {
			const start = match.index as number;
			const text = match[0] as string;

			if (cursorAt >= start && cursorAt <= start + text.length) {
				const trimmed = text.slice(1, text.length - 1);
				createOrOpenCard(trimmed);
				break;
			}
		}
	}

	return (
		<div className={styles.container}>
			<textarea
				rows={ROWS}
				className={cn(styles.box, styles.textArea)}
				value={value}
				onChange={handleChange}
				onKeyDown={onKeyDown}
				placeholder="Start typing..."
				autoFocus={autofocusAllowed}
				onFocus={onFocus}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck="false"
			/>

			<div className={cn(styles.box, styles.linkArea)}>{getLinkMarkup(value)}</div>
		</div>
	);
}

export default TextAreaWithLinks;
