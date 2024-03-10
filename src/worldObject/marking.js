class Marking {
  constructor(position, direction, width, height) {
    this.center = position;
    this.direction = direction;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(this.center, angle(this.direction), this.height / 2),
      translate(this.center, angle(this.direction), -this.height / 2)
    );
    this.poly = new Envelope(this.support, this.width).poly;
    this.type = "marking";
  }

  draw(ctx) {
    this.poly.draw(ctx);
  }
}
