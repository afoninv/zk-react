import { Store } from './store';

function checkStoreFormat(payload: unknown): payload is Store {
	return typeof payload === 'object' && payload !== null;
}

export default checkStoreFormat;
