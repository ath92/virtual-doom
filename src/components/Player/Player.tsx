import React, { useState, useEffect, useCallback, useRef } from 'react';
import Vec3 from '../../util/Vec3';
import TransformContext from '../../context/TransformContext';
import useTick from '../../hooks/useTick';
import styles from './Player.module.css';

const up = new Vec3(0, -1, 0); // -1 for y because browsers have origin at the top of the screen
const playerHeight = 120; // negative because again, up is negative
// This is based off of the perspective css property, basically controls FOV
// , but also the depth of the view frustum, so it's important to reuse this when computing the transformOrigin
const perspective = 750;
const speed = 30;
const mouseSensitivity = 0.05;

// TODO: transform origin stuff

const Player: React.FC = props => {
	const [position, setPosition] = useState(new Vec3(0, 0, 0));
	const [direction, setDirection] = useState(new Vec3(0, 0, 1)); // start with forward, will be changed on mousemove
	const [directionKeys, setDirectionKeys] = useState({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	const mouseX = useRef({ position: 0, speed: 0 });

	// keep direction keys in state so we can update position on every tick
	useEffect(() => {
		const setDirectionKey = (value: boolean) => (keyboardEvent: KeyboardEvent) => {
			const { code } = keyboardEvent;
			if (code === 'KeyW') setDirectionKeys(d => ({ ...d, forward: value }));
			if (code === 'KeyS') setDirectionKeys(d => ({ ...d, backward: value }));
			if (code === 'KeyA') setDirectionKeys(d => ({ ...d, left: value }));
			if (code === 'KeyD') setDirectionKeys(d => ({ ...d, right: value }));
		};
		const setDirectionKeyToTrue = setDirectionKey(true);
		const setDirectionKeyToFalse = setDirectionKey(false);
		window.addEventListener('keydown', setDirectionKeyToTrue);
		window.addEventListener('keyup', setDirectionKeyToFalse);
		return () => {
			window.removeEventListener('keydown', setDirectionKeyToTrue);
			window.removeEventListener('keyup', setDirectionKeyToFalse);
		};
	}, []);

	// change direction based on mouseMove
	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			mouseX.current = { position: e.clientX, speed: mouseX.current.position - e.clientX };
		};
		window.addEventListener('mousemove', onMouseMove);
		return () => window.removeEventListener('mousemove', onMouseMove);
	}, [mouseX]);

	const updatePosition = useCallback(() => {
		setDirection(d => d.rotateAroundAxis(up, mouseX.current.speed * mouseSensitivity));
		mouseX.current.speed = 0;

		const deltaPosition = direction.multiplyScalar(speed);

		// strafing with keys
		if (directionKeys.forward) setPosition(p => p.add(deltaPosition));
		if (directionKeys.backward) setPosition(p => p.add(deltaPosition.multiplyScalar(-1)));
		if (directionKeys.left) setPosition(p => p.add(deltaPosition.rotateAroundAxis(up, 0.5 * Math.PI)));
		if (directionKeys.right) setPosition(p => p.add(deltaPosition.rotateAroundAxis(up, -0.5 * Math.PI)));
	}, [directionKeys, direction, setDirection]);

	useTick(updatePosition);

	const rotation = ((direction.x > 0 ? -1 : 1) * direction.zAngle() * 180) / Math.PI - 180;

	const playerTransformStyle = {
		transform: `
            translate3d(${-position.x}px, ${-position.y + playerHeight}px, ${-position.z}px)
            rotateY(${rotation}deg)
        `,
		transformOrigin: `calc(50% + ${position.x}px)
                          calc(50% + ${position.y}px) 
                          ${position.z + perspective}px`
	};
	const perspectiveStyle = { perspective: `${perspective}px` };

	return (
		<div style={perspectiveStyle} className={styles.scene}>
			<div style={playerTransformStyle} className={styles.player}>
				<TransformContext.Provider value={{ translate: position }}>{props.children}</TransformContext.Provider>
			</div>
		</div>
	);
};

export default Player;
