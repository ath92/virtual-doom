import React from 'react';
import Wall from '../Wall/Wall';
import Button from '../Button/Button';
import { vec3 } from 'gl-matrix';
import styles from './world.module.css';
import { degToRad } from '../../util/radDeg';
import Maze from '../Maze/Maze';

const World: React.FC = () => {
	return (
		<>
            <Maze></Maze>
			<div className={styles.floor} />
			<Button position={vec3.fromValues(0, 0, -500)} yRotation={0.5}>heya</Button>
			{/* <Wall position={vec3.fromValues(1000, 0, 0)} yRotation={0}>
				<Wall position={vec3.fromValues(0, 0, 0)} yRotation={degToRad(90)} />
			</Wall>
            <Wall position={vec3.fromValues(1000, 0, 1000)} yRotation={0} length={2000}></Wall>
            <Wall position={vec3.fromValues(1000, 0, -1000)} yRotation={degToRad(90)} length={2000}></Wall>
            <Wall position={vec3.fromValues(1000, 0, 0)} yRotation={degToRad(90)} length={2000}></Wall> */}
		</>
	);
};

export default World;
