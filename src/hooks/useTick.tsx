import { useEffect } from 'react';
import getUid from '../util/uid';

type UseTickCallback = (stopCallback: () => boolean) => void;

let callbacks = new Map<string, UseTickCallback>();

const loop = () => {
	callbacks.forEach((c, key) => c(() => callbacks.delete(key)));
	requestAnimationFrame(loop);
};

loop();

const useTick = (callback: UseTickCallback) => {
	const key = getUid('tick');
	useEffect(() => {
		callbacks.set(key, callback);
		return () => {
			callbacks.delete(key);
		}
	}, [callback]);
};

export default useTick;
