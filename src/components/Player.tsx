import React, { useState, useEffect } from 'react';
import Vec3 from '../util/Vec3';
import useTick from '../hooks/useTick';

const up = new Vec3(0, -1, 0);

const Player: React.FC = (props) => {
    const [position, setPosition] = useState(new Vec3(0, 0, 0));
    const [direction, setDirection] = useState(new Vec3(0, 0, 1)); // start with forward, will be changed on mousemove
    const [directionKeys, setDirectionKeys] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    // keep direction keys in state so we can update position on every tick
    useEffect(() => {
        const setDirectionKey = (value: boolean) => (keyboardEvent: KeyboardEvent) => {
            const { code } = keyboardEvent;
            if (code === 'KeyW') setDirectionKeys({ ...directionKeys, forward: value });
            if (code === 'KeyS') setDirectionKeys({ ...directionKeys, backward: value });
            if (code === 'KeyA') setDirectionKeys({ ...directionKeys, left: value });
            if (code === 'KeyD') setDirectionKeys({ ...directionKeys, right: value });
        }
        const setDirectionKeyToTrue = setDirectionKey(true);
        const setDirectionKeyToFalse = setDirectionKey(false);
        window.addEventListener('keydown', setDirectionKeyToTrue);
        window.addEventListener('keyup', setDirectionKeyToFalse);
        return () => {
            window.removeEventListener('keydown', setDirectionKeyToTrue);
            window.removeEventListener('keyup', setDirectionKeyToFalse);
        }
    });

    useTick(() => {
        // strafing with keys
        if (directionKeys.forward) setPosition(position.add(direction));
        if (directionKeys.backward) setPosition(position.add(direction.multiplyScalar(-1)));
        if (directionKeys.left) setPosition(position.add(direction.rotateAroundAxis(up, 0.5 * Math.PI)));
        if (directionKeys.right) setPosition(position.add(direction.rotateAroundAxis(up, -0.5 * Math.PI)));
    });

    return <></>;
}

export default Player;