export class Vector4 {
  #internal = new Float32Array(4);

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

  get [3](): number {
    return this.#internal[3];
  }

  set [3](val: number) {
    this.#internal[3] = val;
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

  get w(): number {
    return this.#internal[3];
  }

  set w(val: number) {
    this.#internal[3] = val;
  }

  static get negativeInfinity(): Vector4 {
    return new Vector4(Number.NEGATIVE_INFINITY);
  }

  static get positiveInfinity(): Vector4 {
    return new Vector4(Number.POSITIVE_INFINITY);
  }

  static get zero(): Vector4 {
    return new Vector4(0);
  }

  static get one(): Vector4 {
    return new Vector4(1);
  }

  constructor();
  constructor(x: number);
  constructor(x: number, y: number, z: number, w: number);
  constructor(x?: number, y?: number, z?: number, w?: number) {
    if (x !== undefined) {
      this.x = x;
      this.y = y ?? x;
      this.z = z ?? x;
      this.w = w ?? x;
    }
  }

  clone(): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  mag(): number {
    return Math.hypot(this.x, this.y, this.z, this.w);
  }

  mag2(): number {
    return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2;
  }

  normal(): Vector4 {
    return this.div(this.mag());
  }

  normalize(): Vector4 {
    return this.set(this.normal());
  }

  clamp(length: number): Vector4 {
    return this.set(this.normal().mul(length));
  }

  dot(other: Vector4): number {
    const { x, y, z, w } = this.mul(other);
    return x + y + z + w;
  }

  lerp(other: Vector4, alpha: number): Vector4 {
    return this.set(this.add(other.sub(this).mul(alpha)));
  }

  set(other: Vector4): Vector4 {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;

    return this;
  }

  neg(): Vector4 {
    return new Vector4(-this.x, -this.y, -this.z, -this.w);
  }

  add(other: number | Vector4): Vector4 {
    const { x, y, z, w } = typeof other === "number"
      ? { x: other, y: other, z: other, w: other }
      : other;

    return new Vector4(this.x + x, this.y + y, this.z + z, this.w + w);
  }

  sub(other: number | Vector4): Vector4 {
    const { x, y, z, w } = typeof other === "number"
      ? { x: other, y: other, z: other, w: other }
      : other;

    return new Vector4(this.x - x, this.y - y, this.z - z, this.w - w);
  }

  mul(other: number | Vector4): Vector4 {
    const { x, y, z, w } = typeof other === "number"
      ? { x: other, y: other, z: other, w: other }
      : other;

    return new Vector4(this.x * x, this.y * y, this.z * z, this.w * w);
  }

  div(other: number | Vector4): Vector4 {
    const { x, y, z, w } = typeof other === "number"
      ? { x: other, y: other, z: other, w: other }
      : other;

    return new Vector4(this.x / x, this.y / y, this.z / z, this.w / w);
  }

  eq(other: Vector4): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z &&
      this.w === other.w;
  }

  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) &&
      isFinite(this.w);
  }

  toArray(): [number, number, number, number] {
    return [this[0], this[1], this[2], this[3]];
  }

  toFloat32Array(): Float32Array {
    return this.#internal;
  }
}
