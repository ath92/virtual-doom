import React, { useState, useEffect, useContext } from 'react';
import { vec3, mat4, vec2 } from 'gl-matrix';
import styles from './Wall.module.css';
import Transform from '../Transform/Transform';
import TransformContext from '../../context/TransformContext';
import { register, unRegister } from '../Wall/wall-intersection';
import uid from '../../util/uid';

type Props = {
	position: vec3;
    yRotation?: number;
    length?: number;
};

const Wall: React.FC<Props> = ({ yRotation = 0, position, length = 1000, ...props }) => {
	const [wallKey] = useState(uid('wall'));
	const worldTransform = useContext(TransformContext);
	const transform = mat4.create();
	mat4.rotateY(transform, transform, -yRotation); // -yRotation because y is flipped
	mat4.translate(transform, transform, position);

	useEffect(() => {
		const start = vec2.fromValues(position[0], position[2]);
		vec2.transformMat4(start, start, worldTransform);
		const end = vec2.fromValues(position[0] + Math.cos(yRotation) * length, position[2] + Math.sin(yRotation) * length);
		vec2.transformMat4(end, end, worldTransform);
        register(wallKey, { start, end });
    }, [position, yRotation, wallKey, worldTransform]);

    useEffect(() => () => unRegister(wallKey), []);
    
    const style = {
        width: `${length}px`
    };

	return (
		<Transform value={transform}>
			<div className={styles.wall} style={style}>
                {props.children}
            </div>
		</Transform>
	);
};

export default Wall;
