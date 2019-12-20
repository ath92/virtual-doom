import React, { useState, useEffect, useCallback, useRef } from 'react';
import TransformContext from '../../context/TransformContext';
import useTick from '../../hooks/useTick';
import { vec2, vec3, mat4 } from 'gl-matrix';
import styles from './Player.module.css';
import { getIntersectionsWithCircle } from '../Wall/wall-intersection';

// TODO: clean up maths in here

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

const Player: React.FC = props => {
	const [position, setPosition] = useState(vec3.fromValues(0, 0, 0));
	const [direction, setDirection] = useState(vec3.fromValues(0, 0, -1)); // start with forward, will be changed on mousemove
	const [directionKeys, setDirectionKeys] = useState({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	const [hasPointerLock, setHasPointerLock] = useState(false);
	const mouseX = useRef(0);

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
			// if (!hasPointerLock) return;
			mouseX.current = -e.movementX;
		};
		window.addEventListener('mousemove', onMouseMove);
		return () => window.removeEventListener('mousemove', onMouseMove);
	}, [mouseX, hasPointerLock]);

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
		const directionRotationMatrix = mat4.create();
		setDirection(d => vec3.transformMat4(vec3.create(), d, mat4.fromYRotation(directionRotationMatrix, mouseX.current * mouseSensitivity)));
		mouseX.current = 0;

		const deltaPosition = vec3.scale(vec3.create(), direction, speed);

		// strafing with keys
		const p2 = vec3.create();
		if (directionKeys.forward) setPosition(p => vec3.add(p2, p, deltaPosition));
		if (directionKeys.backward) setPosition(p => vec3.add(p2, p, vec3.negate(vec3.create(), deltaPosition)));
		if (directionKeys.left) setPosition(p => vec3.add(p2, p, vec3.transformMat4(vec3.create(), deltaPosition, rotateLeft)));
		if (directionKeys.right) setPosition(p => vec3.add(p2, p, vec3.transformMat4(vec3.create(), deltaPosition, rotateRight)));
	}, [directionKeys, direction, setDirection]);

	useTick(updatePosition);

	useEffect(() => {
		console.log(position);
		const intersections = getIntersectionsWithCircle({
			position: vec2.fromValues(position[0], position[2]),
			radius: 50
		});
		if (intersections.length) {
			console.log(intersections);
		}
	}, [position]);

	const rotation = (direction[0] > 0 ? -1 : 1) * vec3.angle(direction, forward) - Math.PI;

	// negate because we're actually moving the whole world, not the player
	const playerPosition = vec3.negate(vec3.create(), position);
	const playerTransform = mat4.create();
	mat4.translate(playerTransform, playerTransform, playerPosition); // first translate
	mat4.rotateY(playerTransform, playerTransform, rotation); // then rotate

	const playerTransformStyle = {
		transform: `matrix3d(${playerTransform.join(',')})`,
		transformOrigin: `calc(50% + ${position[0]}px)
		                  calc(50% + ${position[1]}px)
		                  ${position[2]}px`
	};
	const perspectiveStyle = { perspective: `${perspective}px` };

	return (
		<div style={perspectiveStyle} className={styles.scene}>
			<div style={playerTransformStyle} className={styles.player}>
				{props.children}
			</div>
		</div>
	);
};

export default Player;
