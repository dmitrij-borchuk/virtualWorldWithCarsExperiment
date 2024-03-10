class Crossing extends Marking {
  constructor(position, direction, width, height) {
    super(position, direction, width, height);

    this.borders = [...this.poly.segments];
    this.type = "crossing";
  }

  draw(ctx) {
    // this.poly.draw(ctx);

    const perp = perpendicular(this.direction);
    const line = new Segment(
      addVectors(this.center, scaleVector(perp, this.width / 2)),
      addVectors(this.center, scaleVector(perp, -this.width / 2))
    );

    line.draw(ctx, {
      width: this.height,
      color: "white",
      dash: [11, 11],
    });
  }
}
