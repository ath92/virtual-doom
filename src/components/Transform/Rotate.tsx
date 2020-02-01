import React from 'react';
import Transform from './Transform';
import { mat4, quat } from 'gl-matrix';

// Euler rotations
const Rotate: React.FC<{
    x?: number,
    y?: number,
    z?: number
}> = ({ x = 0, y = 0, z = 0, ...props }) => {
    return <Transform value={ mat4.fromQuat(mat4.create(), quat.fromEuler(quat.create(), x, y, z ))}>
        { props.children }
    </Transform>;
};

export default Rotate;