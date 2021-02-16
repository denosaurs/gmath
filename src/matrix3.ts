import { Vector3 } from "./vector3.ts";
import { Vector2 } from "./vector2.ts";
import { Matrix2 } from "./matrix2.ts";
import { Matrix4 } from "./matrix4.ts";
import { Angle } from "./angle.ts";
import { Quaternion } from "./quaternion.ts";

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

  static identity(): Matrix3 {
    return Matrix3.fromCols(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
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

  static fromAngleX(theta: Angle): Matrix3 {
    const [s, c] = theta.sincos();

    return Matrix3.fromCols(
      1,
      0,
      0,
      0,
      c,
      s,
      0,
      -s,
      c,
    );
  }

  static fromAngleY(theta: Angle): Matrix3 {
    const [s, c] = theta.sincos();

    return Matrix3.fromCols(
      c,
      0,
      -s,
      0,
      1,
      0,
      s,
      0,
      c,
    );
  }

  static fromAngleZ(theta: Angle): Matrix3 {
    const [s, c] = theta.sincos();

    return Matrix3.fromCols(
      c,
      s,
      0,
      -s,
      c,
      0,
      0,
      0,
      1,
    );
  }

  static fromAxisAngle(axis: Vector3, angle: Angle): Matrix3 {
    const [s, c] = angle.sincos();
    const c1 = 1 - c;

    return Matrix3.fromCols(
      c1 * axis.x * axis.x + c,
      c1 * axis.x * axis.y + s * axis.z,
      c1 * axis.x * axis.z - s * axis.y,
      c1 * axis.x * axis.y - s * axis.z,
      c1 * axis.y * axis.y + c,
      c1 * axis.y * axis.z + s * axis.x,
      c1 * axis.x * axis.z + s * axis.y,
      c1 * axis.y * axis.z - s * axis.x,
      c1 * axis.z * axis.z + c,
    );
  }

  static fromTranslation(translation: Vector2): Matrix3 {
    return Matrix3.fromCols(
      1,
      0,
      0,
      0,
      1,
      0,
      translation.x,
      translation.y,
      1,
    );
  }

  static fromScale(scale: number): Matrix3 {
    return this.fromNonuniformScale(scale, scale);
  }

  static fromNonuniformScale(x: number, y: number): Matrix3 {
    return Matrix3.fromCols(
      x,
      0,
      0,
      0,
      y,
      0,
      0,
      0,
      1,
    );
  }

  static fromQuaternion(quaternion: Quaternion): Matrix3 {
    const x2 = quaternion.vector.x * 2;
    const y2 = quaternion.vector.y * 2;
    const z2 = quaternion.vector.z * 2;
    
    const xx2 = x2 * quaternion.vector.x;
    const xy2 = x2 * quaternion.vector.y;
    const xz2 = x2 * quaternion.vector.z;

    const yy2 = y2 * quaternion.vector.y;
    const yz2 = y2 * quaternion.vector.z;
    const zz2 = z2 * quaternion.vector.z;

    const sy2 = y2 * quaternion.scalar;
    const sz2 = z2 * quaternion.scalar;
    const sx2 = x2 * quaternion.scalar;

    return Matrix3.fromCols(
      1 - yy2 - zz2, xy2 + sz2, xz2 - sy2,
      xy2 - sz2, 1 - xx2 - zz2, yz2 + sx2,
      xz2 + sy2, yz2 - sx2, 1 - xx2 - yy2,
    );
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

  row(n: 0 | 1 | 2): Vector3 {
    return new Vector3(this[0][n], this[1][n], this[2][n]);
  }

  col(n: 0 | 1 | 2): Vector3 {
    return this[n];
  }

  diag(): [number, number, number] {
    return [this[0][0], this[1][1], this[2][2]];
  }

  trace(): number {
    return this[0][0] + this[1][1] + this[2][2];
  }

  add(other: Matrix3): Matrix3 {
    return new Matrix3(
      this[0].add(other[0]),
      this[1].add(other[1]),
      this[2].add(other[2]),
    );
  }

  sub(other: Matrix3): Matrix3 {
    return new Matrix3(
      this[0].sub(other[0]),
      this[1].sub(other[1]),
      this[2].sub(other[2]),
    );
  }

  mul(other: Matrix3): Matrix3 {
    return Matrix3.fromCols(
      this.row(0).dot(other[0]),
      this.row(1).dot(other[0]),
      this.row(2).dot(other[0]),
      this.row(0).dot(other[1]),
      this.row(1).dot(other[1]),
      this.row(2).dot(other[1]),
      this.row(0).dot(other[2]),
      this.row(1).dot(other[2]),
      this.row(2).dot(other[2]),
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

  toArray(): [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ] {
    return [this[0].toArray(), this[1].toArray(), this[2].toArray()];
  }

  toFloat32Array(): Float32Array {
    return new Float32Array([
      ...this[0].toFloat32Array(),
      ...this[1].toFloat32Array(),
      ...this[2].toFloat32Array(),
    ]);
  }
}
