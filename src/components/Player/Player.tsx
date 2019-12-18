import React, { useState, useEffect, useCallback, useRef } from 'react';
import TransformContext from '../../context/TransformContext';
import useTick from '../../hooks/useTick';
import { vec3, mat4 } from 'gl-matrix';
import styles from './Player.module.css';

// const up = new Vec3(0, -1, 0); // -1 for y because browsers have origin at the top of the screen
const playerHeight = 120; // negative because again, up is negative
// This is based off of the perspective css property, basically controls FOV
// , but also the depth of the view frustum, so it's important to reuse this when computing the transformOrigin
const perspective = 750;
const speed = 30;
const mouseSensitivity = 0.05;

const forward = vec3.fromValues(0, 0, 1);
const rotateLeft = mat4.fromYRotation(mat4.create(), 0.5 * Math.PI);
const rotateRight = mat4.fromYRotation(mat4.create(), -0.5 * Math.PI);

// TODO: transform origin stuff

const Player: React.FC = props => {
	const [position, setPosition] = useState(vec3.fromValues(0, 0, 0));
	const [direction, setDirection] = useState(vec3.fromValues(0, 0, 1)); // start with forward, will be changed on mousemove
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
		const directionRotationMatrix = mat4.create();
		setDirection(d => vec3.transformMat4(vec3.create(), d, mat4.fromYRotation(directionRotationMatrix, mouseX.current.speed * mouseSensitivity)));
		// setDirection(d => d.rotateAroundAxis(up, mouseX.current.speed * mouseSensitivity));
		mouseX.current.speed = 0;

		const deltaPosition = vec3.scale(vec3.create(), direction, speed);

		// strafing with keys
		const p2 = vec3.create();
		if (directionKeys.forward) setPosition(p => vec3.add(p2, p, deltaPosition));
		if (directionKeys.backward) setPosition(p => vec3.add(p2, p, vec3.negate(vec3.create(), deltaPosition)));
		if (directionKeys.left) setPosition(p => vec3.add(p2, p, vec3.transformMat4(vec3.create(), deltaPosition, rotateLeft)));
		if (directionKeys.right) setPosition(p => vec3.add(p2, p, vec3.transformMat4(vec3.create(), deltaPosition, rotateRight)));
	}, [directionKeys, direction, setDirection]);

	useTick(updatePosition);

	const rotation = ((direction[0] > 0 ? -1 : 1) * vec3.angle(direction, forward) * 180) / Math.PI - 180;

	const playerTransformStyle = {
		transform: `
            translate3d(${-position[0]}px, ${-position[1] + playerHeight}px, ${-position[2]}px)
            rotateY(${rotation}deg)
        `,
		transformOrigin: `calc(50% + ${position[0]}px)
                          calc(50% + ${position[1]}px) 
                          ${position[2] + perspective}px`
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
