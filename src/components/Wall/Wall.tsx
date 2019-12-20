import React, { useState, useEffect, useContext } from 'react';
import { vec3, mat4, vec2 } from 'gl-matrix';
import styles from './Wall.module.css';
import Transform from '../Transform/Transform';
import TransformContext from '../../context/TransformContext';
import { register } from '../Wall/wall-intersection';
import uid from '../../util/uid';

type Props = {
	position: vec3;
	yRotation: number;
};

const length = 1000; //hard-coded in css as well, maybe paramterize

const Wall: React.FC<Props> = ({ yRotation, position, ...props }) => {
	const [wallKey] = useState(uid('wall'));
	const worldTransform = useContext(TransformContext);
	const transform = mat4.create();
	mat4.rotateY(transform, transform, yRotation);
	mat4.translate(transform, transform, position);

	useEffect(() => {
		const start = vec2.fromValues(position[0], position[2]);
		vec2.transformMat4(start, start, worldTransform);
		const end = vec2.fromValues(start[0] + Math.cos(yRotation) * length, start[1] + Math.sin(yRotation) * length);
		register(wallKey, { start, end });
	}, [position, yRotation, wallKey, worldTransform]);

	return (
		<Transform value={transform}>
			<div className={styles.wall}>{props.children}</div>
		</Transform>
	);
};

export default Wall;
