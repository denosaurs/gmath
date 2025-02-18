import type { Vector3 } from "./vector3.ts";
import type { Perspective } from "./projection.ts";
import type { Angle } from "./angle.ts";
import type { Quaternion } from "./quaternion.ts";
import type { Decomposed3 } from "./decomposed.ts";
import {
  alloc,
  dealloc,
  matrix4add,
  matrix4determinant,
  matrix4invert,
  matrix4mul,
  matrix4sub,
  memory,
} from "../wasm/mod.ts";
import { Vector4 } from "./vector4.ts";
import { Matrix3 } from "./matrix3.ts";

const SIZE = 64;
const finalizer = new FinalizationRegistry<number>((ptr) => {
  dealloc(ptr, SIZE);
});

export class Matrix4 {
  readonly ptr: number;
  #internal: Float32Array;

  get [0](): [number, number, number, number] {
    return new Proxy([
      this.#internal[0],
      this.#internal[1],
      this.#internal[2],
      this.#internal[3],
    ], {
      set: (_target, prop, value) => {
        if (prop === "0" || prop === "1" || prop === "2" || prop === "3") {
          this.#internal[prop as unknown as number] = value;
          return true;
        }
        return false;
      },
    });
  }

  set [0](val: [number, number, number, number]) {
    this.#internal[0] = val[0];
    this.#internal[1] = val[1];
    this.#internal[2] = val[2];
    this.#internal[3] = val[3];
  }

  get [1](): [number, number, number, number] {
    return new Proxy([
      this.#internal[4],
      this.#internal[5],
      this.#internal[6],
      this.#internal[7],
    ], {
      set: (_target, prop, value) => {
        if (prop === "0" || prop === "1" || prop === "2" || prop === "3") {
          this.#internal[4 + prop as unknown as number] = value;
          return true;
        }
        return false;
      },
    });
  }

  set [1](val: [number, number, number, number]) {
    this.#internal[4] = val[0];
    this.#internal[5] = val[1];
    this.#internal[6] = val[2];
    this.#internal[7] = val[3];
  }

  get [2](): [number, number, number, number] {
    return new Proxy([
      this.#internal[8],
      this.#internal[9],
      this.#internal[10],
      this.#internal[11],
    ], {
      set: (_target, prop, value) => {
        if (prop === "0" || prop === "1" || prop === "2" || prop === "3") {
          this.#internal[8 + prop as unknown as number] = value;
          return true;
        }
        return false;
      },
    });
  }

  set [2](val: [number, number, number, number]) {
    this.#internal[8] = val[0];
    this.#internal[9] = val[1];
    this.#internal[10] = val[2];
    this.#internal[11] = val[3];
  }

  get [3](): [number, number, number, number] {
    return new Proxy([
      this.#internal[12],
      this.#internal[13],
      this.#internal[14],
      this.#internal[15],
    ], {
      set: (_target, prop, value) => {
        if (prop === "0" || prop === "1" || prop === "2" || prop === "3") {
          this.#internal[12 + prop as unknown as number] = value;
          return true;
        }
        return false;
      },
    });
  }

  set [3](val: [number, number, number, number]) {
    this.#internal[12] = val[0];
    this.#internal[13] = val[1];
    this.#internal[14] = val[2];
    this.#internal[15] = val[3];
  }

  /**
   * The x-axis of the matrix
   */
  get x(): Vector4 {
    return new Vector4(...this[0]);
  }

  set x(val: Vector4) {
    this.#internal[0] = val.x;
    this.#internal[1] = val.y;
    this.#internal[2] = val.z;
    this.#internal[3] = val.w;
  }

  /**
   * The y-axis of the matrix
   */
  get y(): Vector4 {
    return new Vector4(...this[1]);
  }

  set y(val: Vector4) {
    this.#internal[4] = val.x;
    this.#internal[5] = val.y;
    this.#internal[6] = val.z;
    this.#internal[7] = val.w;
  }

  /**
   * The z-axis of the matrix
   */
  get z(): Vector4 {
    return new Vector4(...this[2]);
  }

  set z(val: Vector4) {
    this.#internal[8] = val.x;
    this.#internal[9] = val.y;
    this.#internal[10] = val.z;
    this.#internal[11] = val.w;
  }

  /**
   * The w-axis of the matrix
   */
  get w(): Vector4 {
    return new Vector4(...this[3]);
  }

  set w(val: Vector4) {
    this.#internal[12] = val.x;
    this.#internal[13] = val.y;
    this.#internal[14] = val.z;
    this.#internal[15] = val.w;
  }

  /** Constructs a Matrix4 from individual elements */
  // deno-fmt-ignore
  static from(
    c0r0: number, c0r1: number, c0r2: number, c0r3: number,
    c1r0: number, c1r1: number, c1r2: number, c1r3: number,
    c2r0: number, c2r1: number, c2r2: number, c2r3: number,
    c3r0: number, c3r1: number, c3r2: number, c3r3: number,
  ): Matrix4 {
    return new Matrix4(
      new Vector4(c0r0, c0r1, c0r2, c0r3),
      new Vector4(c1r0, c1r1, c1r2, c1r3),
      new Vector4(c2r0, c2r1, c2r2, c2r3),
      new Vector4(c3r0, c3r1, c3r2, c3r3),
    );
  }

