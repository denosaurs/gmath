import { assert, assertEquals } from "./deps.ts";
import { Vector3 } from "../src/vector3.ts";
import { Matrix3 } from "../src/matrix3.ts";
import { Matrix4 } from "../src/matrix4.ts";
import { Vector4 } from "../src/vector4.ts";

Deno.test("Matrix4.transpose", () => {
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
      .transpose().eq(
        Matrix4.from(1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16),
      ),
  );
});

Deno.test("Matrix4.eq", () => {
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).eq(
      Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
    ),
  );
  assert(
    !Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).eq(
      new Matrix4(),
    ),
  );
});

Deno.test("Matrix4.isFinite", () => {
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
      .isFinite(),
  );
  assert(
    !Matrix4.from(
      Infinity,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
    ).isFinite(),
  );
});

Deno.test("Matrix4.row", () => {
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).row(
      0,
    ).eq(new Vector4(1, 5, 9, 13)),
  );
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).row(
      1,
    ).eq(new Vector4(2, 6, 10, 14)),
  );
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).row(
      2,
    ).eq(new Vector4(3, 7, 11, 15)),
  );
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).row(
      3,
    ).eq(new Vector4(4, 8, 12, 16)),
  );
});

Deno.test("Matrix4.col", () => {
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).col(
      0,
    ).eq(new Vector4(1, 2, 3, 4)),
  );
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).col(
      1,
    ).eq(new Vector4(5, 6, 7, 8)),
  );
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).col(
      2,
    ).eq(new Vector4(9, 10, 11, 12)),
  );
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).col(
      3,
    ).eq(new Vector4(13, 14, 15, 16)),
  );
});

Deno.test("Matrix4.add", () => {
  assert(
    Matrix4.from(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1).add(
      Matrix4.from(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
    ).eq(Matrix4.from(2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2)),
  );
});

Deno.test("Matrix4.sub", () => {
  assert(
    Matrix4.from(2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2).sub(
      Matrix4.from(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
    ).eq(Matrix4.from(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)),
  );
});

Deno.test("Matrix4.mul", () => {
  assert(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).mul(
      Matrix4.from(
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
      ),
    ).eq(
      Matrix4.from(
        538,
        612,
        686,
        760,
        650,
        740,
        830,
        920,
        762,
        868,
        974,
        1080,
        874,
        996,
        1118,
        1240,
      ),
    ),
  );

  assert(
    Matrix4.from(1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16).mul(
      Matrix4.from(2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16, 5, 9, 13, 17),
    ).eq(
      Matrix4.from(
        100,
        228,
        356,
        484,
        110,
        254,
        398,
        542,
        120,
        280,
        440,
        600,
        130,
        306,
        482,
        658,
      ),
    ),
  );
});

Deno.test("Matrix4.toArray", () => {
  assertEquals(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
      .toArray(),
    [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ],
  );
});

Deno.test("Matrix4.toFloat32Array", () => {
  assertEquals(
    Matrix4.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
      .toFloat32Array(),
    new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
  );
});
