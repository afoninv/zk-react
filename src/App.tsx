import { Overlay } from 'framerate-react';
import Aside from 'views/Aside';
import Main from 'views/Main';
import styles from './App.module.css';

const queryParams = new URLSearchParams(window.location.search);
const isDebug = queryParams.has('debug');

function App() {
	return (
		<div className={styles.container}>
			<Main className={styles.main} />

			<Aside className={styles.aside} />

			{isDebug && <Overlay />}
		</div>
	);
}

export default App;
