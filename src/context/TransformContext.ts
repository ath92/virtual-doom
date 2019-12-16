import { createContext } from 'react';
import Vec3 from '../util/Vec3';

type Transform = {
    translate: Vec3;
}

export default createContext<Transform>({
    translate: new Vec3(0, 0, 0),
});

export const localToWorld = (localTransform: Transform, worldTransform: Transform): Transform => {
    return {
        translate: worldTransform.translate.add(localTransform.translate)
    };
}