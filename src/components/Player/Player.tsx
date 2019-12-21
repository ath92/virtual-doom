import React, { useState, useEffect, useCallback, useRef } from 'react';
import useTick from '../../hooks/useTick';
import { vec2, vec3, mat4 } from 'gl-matrix';
import styles from './Player.module.css';
import { getIntersectionsWithCircle } from '../Wall/wall-intersection';

// TODO: clean up maths in here

// const up = new Vec3(0, -1, 0); // -1 for y because browsers have origin at the top of the screen
// This is based off of the perspective css property, basically controls FOV
// , but also the depth of the view frustum, so it's important to reuse this when computing the transformOrigin
const perspective = 750;
const speed = 30;
const mouseSensitivity = 0.0015;

const origin = vec3.fromValues(0, 0, 0);
const forward = vec3.fromValues(0, 0, -1);
const up = vec3.fromValues(0, 1, 0);
const playerZOffset = vec3.fromValues(0, 0, -perspective);
const rotateLeft = mat4.fromYRotation(mat4.create(), 0.5 * Math.PI);
const rotateRight = mat4.fromYRotation(mat4.create(), -0.5 * Math.PI);

const Player: React.FC = props => {
	const [position, setPosition] = useState(vec3.fromValues(0, 0, 0));
	const [direction, setDirection] = useState(vec3.create()); // start with forward, will be changed on mousemove
	const [directionKeys, setDirectionKeys] = useState({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	const [hasPointerLock, setHasPointerLock] = useState(false);
	const mousePosition = useRef([0, 0]);

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
			if (!hasPointerLock) return;
			mousePosition.current = [
				mousePosition.current[0] + -e.movementX,
				mousePosition.current[1] + e.movementY
			];
		};
		window.addEventListener('mousemove', onMouseMove);
		return () => window.removeEventListener('mousemove', onMouseMove);
	}, [mousePosition, hasPointerLock]);

	// only track mouse if there is pointer lock
	useEffect(() => {
		const onPointerLockChange = () => {
			setHasPointerLock(!!document.pointerLockElement);
		};
		const body = document.querySelector('body') as HTMLBodyElement;
		const requestPointerLock = () => body.requestPointerLock();
		document.addEventListener('mousedown', requestPointerLock);
		document.addEventListener('pointerlockchange', onPointerLockChange, false);
		return () => {
			document.removeEventListener('mousedown', requestPointerLock);
			document.removeEventListener('pointerlockchange', onPointerLockChange, false);
		};
	}, []);

	const updatePosition = useCallback(() => {
		const newDirection = vec3.clone(forward);
		vec3.rotateX(newDirection, newDirection, origin, mousePosition.current[1] * mouseSensitivity);
		vec3.rotateY(newDirection, newDirection, origin, mousePosition.current[0] * mouseSensitivity);
		setDirection(newDirection);

		const deltaPosition = vec3.create();
		vec3.scale(deltaPosition, newDirection, speed);

		// strafing with keys
		const diff = vec3.create();
		if (directionKeys.forward) vec3.add(diff, diff, deltaPosition);
		if (directionKeys.backward) vec3.add(diff, diff, vec3.negate(vec3.create(), deltaPosition));
		if (directionKeys.left) vec3.add(diff, diff, vec3.transformMat4(vec3.create(), deltaPosition, rotateLeft));
		if (directionKeys.right) vec3.add(diff, diff, vec3.transformMat4(vec3.create(), deltaPosition, rotateRight));
		
		setPosition(p => {
			const p2 = vec3.add(vec3.create(), p, diff);

			const intersections = getIntersectionsWithCircle({
				position: vec2.fromValues(p2[0], p2[2]),
				radius: 50
			});

			if (intersections.length) {
				console.log(position);
				console.log(intersections);
				return p;
			} else {
				return p2;
			}
		});
	}, [directionKeys, setDirection]);

	useTick(updatePosition);
	// offset here, because we need to add {perspective} in css to prevent rotating around the eyes
	const playerPosition = vec3.add(vec3.create(), position, playerZOffset);
	const playerTransform = mat4.lookAt(mat4.create(), playerPosition, vec3.add(vec3.create(), playerPosition, direction), up);

	const playerTransformStyle = {
		transform: `matrix3d(${playerTransform.join(',')})`,
		transformOrigin: `0 0 ${perspective}px`
	};
	const perspectiveStyle = { perspective: `${perspective}px` };

	return (
		<>
			<div className={styles.crosshair}></div>
			<div style={perspectiveStyle} className={styles.scene}>
				<div style={playerTransformStyle} className={styles.player}>
					{props.children}
				</div>
			</div>
		</>
	);
};

export default Player;
