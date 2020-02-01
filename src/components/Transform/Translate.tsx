import React from 'react';
import Transform from './Transform';
import { vec3, mat4 } from 'gl-matrix';

const Translate: React.FC<{
    x?: number,
    y?: number,
    z?: number
}> = ({ x = 0, y = 0, z = 0, ...props}) => {
    return <Transform value={mat4.fromTranslation(mat4.create(), vec3.fromValues(x, y, z))}>
        {props.children}
    </Transform>;
};

export default Translate;