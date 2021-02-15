import { Vector4 } from "./vector4.ts";
import { Vector3 } from "./vector3.ts";
import { Perspective } from "./projection.ts";

export class Matrix4 {
  #internal: [Vector4, Vector4, Vector4, Vector4] = Object.seal([
    Vector4.zero,
    Vector4.zero,
    Vector4.zero,
    Vector4.zero,
  ]);

  get [0](): Vector4 {
    return this.#internal[0];
  }

  set [0](val: Vector4) {
    this.#internal[0] = val;
  }

  get [1](): Vector4 {
    return this.#internal[1];
  }

  set [1](val: Vector4) {
    this.#internal[1] = val;
  }

  get [2](): Vector4 {
    return this.#internal[2];
  }

  set [2](val: Vector4) {
    this.#internal[2] = val;
  }

  get [3](): Vector4 {
    return this.#internal[3];
  }

  set [3](val: Vector4) {
    this.#internal[3] = val;
  }

  get x(): Vector4 {
    return this.#internal[0];
  }

  set x(val: Vector4) {
    this.#internal[0] = val;
  }

  get y(): Vector4 {
    return this.#internal[1];
  }

  set y(val: Vector4) {
    this.#internal[1] = val;
  }

  get z(): Vector4 {
    return this.#internal[2];
  }

  set z(val: Vector4) {
    this.#internal[2] = val;
  }

  get w(): Vector4 {
    return this.#internal[3];
  }

  set w(val: Vector4) {
    this.#internal[3] = val;
  }

  static fromCols(
    c0r0: number,
    c0r1: number,
    c0r2: number,
    c0r3: number,
    c1r0: number,
    c1r1: number,
    c1r2: number,
    c1r3: number,
    c2r0: number,
    c2r1: number,
    c2r2: number,
    c2r3: number,
    c3r0: number,
    c3r1: number,
    c3r2: number,
    c3r3: number,
  ) {
    return new Matrix4(
      new Vector4(c0r0, c0r1, c0r2, c0r3),
      new Vector4(c1r0, c1r1, c1r2, c1r3),
      new Vector4(c2r0, c2r1, c2r2, c2r3),
      new Vector4(c3r0, c3r1, c3r2, c3r3),
    );
  }

  static fromPerspective(perspective: Perspective): Matrix4 {
    if (perspective.left <= perspective.right) {
      throw new RangeError(
        `perspective.left (${perspective.right}) cannot be greater than perspective.right (${perspective.right})`,
      );
    }
    if (perspective.bottom <= perspective.top) {
      throw new RangeError(
        `perspective.bottom (${perspective.bottom}) cannot be greater than perspective.top (${perspective.top})`,
      );
    }
    if (perspective.near <= perspective.far) {
      throw new RangeError(
        `perspective.near (${perspective.near}) cannot be greater than perspective.far (${perspective.far})`,
      );
    }

    const c0r0 = (2 * perspective.near) /
      (perspective.right - perspective.left);
    const c0r1 = 0;
    const c0r2 = 0;
    const c0r3 = 0;

    const c1r0 = 0;
    const c1r1 = (2 * perspective.near) /
      (perspective.top - perspective.bottom);
    const c1r2 = 0;
    const c1r3 = 0;

    const c2r0 = (perspective.right + perspective.left) /
      (perspective.right - perspective.left);
    const c2r1 = (perspective.top + perspective.bottom) /
      (perspective.top - perspective.bottom);
    const c2r2 = -(perspective.far + perspective.near) /
      (perspective.far - perspective.near);
    const c2r3 = -1;

    const c3r0 = 0;
    const c3r1 = 0;
    const c3r2 = -(2 * perspective.far * perspective.near) /
      (perspective.far - perspective.near);
    const c3r3 = 0;

    return Matrix4.fromCols(
      c0r0,
      c0r1,
      c0r2,
      c0r3,
      c1r0,
      c1r1,
      c1r2,
      c1r3,
      c2r0,
      c2r1,
      c2r2,
      c2r3,
      c3r0,
      c3r1,
      c3r2,
      c3r3,
    );
  }

  static lookToRh(eye: Vector3, dir: Vector3, up: Vector3): Matrix4 {
    const f = dir.normal();
    const s = f.cross(up).normal();
    const u = s.cross(f);

    return Matrix4.fromCols(
      s.x,
      u.x,
      -f.x,
      0,
      s.y,
      u.y,
      -f.y,
      0,
      s.z,
      u.z,
      -f.z,
      0,
      -eye.dot(s),
      -eye.dot(u),
      eye.dot(f),
      1,
    );
  }

  static lookToLh(eye: Vector3, dir: Vector3, up: Vector3): Matrix4 {
    return Matrix4.lookToRh(eye, dir.neg(), up);
  }

  static lookAtRh(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
    return Matrix4.lookToRh(eye, center.sub(eye), up);
  }

  static lookAtLh(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
    return Matrix4.lookToLh(eye, center.sub(eye), up);
  }

  constructor();
  constructor(x: Vector4, y: Vector4, z: Vector4, w: Vector4);
  constructor(x?: Vector4, y?: Vector4, z?: Vector4, w?: Vector4) {
    this.x = x ?? Vector4.zero;
    this.y = y ?? Vector4.zero;
    this.z = z ?? Vector4.zero;
    this.w = w ?? Vector4.zero;
  }

  transpose(): Matrix4 {
    return Matrix4.fromCols(
      this[0][0],
      this[1][0],
      this[2][0],
      this[3][0],
      this[0][1],
      this[1][1],
      this[2][1],
      this[3][1],
      this[0][2],
      this[1][2],
      this[2][2],
      this[3][2],
      this[0][3],
      this[1][3],
      this[2][3],
      this[3][3],
    );
  }

  eq(other: Matrix4): boolean {
    return this.x.eq(other.x) && this.y.eq(other.y) && this.z.eq(other.z) &&
      this.w.eq(other.w);
  }

  isFinite(): boolean {
    return this.x.isFinite() && this.y.isFinite() && this.z.isFinite() &&
      this.w.isFinite();
  }

  row(n: 0 | 1 | 2 | 3): Vector4 {
    return new Vector4(this[0][n], this[1][n], this[2][n], this[3][n]);
  }

  col(n: 0 | 1 | 2 | 3): Vector4 {
    return this[n];
  }

  mul(other: Matrix4): Matrix4 {
    return Matrix4.fromCols(
      this.row(0).dot(other[0]),
      this.row(1).dot(other[0]),
      this.row(2).dot(other[0]),
      this.row(3).dot(other[0]),
      this.row(0).dot(other[1]),
      this.row(1).dot(other[1]),
      this.row(2).dot(other[1]),
      this.row(3).dot(other[1]),
      this.row(0).dot(other[2]),
      this.row(1).dot(other[2]),
      this.row(2).dot(other[2]),
      this.row(3).dot(other[2]),
      this.row(0).dot(other[3]),
      this.row(1).dot(other[3]),
      this.row(2).dot(other[3]),
      this.row(3).dot(other[3]),
    );
  }

  toArray(): [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
  ] {
    return [
      this[0].toArray(),
      this[1].toArray(),
      this[2].toArray(),
      this[3].toArray(),
    ];
  }

  toFloat32Array(): Float32Array {
    return new Float32Array([
      ...this[0].toFloat32Array(),
      ...this[1].toFloat32Array(),
      ...this[2].toFloat32Array(),
      ...this[3].toFloat32Array(),
    ]);
  }
}
