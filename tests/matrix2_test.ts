import { assert, assertEquals } from "./deps.ts";
import { Deg } from "../src/angle.ts";
import { Matrix2 } from "../src/matrix2.ts";

Deno.test("Matrix2.transpose", () => {
  assert(
    Matrix2.fromCols(
      1,
      2,
      3,
      4,
    ).transpose().eq(
      Matrix2.fromCols(
        1,
        3,
        2,
        4,
      ),
    ),
  );
});

Deno.test("Matrix2.eq", () => {
  assert(
    Matrix2.fromCols(
      1,
      2,
      3,
      4,
    ).eq(
      Matrix2.fromCols(
        1,
        2,
        3,
        4,
      ),
    ),
  );
});

Deno.test("Matrix2.isFinite", () => {
  assert(
    Matrix2.fromCols(
      1,
      2,
      3,
      4,
    ).isFinite(),
  );
  assert(
    !Matrix2.fromCols(
      Infinity,
      2,
      3,
      4,
    ).isFinite(),
  );
});

Deno.test("Matrix2.mul", () => {
  assert(
    Matrix2.fromCols(
      1,
      2,
      3,
      4,
    ).mul(
      Matrix2.fromCols(
        5,
        6,
        7,
        8,
      ),
    ).eq(
      Matrix2.fromCols(
        23,
        34,
        31,
        46,
      ),
    ),
  );

  assert(
    Matrix2.fromCols(
      1,
      3,
      2,
      4,
    ).mul(
      Matrix2.fromCols(
        2,
        4,
        3,
        5,
      ),
    ).eq(
      Matrix2.fromCols(
        10,
        22,
        13,
        29,
      ),
    ),
  );
});
