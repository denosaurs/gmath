import { Angle } from "./angle.ts";
import { Vector2 } from "./vector2.ts";

export class Matrix2 {
  #internal: [Vector2, Vector2] = Object.seal([Vector2.zero, Vector2.zero]);

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

  static fromAngle(angle: Angle): Matrix2 {
    const [s, c] = angle.sincos();
    return Matrix2.fromCols(c, s, -s, c);
  }

  static fromCols(
    c0r0: number,
    c0r1: number,
    c1r0: number,
    c1r1: number,
  ) {
    return new Matrix2(new Vector2(c0r0, c0r1), new Vector2(c1r0, c1r1));
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
    this.x = x ?? Vector2.zero;
    this.y = y ?? Vector2.zero;
  }

  transpose(): Matrix2 {
    return Matrix2.fromCols(
      this[0][0],
      this[1][0],
      this[0][1],
      this[1][1],
    );
  }

  eq(other: Matrix2): boolean {
    return this.x.eq(other.x) && this.y.eq(other.y);
  }
}
