export class Vector3 {
  #internal = new Float32Array(3);

  get [0](): number {
    return this.#internal[0];
  }

  set [0](val: number) {
    this.#internal[0] = val;
  }

  get [1](): number {
    return this.#internal[1];
  }

  set [1](val: number) {
    this.#internal[1] = val;
  }

  get [2](): number {
    return this.#internal[2];
  }

  set [2](val: number) {
    this.#internal[2] = val;
  }

  get x(): number {
    return this.#internal[0];
  }

  set x(val: number) {
    this.#internal[0] = val;
  }

  get y(): number {
    return this.#internal[1];
  }

  set y(val: number) {
    this.#internal[1] = val;
  }

  get z(): number {
    return this.#internal[2];
  }

  set z(val: number) {
    this.#internal[2] = val;
  }

  static get negativeInfinity(): Vector3 {
    return new Vector3(Number.NEGATIVE_INFINITY);
  }

  static get positiveInfinity(): Vector3 {
    return new Vector3(Number.POSITIVE_INFINITY);
  }

  static get zero(): Vector3 {
    return new Vector3(0);
  }

  static get one(): Vector3 {
    return new Vector3(1);
  }

  static get up(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  static get down(): Vector3 {
    return new Vector3(0, -1, 0);
  }

  static get left(): Vector3 {
    return new Vector3(-1, 0, 0);
  }

  static get right(): Vector3 {
    return new Vector3(1, 0, 0);
  }

  static get back(): Vector3 {
    return new Vector3(0, 0, -1);
  }

  static get forward(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  constructor();
  constructor(x: number);
  constructor(x: number, y: number, z: number);
  constructor(x?: number, y?: number, z?: number) {
    if (x !== undefined) {
      this.x = x;

      if (y !== undefined && z !== undefined) {
        this.y = y;
        this.z = z;
      } else {
        this.y = x;
        this.z = x;
      }
    }
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  mag(): number {
    return Math.hypot(this.x, this.y, this.z);
  }

  mag2(): number {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  normal(): Vector3 {
    return this.div(this.mag());
  }

  normalize(): Vector3 {
    return this.set(this.normal());
  }

  clamp(length: number): Vector3 {
    return this.set(this.normal().mul(length));
  }

  dot(other: Vector3): number {
    const { x, y, z } = this.mul(other);
    return x + y + z;
  }

  cross(other: Vector3): Vector3 {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  lerp(other: Vector3, alpha: number): Vector3 {
    return this.set(this.add(other.sub(this).mul(alpha)));
  }

  set(other: Vector3): Vector3 {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;

    return this;
  }

  neg(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  add(other: number | Vector3): Vector3 {
    const { x, y, z } = typeof other === "number"
      ? { x: other, y: other, z: other }
      : other;

    return new Vector3(this.x + x, this.y + y, this.z + z);
  }

  sub(other: number | Vector3): Vector3 {
    const { x, y, z } = typeof other === "number"
      ? { x: other, y: other, z: other }
      : other;

    return new Vector3(this.x - x, this.y - y, this.z - z);
  }

  mul(other: number | Vector3): Vector3 {
    const { x, y, z } = typeof other === "number"
      ? { x: other, y: other, z: other }
      : other;

    return new Vector3(this.x * x, this.y * y, this.z * z);
  }

  div(other: number | Vector3): Vector3 {
    const { x, y, z } = typeof other === "number"
      ? { x: other, y: other, z: other }
      : other;

    return new Vector3(this.x / x, this.y / y, this.z / z);
  }

  eq(other: Vector3): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
  }

  toArray(): [number, number, number] {
    return [this[0], this[1], this[2]];
  }

  toFloat32Array(): Float32Array {
    return this.#internal;
  }
}
