import { Angle } from "./angle.ts";
import { Matrix3 } from "./matrix3.ts";
import { Matrix4 } from "./matrix4.ts";
import { Vector2 } from "./vector2.ts";

export class Matrix2 {
  #internal: [Vector2, Vector2] = Object.seal([Vector2.zero(), Vector2.zero()]);

  get [0](): Vector2 {
    return this.#internal[0];
  }

  set [0](val: Vector2) {
    this.#internal[0] = val;
  }

  get [1](): Vector2 {
    return this.#internal[1];
  }

  set [1](val: Vector2) {
    this.#internal[1] = val;
  }

  get x(): Vector2 {
    return this.#internal[0];
  }

  set x(val: Vector2) {
    this.#internal[0] = val;
  }

  get y(): Vector2 {
    return this.#internal[1];
  }

  set y(val: Vector2) {
    this.#internal[1] = val;
  }

  /** Constructs a Matrix2 from individual elements */
  // deno-fmt-ignore
  static from(
    c0r0: number, c0r1: number,
    c1r0: number, c1r1: number,
  ) {
    return new Matrix2(new Vector2(c0r0, c0r1), new Vector2(c1r0, c1r1));
  }

  static fromAngle(theta: Angle): Matrix2 {
    const [s, c] = theta.sincos();
    // deno-fmt-ignore
    return Matrix2.from(
      c, s,
      -s, c
    );
  }

  static identity(): Matrix2 {
    // deno-fmt-ignore
    return Matrix2.from(
      1, 0,
      0, 1,
    );
  }

  static lookAt(dir: Vector2, up: Vector2): Matrix2 {
    const basis1 = dir.normal();
    const basis2 = up.x * dir.y >= up.y * dir.x
      ? new Vector2(basis1.y, -basis1.x)
      : new Vector2(-basis1.y, basis1.x);

    return new Matrix2(basis1, basis2);
  }

  constructor();
  constructor(x: Vector2, y: Vector2);
  constructor(x?: Vector2, y?: Vector2) {
    this.x = x ?? Vector2.zero();
    this.y = y ?? Vector2.zero();
  }

  /** Creates a new Matrix2 with the same values */
  clone(): Matrix2 {
    return new Matrix2(this.x, this.y);
  }

  transpose(): Matrix2 {
    // deno-fmt-ignore
    return Matrix2.from(
      this[0][0], this[1][0],
      this[0][1], this[1][1],
    );
  }

  eq(other: Matrix2): boolean {
    return this.x.eq(other.x) && this.y.eq(other.y);
  }

  isFinite(): boolean {
    return this.x.isFinite() && this.y.isFinite();
  }

  row(n: 0 | 1): Vector2 {
    return new Vector2(this[0][n], this[1][n]);
  }

  col(n: 0 | 1): Vector2 {
    return this[n];
  }

  diag(): [number, number] {
    return [this[0][0], this[1][1]];
  }

  trace(): number {
    return this[0][0] + this[1][1];
  }

  determinant(): number {
    return this[0][0] * this[1][1] - this[1][0] * this[0][1];
  }

  invert(): Matrix2 | undefined {
    const det = this.determinant();
    if (det !== 0) {
      // deno-fmt-ignore
      return Matrix2.from(
        this[1][1] / det, -this[0][1] / det,
        -this[1][0] / det, this[0][0] / det,
      );
    }
  }

  add(other: Matrix2 | number): Matrix2 {
    if (typeof other === "number") {
      return new Matrix2(
        this[0].add(other),
        this[1].add(other),
      )
    }

    return new Matrix2(
      this[0].add(other[0]),
      this[1].add(other[1]),
    );
  }

  sub(other: Matrix2 | number): Matrix2 {
    if (typeof other === "number") {
      return new Matrix2(
        this[0].sub(other),
        this[1].sub(other),
      )
    }

    return new Matrix2(
      this[0].sub(other[0]),
      this[1].sub(other[1]),
    );
  }

  mul(other: Matrix2 | number): Matrix2 {
    if (typeof other === "number") {
      return new Matrix2(
        this[0].mul(other),
        this[1].mul(other),
      )
    }

    // deno-fmt-ignore
    return Matrix2.from(
      this.row(0).dot(other[0]), this.row(1).dot(other[0]),
      this.row(0).dot(other[1]), this.row(1).dot(other[1]),
    );
  }

  toMatrix3(): Matrix3 {
    // deno-fmt-ignore
    return Matrix3.from(
      this[0][0], this[0][1], 0,
      this[1][0], this[1][1], 0,
      0, 0, 1,
    );
  }

  toMatrix4(): Matrix4 {
    // deno-fmt-ignore
    return Matrix4.from(
      this[0][0], this[0][1], 0, 0,
      this[1][0], this[1][1], 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  toArray(): [[number, number], [number, number]] {
    return [this[0].toArray(), this[1].toArray()];
  }

  toFloat32Array(): Float32Array {
    return new Float32Array([
      ...this[0].toFloat32Array(),
      ...this[1].toFloat32Array(),
    ]);
  }
}
