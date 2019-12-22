import React, { useContext } from 'react';
import { mat4 } from 'gl-matrix';
import TransformContext from '../../context/TransformContext';
import styles from './Transform.module.css';

const Transform: React.FC<{
    value: mat4
}> = ({ value, ...props }) => {
    const parentWorldTransform = useContext(TransformContext);
    // TODO: figure out of this order is correct (and how gl-matrix multiplies matrices anyway)
    const worldTransform = mat4.multiply(mat4.create(), parentWorldTransform, value);
    const transformStyle = {
        transform: `matrix3d(${value.join(',')})`,
    };

    return (
        <div style={transformStyle} className={styles.transform}>
            <TransformContext.Provider value={worldTransform}>
                { props.children }
            </TransformContext.Provider>
        </div>
    );
};

export default Transform;