export abstract class Vector<T extends Vector<T>> {
  /** Creates a new Vector with the same values */
  abstract clone(): T;

  /** The magnitude of the vector */
  abstract mag(): number;
  /** 
   * The squared magnitude of the vector, does not perform square root
   * operation which increases performance when comparing Vector magnitudes
   */
  abstract mag2(): number;

  /** Returns a new Vector with the same direction, but with a magnitude of 1 */
  abstract normal(): T;
  /** Returns a new Vector with the same direction, but clamped to the specified length */
  abstract clamp(length: number): T;
  /** Calculates the dot product of the Vector */
  abstract dot(other: T): number;
  /** Linearly interpolates between this and the specified Vector */
  abstract lerp(other: T, alpha: number): T;

  /** Sets this Vector to the specified Vector or scalar */
  abstract set(other: T | number): T;
  /** Adds this Vector to the specified Vector or scalar */
  abstract add(other: T | number): T;
  /** Subtracts this Vector from the specified Vector or scalar */
  abstract sub(other: T | number): T;
  /** Multiplies this Vector with the specified Vector or scalar */
  abstract mul(other: T | number): T;
  /** Divides this Vector with the specified Vector or scalar */
  abstract div(other: T | number): T;
  /** Negates this Vector */
  abstract neg(): T;

  /** Checks equality between two Vectors */
  abstract eq(other: T): boolean;
  /** Checks if the Vector is finite */
  abstract isFinite(): boolean;

  /** Converts the Vector to a string */
  abstract toString(): string;
  /** Converts the Vector to a tuple of numbers */
  abstract toArray(): Array<number>;
  /** Converts the Vector to a Float32Array */
  abstract toFloat32Array(): Float32Array;
}
