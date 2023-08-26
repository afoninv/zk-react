import cn from 'classnames';
import { useStore } from 'effector-react';
import { MouseEvent } from 'react';
import Link from 'components/Link';
import { closedCardsStore } from 'model/store';
import CreateNewButton from './CreateNewButton';
import styles from './index.module.css';
import Settings from './Settings';

type Props = {
	className: string;
};

function preventDefault(event: MouseEvent) {
	event.preventDefault();
}

function Aside(props: Props) {
	const { className } = props;

	const closedCards = useStore(closedCardsStore);

	return (
		<aside className={cn(className, styles.aside)}>
			<div className={styles.topButtons}>
				<CreateNewButton />
				<Settings />
			</div>

			<hr className={styles.hr} />

			<details open={true} onClick={preventDefault}>
				<summary>⤓ pinned</summary>

				{true && <span className={styles.noContent}>No items</span>}
			</details>

			<details open={true} onClick={preventDefault}>
				<summary>× closed</summary>

				<div className={cn(styles.detailsContent, styles.flexReverse)}>
					{closedCards.map((closedCard) => (
						<Link key={closedCard}>{closedCard}</Link>
					))}
				</div>
			</details>

			<details open={true} onClick={preventDefault}>
				<summary>▥ archive</summary>

				{true && <span className={styles.noContent}>No items</span>}
			</details>
		</aside>
	);
}

export default Aside;
