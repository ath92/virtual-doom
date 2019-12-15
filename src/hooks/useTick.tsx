import { useEffect } from 'react';

const useTick = (callback: () => void) => {
    useEffect(() => {
        let keepGoing = true;
        const wrapper = () => {
            callback();
            if (keepGoing) requestAnimationFrame(wrapper);
        }
        wrapper();
        return () => {
            keepGoing = false;
        }
    }, [callback]);
}

export default useTick;