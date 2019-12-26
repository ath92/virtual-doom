import React from 'react';
import styles from './Camera.module.css';
import { vec3, mat4 } from 'gl-matrix';

const up = vec3.fromValues(0, 1, 0);

const Camera: React.FC<{
    position: vec3,
    direction: vec3,
    perspective: number
}> = ({ position, direction, perspective, ...props }) => {
    const perspectiveStyle = { perspective: `${perspective}px` };
    const cameraZOffset = vec3.fromValues(0, 0, -perspective);
	const cameraPosition = vec3.add(vec3.create(), position, cameraZOffset);
	const sceneTransform = mat4.lookAt(
        mat4.create(),
        cameraPosition,
        vec3.add(
            vec3.create(),
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