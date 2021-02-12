import { Vector4 } from "./vector4.ts";

export class Matrix4 {
  x: Vector4;
  y: Vector4;
  z: Vector4;
  w: Vector4;

  constructor(x: Vector4, y: Vector4, z: Vector4, w: Vector4) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}
