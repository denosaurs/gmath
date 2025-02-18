import { type Angle, Rad } from "./angle.ts";
import { Vector3 } from "./vector3.ts";
import { Matrix3 } from "./matrix3.ts";

export class Quaternion {
  scalar: number;
  vector: Vector3;

  /**
   * Create a new Quaternion with all components set to 0
   */
  static zero(): Quaternion {
    return new Quaternion(0, Vector3.zero());
  }

  /**
   * Create a new Quaternion with all components set to 1
   */
  static one(): Quaternion {
    return new Quaternion(1, Vector3.one());
  }

  /**
   * Create a new Quaternion from an arc
   */
  static fromArc(src: Vector3, dst: Vector3, fallback?: Vector3): Quaternion {
    const avgMag = Math.sqrt(src.mag2() * dst.mag2());
    const dot = src.dot(dst);

    if (dot === avgMag) {
      return Quaternion.one();
    }

    if (dot === -avgMag) {
      let axis = fallback;
      if (axis === undefined) {
        let vector = Vector3.up().cross(src);

        if (vector.eq(Vector3.zero())) {
          vector = Vector3.right().cross(src);
        }

        axis = vector.normal();
      }

      return Quaternion.fromAxisAngle(axis, new Rad(Rad.turn / 2));
    }

    return new Quaternion(avgMag + dot, src.cross(dst).normal());
  }

  /**
   * Create a new Quaternion from an axis and an angle
   */
  static fromAxisAngle(axis: Vector3, angle: Angle): Quaternion {
    const [s, c] = angle.div(2).sincos();

    return new Quaternion(c, axis.mul(s));
  }

  /**
   * Create a new Quaternion from a Matrix3
   */
  static fromMatrix3(matrix: Matrix3): Quaternion {
    const trace = matrix.trace();

    if (trace >= 0) {
      let s = Math.sqrt(1 + trace);
      const w = 0.5 * s;
      s = 0.5 / s;
      const x = (matrix[1][2] - matrix[2][1]) * s;
      const y = (matrix[2][0] - matrix[0][2]) * s;
      const z = (matrix[0][1] - matrix[1][0]) * s;
      return new Quaternion(w, new Vector3(x, y, z));
    }

    if ((matrix[0][0] > matrix[1][1]) && (matrix[0][0] > matrix[2][2])) {
      let s = Math.sqrt((matrix[0][0] - matrix[1][1] - matrix[2][2]) + 1);
      const x = 0.5 * s;
      s = 0.5 / s;
      const y = (matrix[1][0] + matrix[0][1]) * s;
      const z = (matrix[0][2] + matrix[2][0]) * s;
      const w = (matrix[1][2] - matrix[2][1]) * s;
      return new Quaternion(w, new Vector3(x, y, z));
    }

    if (matrix[1][1] > matrix[2][2]) {
      let s = Math.sqrt((matrix[1][1] - matrix[0][0] - matrix[2][2]) + 1);
      const y = 0.5 * s;
      s = 0.5 / s;
      const z = (matrix[2][1] + matrix[1][2]) * s;
      const x = (matrix[1][0] + matrix[0][1]) * s;
      const w = (matrix[2][0] - matrix[0][2]) * s;
      return new Quaternion(w, new Vector3(x, y, z));
    }

    let s = Math.sqrt((matrix[2][2] - matrix[0][0] - matrix[1][1]) + 1);
    const z = 0.5 * s;
    s = 0.5 / s;
    const x = (matrix[0][2] + matrix[2][0]) * s;
    const y = (matrix[2][1] + matrix[1][2]) * s;
    const w = (matrix[0][1] - matrix[1][0]) * s;
    return new Quaternion(w, new Vector3(x, y, z));
  }

  /**
   * Look at a direction
   */
  static lookAt(dir: Vector3, up: Vector3): Quaternion {
    return Quaternion.fromMatrix3(Matrix3.lookToLh(dir, up));
  }

  /**
   * Create a new Quaternion between two vectors
   */
  static between(a: Vector3, b: Vector3): Quaternion {
    const kCosTheta = a.dot(b);

    if (kCosTheta === 1) {
      return Quaternion.one();
    }

    const k = Math.sqrt(a.mag2() * b.mag2());

    if (kCosTheta / k === -1) {
      let orthogonal = a.cross(Vector3.right());

      if (orthogonal.mag2() === 0) {
        orthogonal = a.cross(Vector3.up());
      }

      return new Quaternion(0, orthogonal.normal());
    }

    return new Quaternion(k + kCosTheta, a.cross(b)).normal();
  }

  constructor();
  constructor(scalar: number, vector: Vector3);
  constructor(scalar?: number, vector?: Vector3) {
    this.scalar = scalar ?? 0;
    this.vector = vector ?? Vector3.zero();
  }

