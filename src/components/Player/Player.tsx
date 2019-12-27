import React, { useState, useEffect, useCallback, useRef } from 'react';
import useTick from '../../hooks/useTick';
import { vec3, mat4 } from 'gl-matrix';
import { getRectangleRayIntersections } from '../../collision/collision';
import Camera from '../Camera/Camera';
import LookAtContext from '../../context/LookAtContext';

// TODO: clean up maths in here

// This is based off of the perspective css property, basically controls FOV
// , but also the depth of the view frustum, so it's important to reuse this when computing the transformOrigin
const speed = 30;
const mouseSensitivity = 0.0015;

const origin = vec3.fromValues(0, 0, 0);
const forward = vec3.fromValues(0, 0, -1);
const rotateLeft = mat4.fromYRotation(mat4.create(), 0.5 * Math.PI);
const rotateRight = mat4.fromYRotation(mat4.create(), -0.5 * Math.PI);

const Player: React.FC = props => {
	const [position, setPosition] = useState(vec3.fromValues(0, 0, 0));
	const [direction, setDirection] = useState(vec3.fromValues(0, 0, 1)); // start with forward, will be changed on mousemove
	// refs for mousePosition and directionKeys so that updating doesn't cause re-render (re-render in rAF loop instead)
	const directionKeys = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	const mousePosition = useRef([0, 0]);
	const [hasPointerLock, setHasPointerLock] = useState(false);
	const [lookAt, setLookAt] = useState<string | null>(null);
	
	// keep direction keys in state so we can update position on every tick
	useEffect(() => {
		const setDirectionKey = (keyboardEvent: KeyboardEvent) => {
			const { code, type } = keyboardEvent;
			const value = type === 'keydown';
			if (code === 'KeyW') directionKeys.current.forward = value;
			if (code === 'KeyS') directionKeys.current.backward = value;
			if (code === 'KeyA') directionKeys.current.left = value;
			if (code === 'KeyD') directionKeys.current.right = value;
		};;
		window.addEventListener('keydown', setDirectionKey);
		window.addEventListener('keyup', setDirectionKey);
		return () => {
			window.removeEventListener('keydown', setDirectionKey);
			window.removeEventListener('keyup', setDirectionKey);
		};
	}, [directionKeys]);

	// change direction based on mouseMove
	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (!hasPointerLock) return;
			mousePosition.current = [
				mousePosition.current[0] + e.movementX,
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

	// update direction based on mouse position, position based on direction
	const updatePosition = useCallback(() => {
		const newDirection = vec3.clone(forward);
		vec3.rotateX(newDirection, newDirection, origin, mousePosition.current[1] * mouseSensitivity);
		vec3.rotateY(newDirection, newDirection, origin, -mousePosition.current[0] * mouseSensitivity);
		setDirection(newDirection);

		if (!directionKeys.current.forward
			&& !directionKeys.current.backward
			&& !directionKeys.current.left
			&& !directionKeys.current.right) {
			return; // return early here, we only need to update looking position.
		}

		const deltaPosition = vec3.clone(newDirection);
		vec3.scale(deltaPosition, deltaPosition, speed);

		// strafing with keys
		const diff = vec3.create();
		if (directionKeys.current.forward) vec3.add(diff, diff, deltaPosition);
		if (directionKeys.current.backward) vec3.add(diff, diff, vec3.negate(vec3.create(), deltaPosition));
		if (directionKeys.current.left) vec3.add(diff, diff, vec3.transformMat4(vec3.create(), deltaPosition, rotateLeft));
		if (directionKeys.current.right) vec3.add(diff, diff, vec3.transformMat4(vec3.create(), deltaPosition, rotateRight));
		
		setPosition(p => {
			// before updating position, check if we're going through a wall
			const distance = vec3.len(diff);
			const intersections = getRectangleRayIntersections({
				position: p,
				direction: diff
			})
			.filter(i => i.distance > 0 && i.distance < 1)
			.sort();

			const offset = 0.05; // small offset to prevent players from being able to look through elements when very close

			if (intersections.length) {
				vec3.scale(diff, diff, (intersections[0].distance - offset) / 1);
			}
			return vec3.add(vec3.create(), p, diff);
		});
	}, [directionKeys, setDirection, setPosition]);

	useEffect(() => {
		const intersections = getRectangleRayIntersections({
			position,
			direction
		})
		.filter(i => i.distance > 0)
		.sort();

		if (intersections.length) {
			setLookAt(intersections[0].key);
		}
	}, [direction, direction]);

	useEffect(() => {
		const onClick = () => {
			getRectangleRayIntersections({
				position,
				direction
			}, 'click');
		}
		window.addEventListener('click', onClick);
		return () => window.removeEventListener('click', onClick);
	}, [position, direction]);

	useTick(updatePosition);

	return (
		<Camera position={position} direction={direction} perspective={750}>
			<LookAtContext.Provider value={lookAt}>
				{props.children}
			</LookAtContext.Provider>
		</Camera>
	);
};

export default Player;
