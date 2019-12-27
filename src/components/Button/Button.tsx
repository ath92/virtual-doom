import React, { useCallback } from 'react';
import { vec3, mat4 } from 'gl-matrix';
import Transform from '../Transform/Transform';
import Intersectable from '../Intersectable/Intersectable';


const Wall: React.FC<{
	position: vec3;
    yRotation?: number;
    length?: number;
}> = ({ yRotation = 0, position, length = 1000, ...props }) => {
	const transform = mat4.fromTranslation(mat4.create(), position);
    mat4.rotateY(transform, transform, yRotation); // -yRotation because y is flipped
    
    const intersectionCallback = useCallback((type?: string) => {
        if (type === 'click') {
            console.log('Im being clicked at!');
        }
    }, []);

	return (
		<Transform value={transform}>
            <Intersectable callback={intersectionCallback}>
                <button>
                    {props.children}
                </button>
            </Intersectable>
		</Transform>
	);
};

export default Wall;
