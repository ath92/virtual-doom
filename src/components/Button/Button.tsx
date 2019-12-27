import React, { useCallback, useContext, useState } from 'react';
import { vec3, mat4 } from 'gl-matrix';
import Transform from '../Transform/Transform';
import Intersectable from '../Intersectable/Intersectable';
import styles from './Button.module.css';
import uid from '../../util/uid';
import LookAtContext from '../../context/LookAtContext';


const Wall: React.FC<{
	position: vec3;
    yRotation?: number;
    length?: number;
}> = ({ yRotation = 0, position, length = 1000, ...props }) => {
    const lookAt = useContext(LookAtContext);
    const [intersectableId] = useState(uid('button'));
	const transform = mat4.fromTranslation(mat4.create(), position);
    mat4.rotateY(transform, transform, yRotation); // -yRotation because y is flipped
    
    const intersectionCallback = useCallback((type?: string) => {
        if (type === 'click') {
            console.log('Im being clicked at!');
        }
    }, []);

    const className = lookAt === intersectableId ? styles['button--hover'] : styles.button;

	return (
		<Transform value={transform}>
            <Intersectable id={intersectableId} callback={intersectionCallback}>
                <button className={className}>
                    {props.children}
                </button>
            </Intersectable>
		</Transform>
	);
};

export default Wall;
