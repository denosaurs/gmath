import { Rad } from "./angle.ts";

export class Perspective {
  left: number;
  right: number;
  bottom: number;
  top: number;
  near: number;
  far: number;
}

export class PerspectiveFox {
  fovy: Rad;
  aspect: number;
  near: number;
  far: number;
}
