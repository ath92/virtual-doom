import { vec2 } from 'gl-matrix';

export type IntersectableWall = {
	start: vec2;
	end: vec2;
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
	// console.log(circle.position);
	return null;
};

export const getIntersectionsWithCircle = (circle: Circle) => {
	const intersections = Array<CircleIntersection>();
	walls.forEach(wall => {
		const intersection = getCircleWallIntersection(circle, wall);
		if (intersection) {
			intersections.push(intersection);
		}
	});
	return intersections;
};
