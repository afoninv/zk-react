import { ReactNode, useState } from 'react';
import { Popover, PopoverPosition, PopoverAlign } from 'react-tiny-popover';
import styles from './index.module.css';

type Props = {
	children: ReactNode;
	content: (props: MenuContentProps) => ReactNode;
	positions?: PopoverPosition[];
	align?: PopoverAlign;
};

type MenuContentProps = {
	setOpen: (value: boolean) => void;
};

function Menu(props: Props) {
	const { children, content, positions = ['bottom'], align = 'end' } = props;

	const [isOpen, setOpen] = useState(false);

	return (
		<Popover
			isOpen={isOpen}
			positions={positions}
			align={align}
			padding={4}
			containerClassName={styles.popoverContainer}
			onClickOutside={() => setOpen(false)}
			content={<div className={styles.menu}>{content({ setOpen })}</div>}
		>
			<button onClick={() => setOpen(!isOpen)}>{children}</button>
		</Popover>
	);
}

export default Menu;
export type { MenuContentProps };
