import React, { useState, useEffect, useContext } from 'react';
import { vec3, mat4, vec2 } from 'gl-matrix';
import styles from './Wall.module.css';
import Transform from '../Transform/Transform';
import Intersectable from '../Intersectable/Intersectable';


const Wall: React.FC<{
	position: vec3;
    yRotation?: number;
    length?: number;
}> = ({ yRotation = 0, position, length = 1000, ...props }) => {
	const transform = mat4.fromTranslation(mat4.create(), position);
	mat4.rotateY(transform, transform, yRotation); // -yRotation because y is flipped
    
    const style = {
        width: `${length}px`
    };

	return (
		<Transform value={transform}>
            <Intersectable>
                <div className={styles.wall} style={style}>
                    {props.children}
                </div>
            </Intersectable>
		</Transform>
	);
};

export default Wall;
