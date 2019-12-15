// very simple 3d vector utility

class Vec3 {
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	length(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
	}

	add(other: Vec3): Vec3 {
		return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	multiplyScalar(scalar: number): Vec3 {
		return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
	}

	dot(other: Vec3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	cross(other: Vec3): Vec3 {
		return new Vec3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x,
		);
	}

	average(other: Vec3): Vec3 {
		return new Vec3(
			(this.x + other.x) / 2,
			(this.y + other.y) / 2,
			(this.z + other.z) / 2,
		);
	}

	rotateAroundAxis(axis: Vec3, angle: number): Vec3 {
		// rodriguez method
		const term1 = this.multiplyScalar(Math.cos(angle));
		const term2 = this.cross(axis).multiplyScalar(Math.sin(angle));
		const term3 = axis.multiplyScalar(Math.cos(1 - angle) * this.dot(axis));
		return term1.add(term2).add(term3);
	}

	normalize(): Vec3 {
		return this.multiplyScalar(1 / this.length());
	}

	xAngle(): number {
		return Math.atan2(Math.sqrt(this.y ** 2 + this.z  ** 2), this.x);
	}

	yAngle(): number {
		return Math.atan2(Math.sqrt(this.z ** 2 + this.x  ** 2), this.y);
	}

	zAngle(): number {
		return Math.atan2(Math.sqrt(this.x ** 2 + this.y  ** 2), this.z);
	}
}

export default Vec3;