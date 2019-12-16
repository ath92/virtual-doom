import React, { useContext } from 'react';
import Vec3 from '../../util/Vec3';
import TransformContext, { localToWorld } from '../../context/TransformContext';

interface Props {
    translate: Vec3,
}

const Transform: React.FC<Props> = ({ translate, ...props }) => {
    const parentWorldTransform = useContext(TransformContext);
    const worldTransform = localToWorld(parentWorldTransform, { translate });
    const translationStyle = {
        transform: `translate3d(${translate.x}px, ${translate.y}px, ${translate.z}px)`,
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