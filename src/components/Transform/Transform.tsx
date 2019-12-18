import React, { useContext } from 'react';
import { mat4 } from 'gl-matrix';
import TransformContext from '../../context/TransformContext';

interface Props {
    value: mat4,
}

const Transform: React.FC<Props> = ({ value, ...props }) => {
    const parentWorldTransform = useContext(TransformContext);
    const worldTransform = mat4.multiply(mat4.create(), parentWorldTransform, value);
    const translationStyle = {
        transform: `matrix3d(${value.join(',')})`,
    };

    return (
        <div style={translationStyle}>
            <TransformContext.Provider value={worldTransform}>
                { props.children }
            </TransformContext.Provider>
        </div>
    );
};

export default Transform;