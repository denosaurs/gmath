import type { Angle } from "./angle.ts";
import type { Quaternion } from "./quaternion.ts";
import type { Vector2 } from "./vector2.ts";
import type { Vector3 } from "./vector3.ts";

export interface Decomposed2 {
  /**
   * Scale factor.
   */
  scale: number;
  /**
   * Rotation angle.
   */
  rot: Angle;
  /**
   * Displacement vector.
   */
  disp: Vector2;
}

export interface Decomposed3 {
  /**
   * Scale factor.
   */
  scale: number;
  /**
   * Rotation quaternion.
   */
  rot: Quaternion;
  /**
   * Displacement vector.
   */
  disp: Vector3;
}