  /**
   * Constructs a Matrix4 from a Perspective
   */
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

    // deno-fmt-ignore
    return Matrix4.from(
      c0r0, c0r1, c0r2, c0r3,
      c1r0, c1r1, c1r2, c1r3,
      c2r0, c2r1, c2r2, c2r3,
      c3r0, c3r1, c3r2, c3r3,
    );
  }

  /**
   * Identity matrix
   */
  static identity(): Matrix4 {
    // deno-fmt-ignore
    return Matrix4.from(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a translation Vector3
   */
  static fromTranslation(translation: Vector3): Matrix4 {
    // deno-fmt-ignore
    return Matrix4.from(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      translation.x, translation.y, translation.z, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a scale factor
   */
  static fromScale(scale: number): Matrix4 {
    return this.fromNonuniformScale(scale, scale, scale);
  }

  /**
   * Constructs a Matrix4 from nonuniform scale factors
   */
  static fromNonuniformScale(x: number, y: number, z: number): Matrix4 {
    // deno-fmt-ignore
    return Matrix4.from(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Look to right-handed matrix
   */
  static lookToRh(eye: Vector3, dir: Vector3, up: Vector3): Matrix4 {
    const f = dir.normal();
    const s = f.cross(up).normal();
    const u = s.cross(f);

    // deno-fmt-ignore
    return Matrix4.from(
      s.x, u.x, -f.x, 0,
      s.y, u.y, -f.y, 0,
      s.z, u.z, -f.z, 0,
      -eye.dot(s), -eye.dot(u), eye.dot(f), 1,
    );
  }

  /**
   * Look to left-handed matrix
   */
  static lookToLh(eye: Vector3, dir: Vector3, up: Vector3): Matrix4 {
    return Matrix4.lookToRh(eye, dir.neg(), up);
  }

  /**
   * Look at right-handed matrix
   */
  static lookAtRh(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
    return Matrix4.lookToRh(eye, center.sub(eye), up);
  }

  /**
   * Look at left-handed matrix
   */
  static lookAtLh(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
    return Matrix4.lookToLh(eye, center.sub(eye), up);
  }

  /**
   * Constructs a Matrix4 from a rotation angle around the x-axis
   */
  static fromAngleX(theta: Angle): Matrix4 {
    const [s, c] = theta.sincos();

    // deno-fmt-ignore
    return Matrix4.from(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a rotation angle around the y-axis
   */
  static fromAngleY(theta: Angle): Matrix4 {
    const [s, c] = theta.sincos();

    // deno-fmt-ignore
    return Matrix4.from(
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a rotation angle around the z-axis
   */
  static fromAngleZ(theta: Angle): Matrix4 {
    const [s, c] = theta.sincos();

    // deno-fmt-ignore
    return Matrix4.from(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a rotation angle around an arbitrary axis
   */
  static fromAxisAngle(axis: Vector3, angle: Angle): Matrix4 {
    const [s, c] = angle.sincos();
    const c1 = 1 - c;

    // deno-fmt-ignore
    return Matrix4.from(
      c1 * axis.x * axis.x + c, c1 * axis.x * axis.y + s * axis.z, c1 * axis.x * axis.z - s * axis.y, 0,
      c1 * axis.x * axis.y - s * axis.z, c1 * axis.y * axis.y + c, c1 * axis.y * axis.z + s * axis.x, 0,
      c1 * axis.x * axis.z + s * axis.y, c1 * axis.y * axis.z - s * axis.x, c1 * axis.z * axis.z + c, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a Quaternion
   */
  static fromQuaternion(quaternion: Quaternion): Matrix4 {
    const x2 = quaternion.vector.x + quaternion.vector.x;
    const y2 = quaternion.vector.y + quaternion.vector.y;
    const z2 = quaternion.vector.z + quaternion.vector.z;

    const xx2 = x2 * quaternion.vector.x;
    const xy2 = x2 * quaternion.vector.y;
    const xz2 = x2 * quaternion.vector.z;

    const yy2 = y2 * quaternion.vector.y;
    const yz2 = y2 * quaternion.vector.z;
    const zz2 = z2 * quaternion.vector.z;

    const sy2 = y2 * quaternion.scalar;
    const sz2 = z2 * quaternion.scalar;
    const sx2 = x2 * quaternion.scalar;

    // deno-fmt-ignore
    return Matrix4.from(
      1 - yy2 - zz2, xy2 + sz2, xz2 - sy2, 0,
      xy2 - sz2, 1 - xx2 - zz2, yz2 + sx2, 0,
      xz2 + sy2, yz2 - sx2, 1 - xx2 - yy2, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * Constructs a Matrix4 from a Decomposed3
   */
  static fromDecomposed(decomposed: Decomposed3): Matrix4 {
    const m = Matrix3.fromQuaternion(decomposed.rot).mul(decomposed.scale)
      .toMatrix4();
    m.w = decomposed.disp.extend(1);
    return m;
  }

  constructor();
  constructor(ptr: number);
  constructor(x: Vector4, y: Vector4, z: Vector4, w: Vector4);
  constructor(x?: Vector4 | number, y?: Vector4, z?: Vector4, w?: Vector4) {
    this.ptr = typeof x === "number" ? x : alloc(SIZE);
    this.#internal = new Float32Array(memory.buffer, this.ptr, 16);

    if (typeof x !== "number" && x !== undefined) {
      this.x = x ?? Vector4.zero();
      this.y = y ?? Vector4.zero();
      this.z = z ?? Vector4.zero();
      this.w = w ?? Vector4.zero();
    }

    finalizer.register(this, this.ptr);
  }

  /** Creates a new Matrix4 with the same values */
  clone(): Matrix4 {
    return new Matrix4(this.x, this.y, this.z, this.w);
  }

  /**
   * Transposes the matrix
   */
  transpose(): Matrix4 {
    // deno-fmt-ignore
    return Matrix4.from(
      this[0][0], this[1][0], this[2][0], this[3][0],
      this[0][1], this[1][1], this[2][1], this[3][1],
      this[0][2], this[1][2], this[2][2], this[3][2],
      this[0][3], this[1][3], this[2][3], this[3][3],
    );
  }

  /**
   * Compares two matrices for equality
   */
  eq(other: Matrix4): boolean {
    return this[0][0] === other[0][0] &&
      this[0][1] === other[0][1] &&
      this[0][2] === other[0][2] &&
      this[0][3] === other[0][3] &&
      this[1][0] === other[1][0] &&
      this[1][1] === other[1][1] &&
      this[1][2] === other[1][2] &&
      this[1][3] === other[1][3] &&
      this[2][0] === other[2][0] &&
      this[2][1] === other[2][1] &&
      this[2][2] === other[2][2] &&
      this[2][3] === other[2][3] &&
      this[3][0] === other[3][0] &&
      this[3][1] === other[3][1] &&
      this[3][2] === other[3][2] &&
      this[3][3] === other[3][3];
  }

  /**
   * Whether the matrix is finite
   */
  isFinite(): boolean {
    return this.x.isFinite() && this.y.isFinite() && this.z.isFinite() &&
      this.w.isFinite();
  }

  /**
   * Gets the row of the matrix
   */
  row(n: 0 | 1 | 2 | 3): [number, number, number, number] {
    return [this[0][n], this[1][n], this[2][n], this[3][n]];
  }

  /**
   * Gets the column of the matrix
   */
  col(n: 0 | 1 | 2 | 3): [number, number, number, number] {
    return this[n];
  }

  /**
   * Gets the diagonal of the matrix
   */
  diag(): [number, number, number, number] {
    return [this[0][0], this[1][1], this[2][2], this[3][3]];
  }

  /**
   * Gets the trace of the matrix
   */
  trace(): number {
    return this[0][0] + this[1][1] + this[2][2] + this[3][3];
  }

  /**
   * Gets the determinant of the matrix
   */
  determinant(): number {
    return matrix4determinant(this.ptr);
  }

  /**
   * Inverts the matrix
   */
  invert(): Matrix4 | undefined {
    const ptr = matrix4invert(this.ptr);

    if (ptr !== 0) {
      return new Matrix4(ptr);
    }
  }

  /**
   * Adds a matrix or scalar to the matrix
   */
  add(other: Matrix4 | number): Matrix4 {
    if (typeof other === "number") {
      return new Matrix4(
        this.x.add(other),
        this.y.add(other),
        this.z.add(other),
        this.w.add(other),
      );
    }

    return new Matrix4(matrix4add(this.ptr, other.ptr));
  }

  /**
   * Subtracts a matrix or scalar from the matrix
   */
  sub(other: Matrix4 | number): Matrix4 {
    if (typeof other === "number") {
      return new Matrix4(
        this.x.sub(other),
        this.y.sub(other),
        this.z.sub(other),
        this.w.sub(other),
      );
    }

    return new Matrix4(matrix4sub(this.ptr, other.ptr));
  }

  /**
   * Multiplies a matrix or scalar with the matrix
   */
  mul(other: Matrix4 | number): Matrix4 {
    if (typeof other === "number") {
      return new Matrix4(
        this.x.mul(other),
        this.y.mul(other),
        this.z.mul(other),
        this.w.mul(other),
      );
    }

    return new Matrix4(matrix4mul(this.ptr, other.ptr));
  }

  /**
   * Converts the matrix to an array
   */
  toArray(): [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
  ] {
    return [
      this[0],
      this[1],
      this[2],
      this[3],
    ];
  }

  /**
   * Converts the matrix to a Float32Array
   */
  toFloat32Array(): Float32Array {
    return new Float32Array(this.#internal);
  }

  [Symbol.dispose]() {
    dealloc(this.ptr, SIZE);
  }
}
