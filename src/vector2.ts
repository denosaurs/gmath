import { Rad } from "./angle.ts";

export class Vector2 {
  #internal = new Float64Array(2);

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

  normalize(): Vector2 {
    return this.set(this.normal());
  }

  angle(): Rad {
    return new Rad(Math.atan2(this.x, this.y));
  }

  clamp(length: number): Vector2 {
    return this.set(this.normal().mul(length));
  }

  dot(other: Vector2): number {
    const { x, y } = this.mul(other);
    return x + y;
  }

  cross(other: Vector2): number {
    const { x, y } = this.mul(other);
    return x - y;
  }

  lerp(other: Vector2, alpha: number): Vector2 {
    return this.set(this.add(other.sub(this).mul(alpha)));
  }

  set(other: Vector2): Vector2 {
    this.x = other.x;
    this.y = other.y;

    return this;
  }

  neg(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  add(other: number): Vector2;
  add(other: Vector2): Vector2;
  add(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x + x, this.y + y);
  }

  sub(other: number): Vector2;
  sub(other: Vector2): Vector2;
  sub(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x - x, this.y - y);
  }

  mul(other: number): Vector2;
  mul(other: Vector2): Vector2;
  mul(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x * x, this.y * y);
  }

  div(other: number): Vector2;
  div(other: Vector2): Vector2;
  div(other: number | Vector2): Vector2 {
    const { x, y } = typeof other === "number" ? { x: other, y: other } : other;

    return new Vector2(this.x / x, this.y / y);
  }

  eq(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y);
  }
}
