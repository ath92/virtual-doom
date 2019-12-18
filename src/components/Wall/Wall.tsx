import React from 'react';
import { vec3, mat4 } from 'gl-matrix';
import styles from './Wall.module.css';
import Transform from '../Transform/Transform';

type Props = {
    position: vec3;
    yRotation: number
}

const Wall: React.FC<Props> = ({ yRotation, position, ...props}) => {
    const transform = mat4.create();
    mat4.rotateY(transform, transform, yRotation);
    mat4.translate(transform, transform, position);

    return (
        <Transform value={transform}>
            <div className={styles.wall}>
                {props.children}
            </div>
        </Transform>
    );
}

export default Wall;