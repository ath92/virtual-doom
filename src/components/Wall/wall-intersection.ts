import { mat4, vec2 } from 'gl-matrix';

export type IntersectableWall = {
	transform: mat4;
	length?: number;
};

type Circle = {
	position: vec2;
	radius: number;
};

type CircleIntersection = {
	p1: vec2;
	p2: vec2;
};

const walls = new Map<string, IntersectableWall>();

export const register = (key: string, wall: IntersectableWall) => {
	walls.set(key, wall);
};

export const unRegister = (key: string) => {
	walls.delete(key);
};

const wallVector = vec2.fromValues(1, 0);
const circleVector = vec2.fromValues(0, 0);

const getCircleWallIntersection = (circle: Circle, wall: IntersectableWall) => {
	// translate / rotate wall vector
	vec2.transformMat4(wallVector, wallVector, wall.transform);

	return null;
};

export const getIntersectionsWithCircle = (circle: Circle) => {
	const intersections = Array<CircleIntersection>();
	for (let wall of walls.values()) {
		const intersection = getCircleWallIntersection(circle, wall);
		if (intersection) {
			intersections.push(intersection);
		}
	}
	return intersections;
};
