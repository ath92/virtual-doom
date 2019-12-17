import { useEffect } from 'react';

let callbacks = Array<() => void>();

const loop = () => {
	callbacks.forEach(c => c());
	requestAnimationFrame(loop);
};

loop();

const useTick = (callback: () => void) => {
	useEffect(() => {
		callbacks.push(callback);
		return () => {
			callbacks = callbacks.filter(c => c !== callback);
		};
	}, [callback]);
};

export default useTick;