  /** Creates a new Quaternion with the same values */
  clone(): Quaternion {
    return new Quaternion(this.scalar, this.vector);
  }

  /**
   * Get the magnitude of the Quaternion
   */
  mag(): number {
    return Math.hypot(this.scalar, this.vector.x, this.vector.y, this.vector.z);
  }

  /**
   * Get the squared magnitude of the Quaternion
   */
  mag2(): number {
    return this.scalar ** 2 + this.vector.x ** 2 + this.vector.y ** 2 +
      this.vector.z ** 2;
  }

  /**
   * Get the normal of the Quaternion
   */
  normal(): Quaternion {
    return this.div(this.mag());
  }

  /**
   * Returns the dot product between two Quaternions
   */
  dot(other: Quaternion): number {
    return this.scalar * other.scalar + this.vector.dot(other.vector);
  }

  /**
   * Conjugate the Quaternion
   */
  conjugate(): Quaternion {
    return new Quaternion(this.scalar, this.vector.neg());
  }

  /**
   * Invert the Quaternion
   */
  invert(): Quaternion {
    return this.conjugate().div(this.mag2());
  }

  /**
   * Rotate a vector by the Quaternion
   */
  rot(vector: Vector3): Vector3 {
    const tmp = this.vector.cross(vector).add(vector.mul(this.scalar));
    return this.vector.cross(tmp).mul(2).add(vector);
  }

  /**
   * Nlerp between two Quaternions
   */
  nlerp(other: Quaternion, alpha: number): Quaternion {
    if (this.dot(other) < 0) {
      other = other.neg();
    }

    return this.mul(1 - alpha).add(other.mul(alpha)).normal();
  }

  /**
   * Slerp between two Quaternions
   */
  slerp(other: Quaternion, alpha: number): Quaternion {
    let dot = this.dot(other);
    const threshold = 0.9995;

    if (dot < 0) {
      other = other.neg();
      dot = -dot;
    }

    if (dot > threshold) {
      return this.nlerp(other, alpha);
    }

    const robustDot = Math.max(Math.min(dot, 1), -1);
    const theta = new Rad(robustDot).acos();

    const scale1 = new Rad(theta * (1 - alpha)).sin();
    const scale2 = new Rad(theta * alpha).sin();

    return this.mul(scale1).add(other.mul(scale2)).normal();
  }

  /**
   * Set the values of the Quaternion
   */
  set(scalar: number, vector: Vector3): Quaternion {
    this.scalar = scalar;
    this.vector = vector;

    return this;
  }

  /**
   * Add a Quaternion or a scalar to the Quaternion
   */
  add(other: Quaternion | number): Quaternion {
    const { vector, scalar } = typeof other === "number"
      ? { vector: new Vector3(other), scalar: other }
      : other;

    return new Quaternion(this.scalar + scalar, this.vector.add(vector));
  }

  /**
   * Subtract a Quaternion or a scalar from the Quaternion
   */
  sub(other: Quaternion | number): Quaternion {
    const { vector, scalar } = typeof other === "number"
      ? { vector: new Vector3(other), scalar: other }
      : other;

    return new Quaternion(this.scalar - scalar, this.vector.sub(vector));
  }

  /**
   * Multiply a Quaternion or a scalar with the Quaternion
   */
  mul(other: Quaternion | number): Quaternion {
    if (typeof other === "number") {
      return new Quaternion(this.scalar * other, this.vector.mul(other));
    }

    return new Quaternion(
      this.scalar * other.scalar - this.vector.x * other.vector.x -
        this.vector.y * other.vector.y - this.vector.z * other.vector.z,
      new Vector3(
        this.scalar * other.vector.x + this.vector.x * other.scalar +
          this.vector.y * other.vector.z - this.vector.z * other.vector.y,
        this.scalar * other.vector.y + this.vector.y * other.scalar +
          this.vector.z * other.vector.x - this.vector.x * other.vector.z,
        this.scalar * other.vector.z + this.vector.z * other.scalar +
          this.vector.x * other.vector.y - this.vector.y * other.vector.x,
      ),
    );
  }

  /**
   * Divide the Quaternion by a scalar
   */
  div(other: number): Quaternion {
    return new Quaternion(this.scalar / other, this.vector.div(other));
  }

  /**
   * Negate the Quaternion
   */
  neg(): Quaternion {
    return new Quaternion(-this.scalar, this.vector.neg());
  }

  /**
   * Check if the Quaternion is equal to another Quaternion
   */
  eq(other: Quaternion): boolean {
    return this.scalar === other.scalar && this.vector.eq(other.vector);
  }

  /**
   * Check if the Quaternion is finite
   */
  is_finite(): boolean {
    return isFinite(this.scalar) && this.vector.isFinite();
  }

  toString(): string {
    return `Quaternion { scalar: ${this.scalar}, vector: ${this.vector.toString()} }`;
  }
}
