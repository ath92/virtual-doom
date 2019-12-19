import React from 'react';
import Wall from '../Wall/Wall';
import { vec3 } from 'gl-matrix';
import styles from './world.module.css';

const World: React.FC = props => {
	return (
		<>
			<div className={styles.floor} />
			<Wall position={vec3.fromValues(1000, 0, 0)} yRotation={0}>
				<Wall position={vec3.fromValues(0, 0, 0)} yRotation={0.5 * Math.PI} />
			</Wall>
		</>
	);
};

export default World;
