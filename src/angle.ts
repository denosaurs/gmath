export type Angle = Deg | Rad;

export class Deg {
  value: number;

  static turn = 360;

  static from(rad: Rad): Deg {
    return new Deg(rad.value * (180 / Math.PI));
  }

  constructor(value = 0) {
    this.value = value;
  }

  sin(): number {
    return Rad.from(this).sin();
  }

  cos(): number {
    return Rad.from(this).cos();
  }

  tan(): number {
    return Rad.from(this).tan();
  }

  sincos(): [number, number] {
    return Rad.from(this).sincos();
  }

  add(other: Deg): Deg {
    return new Deg(this.value + other.value);
  }

  sub(other: Deg): Deg {
    return new Deg(this.value - other.value);
  }

  mul(other: Deg): Deg {
    return new Deg(this.value * other.value);
  }

  div(other: Deg): Deg {
    return new Deg(this.value / other.value);
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
}

export class Rad {
  value: number;

  static turn = 2 * Math.PI;

  static from(deg: Deg): Rad {
    return new Rad(deg.value * (Math.PI / 180));
  }

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

  add(other: Rad): Rad {
    return new Rad(this.value + other.value);
  }

  sub(other: Rad): Rad {
    return new Rad(this.value - other.value);
  }

  mul(other: Rad): Rad {
    return new Rad(this.value * other.value);
  }

  div(other: Rad): Rad {
    return new Rad(this.value / other.value);
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
}
