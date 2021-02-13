import { Deg, Matrix4, PerspectiveFov, Vector3 } from "./mod.ts";

function generateMatrix(aspect: number): Matrix4 {
  const mxProjection = new PerspectiveFov(new Deg(45), aspect, 1, 1000)
    .toMatrix4();
  const mxView = Matrix4.lookAtRh(
    new Vector3(0, 0, 10),
    new Vector3(0, 50, 0),
    Vector3.forward,
  );
  const mxCorrection = Matrix4.fromCols(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.5,
    0.0,
    0.0,
    0.0,
    0.5,
    1.0,
  );
  return mxCorrection.mul(mxProjection.mul(mxView));
}

console.log(generateMatrix(90));
