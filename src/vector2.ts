import { Rad } from "./angle.ts";
import { Vector } from "./vector.ts";

export class Vector2 extends Vector<Vector2> {
  #internal = new Float32Array(2);

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

  static get negativeInfinity(): Vector2 {
    return new Vector2(Number.NEGATIVE_INFINITY);
  }

  static get positiveInfinity(): Vector2 {
    return new Vector2(Number.POSITIVE_INFINITY);
  }

  static get zero(): Vector2 {
    return new Vector2(0);
  }

  static get one(): Vector2 {
    return new Vector2(1);
  }

  static get up(): Vector2 {
    return new Vector2(0, 1);
  }

  static get down(): Vector2 {
    return new Vector2(0, -1);
  }

  static get left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static get right(): Vector2 {
    return new Vector2(1, 0);
  }

  constructor();
  constructor(x: number);
  constructor(x: number, y: number);
  constructor(x?: number, y?: number) {
    super();

    if (x !== undefined) {
      this.x = x;

      if (y !== undefined) {
        this.y = y;
      } else {
        this.y = x;
      }
    }
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  mag(): number {
    return Math.hypot(this.x, this.y);
  }

  mag2(): number {
    return this.x ** 2 + this.y ** 2;
  }

  normal(): Vector2 {
    return this.div(this.mag());
  }

  /** Returns the angle of this Vector2 */
  angle(): Rad {
    return new Rad(Math.atan2(this.y, this.x));
  }

  clamp(length: number): Vector2 {
    return this.normal().mul(length);
  }

  dot(other: Vector2): number {
    const { x, y } = this.mul(other);
    return x + y;
  }

  lerp(other: Vector2, alpha: number): Vector2 {
    return this.add(other.sub(this).mul(alpha));
  }

  set(other: Vector2): Vector2 {
    this.x = other.x;
    this.y = other.y;

    return this;
  }

  add(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x + x, this.y + y);
  }

  sub(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x - x, this.y - y);
  }

  mul(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x * x, this.y * y);
  }

  div(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x / x, this.y / y);
  }

  neg(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  eq(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y);
  }

  toString(): string {
    return `Vector2 { x: ${this[0]}, y: ${this[1]} }`;
  }

  toArray(): [number, number] {
    return [this[0], this[1]];
  }

  toFloat32Array(): Float32Array {
    return this.#internal;
  }
}
