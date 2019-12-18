import React, { useState, useCallback } from 'react';
import Wall from '../Wall/Wall';
import useTick from '../../hooks/useTick';
import { vec3 } from 'gl-matrix';
import styles from './world.module.css';

const World: React.FC = (props) => {
    const [wallRotation, setWallRotation] = useState(0);

    const updateWallRotation = useCallback(() => {
        setWallRotation(w => (w + 0.05));
    }, [setWallRotation]);
    useTick(updateWallRotation);

    return (
        <>
            <div className={styles.floor}></div>
            <Wall position={vec3.fromValues(100, 0, 0)} yRotation={wallRotation}>
                <Wall position={vec3.fromValues(0, 0, 0)} yRotation={100*Math.sin(wallRotation / 100)}>
                </Wall>
            </Wall>
        </>
    );
};

export default World;