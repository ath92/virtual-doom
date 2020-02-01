import React, { useState, useCallback } from 'react';
import Wall from '../Wall/Wall';
import Button from '../Button/Button';
import { vec3 } from 'gl-matrix';
import styles from './world.module.css';
import { degToRad } from '../../util/radDeg';
import Rotate from '../Transform/Rotate';
import Translate from '../Transform/Translate';
import statue from './statue.png';
import slidingDoor from './sliding-door.png';
import useTick from '../../hooks/useTick';
import Intersectable from '../Intersectable/Intersectable';
import Youtube from 'react-youtube';

// magic numbers everywhere in this file so it's easier to iterate

const Floor: React.FC = () => {
	return (
		<Translate y={1000}>
			<Rotate x={-90}>
			{
				Array(5).fill(0).map((i, x) => (
					Array(12).fill(0).map((j, y) => (
						<Translate x={x * 400 - 1000} y={y * 400} key={`${x}${y}`}>
							<div className={styles.floor}></div>
						</Translate>
					))
				))
			}
			</Rotate>
		</Translate>
	)
};

const Statue: React.FC = () => {
	return (
		<Translate z={-2750} x={650}>
			<Rotate y={-35}>
				<img src={statue} height="1000" />
			</Rotate>
		</Translate>
	);
}

const SlidingDoor: React.FC = () => {
	const [x, setX] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const targetThreshold = 2; // rounding

	const toggleOpen = (intersectionType?: string) => {
		if (intersectionType === 'click') {
			setIsOpen(!isOpen);
		}
	}
	
	useTick(() => {
		const target = isOpen ? 1000 : 0;
		if (Math.abs(x - target) < targetThreshold) {
			setX(target);
			return;
		}
		setX(x + (target - x) / 5);
	});

	return (
		<Translate x={x}>
			<Intersectable callback={toggleOpen} id="door">
				<img src={slidingDoor} width="1000" height="1000" />
			</Intersectable>
		</Translate>
	)
}

const Television: React.FC = () => {
	const [player, setPlayer] = useState<{ playVideo: () => void, pauseVideo: () => void } | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	
	const styles = { 
		width: `500px`,
		height: `320px`
	};

	const onReady = useCallback(e => {
		setPlayer(e.target);
	}, [setPlayer]);

	const onIntersection = useCallback((type?: string) => {
		if (type === 'click' && player !== null) {
			if (isPlaying) {
				player.pauseVideo();
			} else {
				player.playVideo();
			}
			setIsPlaying(!isPlaying);
		}
	}, [player, setIsPlaying, isPlaying]);

	return (
		<Intersectable callback={onIntersection} id="video">
			<div style={styles}>
				<Youtube
					videoId="Lom9NVzOnKI"
					opts={{ ...styles }}
					onReady={onReady}
				></Youtube>
			</div>
		</Intersectable>
	)
}

const World: React.FC = () => {
	return (
		<Translate y={-700}>
			<Floor />
			<Button position={vec3.fromValues(0, 0, -500)} yRotation={0.5}>heya</Button>
			{/* right wall */}
			<Wall position={vec3.fromValues(1000, 0, 0)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(1000, 0, -1000)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(1000, 0, -2000)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(1000, 0, -3000)} yRotation={degToRad(90)} length={1000} />
			{/* left wall */}
			<Wall position={vec3.fromValues(-1000, 0, 0)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(-1000, 0, -1000)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(-1000, 0, -2000)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(-1000, 0, -3000)} yRotation={degToRad(90)} length={1000} />

			{/* Back wall */}
			<Wall position={vec3.fromValues(0, 0, -3000)} length={1000} />
			<Translate z={-2999} x={-1000}>
				<SlidingDoor />
			</Translate>

			<Statue />

			<Translate z={-3999} y={500}>
				<Television />
			</Translate>


		</Translate>
	);
};

export default World;
