import React from 'react';
import Wall from '../Wall/Wall';
import Button from '../Button/Button';
import { vec3 } from 'gl-matrix';
import styles from './world.module.css';
import { degToRad } from '../../util/radDeg';
import Rotate from '../Transform/Rotate';
import Translate from '../Transform/Translate';
import statue from './statue.png';
import SlidingDoor from './SlidingDoor/SlidingDoor';
import Television from './Television/Television';

// magic numbers everywhere in this file so it's easier to iterate

const Floor: React.FC = () => {
	return (
		<Translate y={1000}>
			<Rotate x={90}>
			{
				Array(5).fill(0).map((i, x) => (
					Array(12).fill(0).map((j, y) => (
						<Translate x={x * 400 - 1000} y={y * -400} key={`${x}${y}`}>
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

const World: React.FC = () => {
	return (
		<Translate y={-700}>
			<Floor />
			<Button position={vec3.fromValues(0, 0, -500)} yRotation={0.5}>heya</Button>
			{/* right wall */}
			<Wall position={vec3.fromValues(1000, 0, -1000)} yRotation={degToRad(-90)} length={1000} />
			<Wall position={vec3.fromValues(1000, 0, -2000)} yRotation={degToRad(-90)} length={1000} />
			<Wall position={vec3.fromValues(1000, 0, -3000)} yRotation={degToRad(-90)} length={1000} />
			<Wall position={vec3.fromValues(1000, 0, -4000)} yRotation={degToRad(-90)} length={1000} />
			{/* left wall */}
			<Wall position={vec3.fromValues(-1000, 0, 0)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(-1000, 0, -1000)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(-1000, 0, -2000)} yRotation={degToRad(90)} length={1000} />
			<Wall position={vec3.fromValues(-1000, 0, -3000)} yRotation={degToRad(90)} length={1000} />

			{/* Middle wall */}
			<Wall position={vec3.fromValues(-400, 0, -3000)} length={1400} />
			<Translate z={-2999} x={-1000}>
				<SlidingDoor width={600} />
			</Translate>

			<Statue />

			<Translate z={-3799} y={500}>
				<Rotate y={-60}>
					<Television />
				</Rotate>
			</Translate>

			{/* Back wall */}
			<Wall position={vec3.fromValues(-1000, 0, -4000)} length={1000} />
			<Wall position={vec3.fromValues(0, 0, -4000)} length={1000} />
		</Translate>
	);
};

export default World;
