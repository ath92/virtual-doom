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
	console.log(wall);
	walls.set(key, wall);
};

export const unRegister = (key: string) => {
	walls.delete(key);
};
// https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
const getCircleWallIntersection = (circle: Circle, wall: IntersectableWall) => {
	const { position: C, radius: r } = circle;
	const { start: L, end: E } = wall;

	const f = vec2.subtract(vec2.create(), E, C);
	const d = vec2.subtract(vec2.create(), L, E);

	const a = vec2.dot(d, d);
	const b = 2 * vec2.dot(f, d);
	const c = vec2.dot(f, f) - r * r;

	let discriminant = b * b - 4 * a * c;

	if (discriminant < 0) {
		return null; // no intersection
	}

	discriminant = Math.sqrt(discriminant);

	const t1 = (-b - discriminant) / (2 * a);
	const t2 = (-b + discriminant) / (2 * a);

	if (t1 >= 0 && t1 <= 1) {
		// t1 is the intersection, and it's closer than t2
		// (since t1 uses -b - discriminant)
		// Impale, Poke
		return true;
	}

	// here t1 didn't intersect so we are either started
	// inside the sphere or completely past it
	if (t2 >= 0 && t2 <= 1) {
		// ExitWound
		return true;
	}

	// no intn: FallShort, Past, CompletelyInside
	return false;
};

export const getIntersectionsWithCircle = (circle: Circle) => {
	const intersections = Array<IntersectableWall>();
	walls.forEach(wall => {
		const intersection = getCircleWallIntersection(circle, wall);
		if (intersection) {
			intersections.push(wall);
		}
	});
	return intersections;
};
