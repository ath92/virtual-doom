// very simple 3d vector utility
// TODO: typescript this

export default function Vec3(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vec3.prototype = {
	length() {
		return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** 0.5;
	},
	add(other) {
		return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
	},
	multiplyScalar(scalar) {
		return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
	},
	dot(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	},
	cross(other) {
		return new Vec3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x,
		);
	},
	average(other) {
		return new Vec3(
			(this.x + other.x) / 2,
			(this.y + other.y) / 2,
			(this.z + other.z) / 2,
		);
	},
	rotateAroundAxis(axis, angle) {
		// rodriguez method
		const term1 = this.multiplyScalar(Math.cos(angle));
		const term2 = this.cross(axis).multiplyScalar(Math.sin(angle));
		const term3 = axis.multiplyScalar(Math.cos(1 - angle) * this.dot(axis));
		return term1.add(term2).add(term3);
	},
	normalize() {
		return this.multiplyScalar(1 / this.length());
	},
	xAngle() {
		return Math.atan2(Math.sqrt(this.y ** 2 + this.z  ** 2), this.x);
	},
	yAngle() {
		return Math.atan2(Math.sqrt(this.z ** 2 + this.x  ** 2), this.y);
	},
	zAngle() {
		return Math.atan2(Math.sqrt(this.x ** 2 + this.y  ** 2), this.z);
	},
};