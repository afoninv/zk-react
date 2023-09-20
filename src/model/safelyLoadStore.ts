import checkStoreFormat from './checkStoreFormat';
import { Store } from './store';

function safelyLoadStore(payload: unknown): Store | null {
	try {
		const store: unknown = typeof payload === 'string' ? JSON.parse(payload) : payload;

		return checkStoreFormat(store) ? store : null;
	} catch (e) {
		console.warn('JSON parse failed');
		return null;
	}
}

export default safelyLoadStore;
