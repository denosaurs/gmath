import { Deg, Matrix4, PerspectiveFov, Vector3 } from "./mod.ts";

// deno-fmt-ignore
export const OPENGL_TO_WGPU_MATRIX = Matrix4.from(
  1.0, 0.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.0, 0.0, 0.5, 1.0,
);

const mxProjection = new PerspectiveFov(
  new Deg(45),
  1600 / 1200,
  1,
  50,
).toPerspective().toMatrix4();
console.log(mxProjection.toFloat32Array());

const camPos = new Vector3(
  Math.cos(0.2) * Math.sin(0.2) * 30,
  Math.sin(0.2) * 30 + 2,
  Math.cos(0.2) * Math.cos(0.2) * 30,
);
const mxView = Matrix4.lookAtRh(
  camPos,
  new Vector3(0, 2, 0),
  Vector3.up(),
);
const proj = OPENGL_TO_WGPU_MATRIX.mul(mxProjection);
console.log(mxProjection.toFloat32Array());
console.log(proj.toFloat32Array());
const projInvert = proj.invert();
console.log(proj.toFloat32Array());
const view = OPENGL_TO_WGPU_MATRIX.mul(mxView);

console.log(
  new Float32Array([
    ...proj.toFloat32Array(),
    ...projInvert!.toFloat32Array(),
    ...view.toFloat32Array(),
    ...camPos.toFloat32Array(),
    1,
  ]),
);
