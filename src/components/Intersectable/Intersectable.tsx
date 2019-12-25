import React, { useContext, useCallback, useState, useEffect } from 'react';
import TransformContext from '../../context/TransformContext';
import styles from './Intersectable.module.css';
import { vec3 } from 'gl-matrix';

const origin = vec3.fromValues(0, 0, 0);
const right = vec3.fromValues(1, 0, 0);
const down = vec3.fromValues(0, 1, 0); // -1 or +1?

const Intersectable: React.FC = (props) => {
    const [dimensions, setDimensions] = useState([0, 0]);
    const worldTransform = useContext(TransformContext);
  
    const measuredRef = useCallback(node => {
        if (node !== null) {
            setDimensions([node.offsetWidth, node.offsetHeight]);
        }
    }, []);

    useEffect(() => {
        // register intersectable
        // console.log(dimensions);
        const topLeft = vec3.transformMat4(vec3.create(), origin, worldTransform);
        const bottomRight = vec3.add(
            vec3.create(),
            origin,
            vec3.scale(vec3.create(), right, dimensions[0])
        );
        vec3.add(bottomRight, bottomRight, vec3.scale(vec3.create(), down, dimensions[1]));
        vec3.transformMat4(bottomRight, bottomRight, worldTransform);
    }, [dimensions]);

    return (
        <div ref={measuredRef} className={styles.intersectable}>
            {props.children}
        </div>
    );
}

export default Intersectable;
