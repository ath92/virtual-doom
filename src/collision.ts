import { vec3 } from 'gl-matrix';

type Intersectable = {
	position: vec3;
    topSide: vec3;
    leftSide: vec3;
};

type Ray = {
	position: vec3;
	direction: vec3;
};

// for now we're dealing with a very small number of walls,
// so it doesn't make sense to optimize this to something better (e.g. quadtree)
const intersectables = new Map<string, Intersectable>();

export const register = (key: string, intersectable: Intersectable) => {
	intersectables.set(key, intersectable);
};

export const unRegister = (key: string) => {
	intersectables.delete(key);
};

const projectOnto = (onto: vec3, vector: vec3): vec3 => {
    const scale = vec3.dot(onto, vector) / (vec3.len(onto) ** 2);
    return vec3.scale(vec3.create(), onto, scale);
}

const getRectangleRayIntersection = (ray: Ray, intersectable: Intersectable): (number | null) => {
    const P0MinusR0 = vec3.subtract(vec3.create(), intersectable.position, ray.position);
    const N = vec3.cross(vec3.create(), intersectable.topSide, intersectable.leftSide);
    const DDotN = vec3.dot(N, ray.direction);

    const P0MinusR0DotN = vec3.dot(P0MinusR0, N);

    const t = P0MinusR0DotN / DDotN;

    const P = vec3.add(vec3.create(), ray.position, vec3.scale(vec3.create(), ray.direction, t));
    const P0P = vec3.sub(vec3.create(), P, intersectable.position);

    const Q1 = projectOnto(intersectable.leftSide, P0P);
    const Q2 = projectOnto(intersectable.topSide, P0P);

    const Q1Length = vec3.length(Q1);
    const Q2Length = vec3.length(Q2);
    const leftSideLength = vec3.length(intersectable.leftSide);
    const topSideLength = vec3.length(intersectable.topSide);

    if (Q1Length >= 0 && Q1Length <= leftSideLength
        && Q2Length >= 0 && Q2Length <= topSideLength) {
        // console.log('got an intersection!');
        return t;
    }

    return null;
}

console.log(getRectangleRayIntersection(
    {
        position: vec3.fromValues(1, 1, 0),
        direction: vec3.fromValues(0, 0, 1)
    },
    {
        position: vec3.fromValues(0, 0, 1),
        topSide: vec3.fromValues(2, 0, 0),
        leftSide: vec3.fromValues(0, 2, 0)
    }
));

// expect intersection at [1, 1, 1]

export const getRectangleRayIntersections = (ray: Ray) => {
    const intersections = Array<number>();
	intersectables.forEach(intersectable => {
		const intersection = getRectangleRayIntersection(ray, intersectable);
		if (intersection) {
			intersections.push(intersection);
		}
	});
	return intersections;
};
