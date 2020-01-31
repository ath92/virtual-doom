import React, { useState } from 'react';
import styles from './Camera.module.css';
import { vec3, mat4 } from 'gl-matrix';

const up = vec3.fromValues(0, 1, 0);

const Camera: React.FC<{
    position: vec3,
    direction: vec3,
    perspective: number
}> = ({ position, direction, perspective, ...props }) => {
    //for reuse
    const [cameraPosition] = useState(vec3.create());
    const [sceneTransform] = useState(mat4.create());
    const [lookAt] = useState(vec3.create());

    const cameraZOffset = vec3.fromValues(0, 0, -perspective);
    const perspectiveStyle = { perspective: `${perspective}px` };

    vec3.add(cameraPosition, position, cameraZOffset);
    
	mat4.lookAt(
        sceneTransform,
        cameraPosition,
        vec3.add(
            lookAt,
            cameraPosition,
            direction
        ),
        up
    );

	const sceneTransformStyle = {
		transform: `matrix3d(${sceneTransform.join(',')})`,
		transformOrigin: `0 0 ${perspective}px`
    };
    
    return (
        <>
            <div className={styles.crosshair}></div>
            <div style={perspectiveStyle} className={styles.camera}>
                <div style={sceneTransformStyle} className={styles.scene}>
                    {props.children}
                </div>
            </div>
        </>
    );
}

export default Camera;