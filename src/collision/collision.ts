import { vec3 } from 'gl-matrix';

type Intersectable = {
	position: vec3;
    topSide: vec3;
    leftSide: vec3;
    callback?: (type?: string) => void
};

type Ray = {
	position: vec3;
	direction: vec3;
};

type Intersection = {
    key: string,
    distance: number,
}

// for now we're dealing with a very small number of walls,
// so it doesn't make sense to optimize this to something better (e.g. quadtree)
const intersectables = new Map<string, Intersectable>();

export const register = (key: string, intersectable: Intersectable) => {
    intersectables.set(key, intersectable);
};

export const unRegister = (key: string) => {
    intersectables.delete(key);
};

const projectOnto = (onto: vec3, vector: vec3): vec3 | null => {
    const ontolen = vec3.len(onto);
    const scale = vec3.dot(onto, vector) / ontolen;
    if (scale < 0) return null; // we don't want to use the projection if the angle between the two is obtuse
    return vec3.scale(vec3.create(), onto, scale / ontolen);
}

// console.log(projectOnto(
//     vec3.fromValues(1, 0, 0),
//     vec3.fromValues(-1, 1, 0)
// ))

const getRectangleRayIntersection = (
    () => {
        // create a bunch of empty vec3s to reuse
        const P0MinusR0 = vec3.create();
        const N = vec3.create();
        const P = vec3.create();
        const P0P = vec3.create();
        const PP = vec3.create();
        return (ray: Ray, intersectable: Intersectable): (number | null) => {
            vec3.subtract(P0MinusR0, intersectable.position, ray.position);
            vec3.cross(N, intersectable.topSide, intersectable.leftSide);
            const DDotN = vec3.dot(ray.direction, N);

            const P0MinusR0DotN = vec3.dot(P0MinusR0, N);

            const t = P0MinusR0DotN / DDotN;

            vec3.add(P, ray.position, vec3.scale(PP, ray.direction, t));
            vec3.sub(P0P, P, intersectable.position);

            const Q1 = projectOnto(intersectable.leftSide, P0P);
            const Q2 = projectOnto(intersectable.topSide, P0P);

            if (!Q1 || !Q2) return null;

            const Q1Length = vec3.length(Q1);
            const Q2Length = vec3.length(Q2);
            const leftSideLength = vec3.length(intersectable.leftSide);
            const topSideLength = vec3.length(intersectable.topSide);

            if (Q1Length >= 0 && Q1Length <= leftSideLength
                && Q2Length >= 0 && Q2Length <= topSideLength) {
                return t;
            }

            return null;
        };
    }
)();

// console.log(getRectangleRayIntersection(
//     {
//         position: vec3.fromValues(1, -1, 0),
//         direction: vec3.fromValues(0, 0, 1)
//     },
//     {
//         position: vec3.fromValues(0, 0, 1),
//         topSide: vec3.fromValues(2, 0, 0),
//         leftSide: vec3.fromValues(0, 2, 0)
//     }
// ));

// expect no intersection

export const getRectangleRayIntersections = (ray: Ray, type?: string) => {
    const intersections = Array<Intersection>();
	intersectables.forEach((intersectable, key) => {
		const intersection = getRectangleRayIntersection(ray, intersectable);
		if (intersection && intersection > 0) {
            intersections.push({
                distance: intersection,
                key,
            });
		}
    });
    intersections.sort((a, b) => a.distance < b.distance ? -1 : 1);
    if (intersections.length) {
        const first = intersectables.get(intersections[0].key);
        if (first && first.callback) {
            first.callback(type);
        }
    }
	return intersections;
};
