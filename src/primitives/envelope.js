class Envelope {
  constructor(segment, width) {
    this.segment = segment;
    this.poly = this.#generatePolygon(width);
  }

  #generatePolygon(width = 5) {
    const { p1, p2 } = this.segment;
    const radius = width / 2;

    const alpha = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const alphaCw = alpha + Math.PI / 2;
    const alphaCcw = alpha - Math.PI / 2;
    const points = [];
    const step = Math.PI / 10;
    // Need to add a small epsilon to include the last point (floating point number problem)
    const epsilon = 0.0001;
    for (let i = alphaCcw; i <= alphaCw + epsilon; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alphaCcw; i <= alphaCw + epsilon; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }

  draw(ctx) {
    this.poly.draw(ctx);
  }
}
