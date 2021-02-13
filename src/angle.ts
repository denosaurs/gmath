import { Matrix2 } from "./matrix2.ts";

export type Angle = Deg | Rad;

export class Deg {
  value: number;

  static turn = 360;

  constructor(value = 0) {
    this.value = value;
  }

  sin(): number {
    return this.toRad().sin();
  }

  cos(): number {
    return this.toRad().cos();
  }

  tan(): number {
    return this.toRad().tan();
  }

  sincos(): [number, number] {
    return this.toRad().sincos();
  }

  csc(): number {
    return this.toRad().csc();
  }

  cot(): number {
    return this.toRad().cot();
  }

  sec(): number {
    return this.toRad().sec();
  }

  asin(): number {
    return this.toRad().asin();
  }

  acos(): number {
    return this.toRad().acos();
  }

  atan(): number {
    return this.toRad().atan();
  }

  atan2(scalar: number): number;
  atan2(other: Angle): number;
  atan2(other: Angle | number): number {
    return this.toRad().atan2(other);
  }

  add(scalar: number): Deg;
  add(other: Deg): Deg;
  add(other: Deg | number): Deg {
    return new Deg(
      this.value + (typeof other === "number" ? other : other.value),
    );
  }

  sub(scalar: number): Deg;
  sub(other: Deg): Deg;
  sub(other: Deg | number): Deg {
    return new Deg(
      this.value - (typeof other === "number" ? other : other.value),
    );
  }

  mul(scalar: number): Deg;
  mul(other: Deg): Deg;
  mul(other: Deg | number): Deg {
    return new Deg(
      this.value * (typeof other === "number" ? other : other.value),
    );
  }

  div(scalar: number): Deg;
  div(other: Deg): Deg;
  div(other: Deg | number): Deg {
    return new Deg(
      this.value / (typeof other === "number" ? other : other.value),
    );
  }

  neg(): Deg {
    return new Deg(-this.value);
  }

  normal(): Deg {
    const rem = this.value % Deg.turn;

    return new Deg(rem < 0 ? rem + Deg.turn : rem);
  }

  normalize(): Deg {
    const rem = this.value % Deg.turn;
    this.value = rem < 0 ? rem + Deg.turn : rem;

    return this;
  }

  toMatrix2(): Matrix2 {
    const [s, c] = this.sincos();
    return Matrix2.fromCols(c, s, -s, c);
  }

  toRad(): Rad {
    return new Rad(this.value * (Math.PI / 180));
  }

  toString(): string {
    return `${this.value} deg`;
  }
}

export class Rad {
  value: number;

  static turn = 2 * Math.PI;

  constructor(value = 0) {
    this.value = value;
  }

  sin(): number {
    return Math.sin(this.value);
  }

  cos(): number {
    return Math.cos(this.value);
  }

  tan(): number {
    return Math.tan(this.value);
  }

  sincos(): [number, number] {
    return [Math.sin(this.value), Math.cos(this.value)];
  }

  csc(): number {
    return 1 / this.sin();
  }

  cot(): number {
    return 1 / this.tan();
  }

  sec(): number {
    return 1 / this.cos();
  }

  asin(): number {
    return Math.asin(this.value);
  }

  acos(): number {
    return Math.acos(this.value);
  }

  atan(): number {
    return Math.atan(this.value);
  }

  atan2(scalar: number): number;
  atan2(other: Angle): number;
  atan2(other: Angle | number): number;
  atan2(other: Angle | number): number {
    if (other instanceof Deg) {
      other = other.toRad();
    }

    return Math.atan2(
      this.value,
      typeof other === "number" ? other : other.value,
    );
  }

  add(scalar: number): Rad;
  add(other: Rad): Rad;
  add(other: Rad | number): Rad {
    return new Rad(
      this.value + (typeof other === "number" ? other : other.value),
    );
  }

  sub(scalar: number): Rad;
  sub(other: Rad): Rad;
  sub(other: Rad | number): Rad {
    return new Rad(
      this.value - (typeof other === "number" ? other : other.value),
    );
  }

  mul(scalar: number): Rad;
  mul(other: Rad): Rad;
  mul(other: Rad | number): Rad {
    return new Rad(
      this.value * (typeof other === "number" ? other : other.value),
    );
  }

  div(scalar: number): Rad;
  div(other: Rad): Rad;
  div(other: Rad | number): Rad {
    return new Rad(
      this.value / (typeof other === "number" ? other : other.value),
    );
  }

  neg(): Rad {
    return new Rad(-this.value);
  }

  normal(): Rad {
    const rem = this.value % Rad.turn;

    return new Rad(rem < 0 ? rem + Rad.turn : rem);
  }

  normalize(): Rad {
    const rem = this.value % Rad.turn;
    this.value = rem < 0 ? rem + Rad.turn : rem;

    return this;
  }

  toMatrix2(): Matrix2 {
    const [s, c] = this.sincos();
    return Matrix2.fromCols(c, s, -s, c);
  }

  toDeg(): Deg {
    return new Deg(this.value * (180 / Math.PI));
  }

  toString(): string {
    return `${this.value} rad`;
  }
}
