import { ChangeEvent, FormEvent, useRef } from 'react';
import Menu, { MenuContentProps } from 'components/Menu';
import { importStore } from 'model/events';
import safelyLoadStore from 'model/safelyLoadStore';
import { _fullStore } from 'model/store';
import styles from './index.module.css';

function MenuContent(props: MenuContentProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	function getJSON() {
		return JSON.stringify(_fullStore.getState(), null, 4);
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(getJSON()).then(() => alert('Copied')); // TODO snackbar
	}

	function download() {
		const file = new Blob([getJSON()], { type: 'application/json' });
		const objectURL = URL.createObjectURL(file);

		const a = document.createElement('a');
		a.href = objectURL;
		a.download = `zk-react-${new Date().toISOString()}.json`;

		a.click();
		URL.revokeObjectURL(objectURL);
	}

	function loadFile(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) return;

		const reader = new FileReader();

		reader.onload = () => {
			const store = safelyLoadStore(reader.result);

			if (store === null) {
				alert('Failed to load: file is empty or has corrupted data');
				props.setOpen(false);
				return;
			}

			const agree = window.confirm('Loading will overwrite your current work. Continue?');
			if (!agree) {
				props.setOpen(false);
				return;
			}

			importStore(store);
			// TODO snackbar
			props.setOpen(false);
		};

		reader.readAsText(file, 'UTF-8');
	}

	function openDialog() {
		if (!dialogRef.current) return;

		dialogRef.current.showModal();
	}

	function onTextLoad(event: FormEvent<HTMLFormElement>) {
		const target = event.target as HTMLFormElement;

		const store = safelyLoadStore(new FormData(target).get('import'));

		if (store === null) {
			alert('Failed to load: input is empty or has corrupted data');
			props.setOpen(false);
			return;
		}
		

		const agree = window.confirm('Loading will overwrite your current work. Continue?');
		if (!agree) {
			props.setOpen(false);
			return;
		}

		importStore(store);
		// TODO snackbar
		props.setOpen(false);
	}

	return (
		<>
			<button onClick={copyToClipboard} className="ghost">
				Copy to clipboard
			</button>
			<button onClick={download} className="ghost">
				Save to file
			</button>
			<hr />
			<button onClick={openDialog} className="ghost">
				Load from text...
			</button>

			<button className="ghost">
				<label className={styles.fileLabel}>
					Load from file...
					<input
						type="file"
						accept=".json,application/json"
						onChange={loadFile}
						className={styles.fileInput}
					/>
				</label>
			</button>

			<dialog ref={dialogRef}>
				<form onSubmit={onTextLoad} method="dialog">
					<p>Paste JSON content in the input field and press &quot;Load&quot;.</p>
					<input name="import" className={styles.textInput} />
					<button type="submit" className={styles.dialogButton}>
						Load
					</button>
				</form>
			</dialog>
		</>
	);
}

function Settings() {
	return <Menu content={MenuContent}>menu</Menu>;
}

export default Settings;
