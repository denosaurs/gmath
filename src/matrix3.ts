import { Vector3 } from "./vector3.ts";
import { Vector2 } from "./vector2.ts";
import { Matrix2 } from "./matrix2.ts";
import { Matrix4 } from "./matrix4.ts";

export class Matrix3 {
  #internal: [Vector3, Vector3, Vector3] = Object.seal([
    Vector3.zero,
    Vector3.zero,
    Vector3.zero,
  ]);

  get [0](): Vector3 {
    return this.#internal[0];
  }

  set [0](val: Vector3) {
    this.#internal[0] = val;
  }

  get [1](): Vector3 {
    return this.#internal[1];
  }

  set [1](val: Vector3) {
    this.#internal[1] = val;
  }

  get [2](): Vector3 {
    return this.#internal[2];
  }

  set [2](val: Vector3) {
    this.#internal[2] = val;
  }

  get x(): Vector3 {
    return this.#internal[0];
  }

  set x(val: Vector3) {
    this.#internal[0] = val;
  }

  get y(): Vector3 {
    return this.#internal[1];
  }

  set y(val: Vector3) {
    this.#internal[1] = val;
  }

  get z(): Vector3 {
    return this.#internal[2];
  }

  set z(val: Vector3) {
    this.#internal[2] = val;
  }

  static fromCols(
    c0r0: number,
    c0r1: number,
    c0r2: number,
    c1r0: number,
    c1r1: number,
    c1r2: number,
    c2r0: number,
    c2r1: number,
    c2r2: number,
  ) {
    return new Matrix3(
      new Vector3(c0r0, c0r1, c0r2),
      new Vector3(c1r0, c1r1, c1r2),
      new Vector3(c2r0, c2r1, c2r2),
    );
  }

  static lookToLh(dir: Vector3, up: Vector3): Matrix3 {
    dir = dir.normal();
    const side = up.cross(dir).normal();
    up = dir.cross(side).normal();

    return new Matrix3(side, up, dir).transpose();
  }

  static lookToRh(dir: Vector3, up: Vector3): Matrix3 {
    return Matrix3.lookToLh(dir.neg(), up);
  }

  static lookAtLh(eye: Vector2, center: Vector2, up: Vector2): Matrix3 {
    const dir = center.sub(eye);
    return Matrix2.lookAt(dir, up).toMatrix3();
  }

  static lookAtRh(eye: Vector2, center: Vector2, up: Vector2): Matrix3 {
    const dir = eye.sub(center);
    return Matrix2.lookAt(dir, up).toMatrix3();
  }

  constructor();
  constructor(x: Vector3, y: Vector3, z: Vector3);
  constructor(x?: Vector3, y?: Vector3, z?: Vector3) {
    this.x = x ?? Vector3.zero;
    this.y = y ?? Vector3.zero;
    this.z = z ?? Vector3.zero;
  }

  transpose(): Matrix3 {
    return Matrix3.fromCols(
      this[0][0],
      this[1][0],
      this[2][0],
      this[0][1],
      this[1][1],
      this[2][1],
      this[0][2],
      this[1][2],
      this[2][2],
    );
  }

  eq(other: Matrix3): boolean {
    return this.x.eq(other.x) && this.y.eq(other.y) && this.z.eq(other.z);
  }

  isFinite(): boolean {
    return this.x.isFinite() && this.y.isFinite() && this.z.isFinite();
  }

  mul(other: Matrix3): Matrix3 {
    return Matrix3.fromCols(
      this.x.dot(other.x),
      this.y.dot(other.x),
      this.z.dot(other.x),
      this.x.dot(other.y),
      this.y.dot(other.y),
      this.z.dot(other.y),
      this.x.dot(other.z),
      this.y.dot(other.z),
      this.z.dot(other.z),
    );
  }

  toMatrix4(): Matrix4 {
    return Matrix4.fromCols(
      this[0][0],
      this[0][1],
      this[0][2],
      0,
      this[1][0],
      this[1][1],
      this[1][2],
      0,
      this[2][0],
      this[2][1],
      this[2][2],
      0,
      0,
      0,
      0,
      1,
    );
  }
}
