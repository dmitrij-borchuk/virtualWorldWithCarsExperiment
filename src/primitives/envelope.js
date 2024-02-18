class Envelope {
  constructor(segment, width = 100, roundness = 1) {
    this.segment = segment;
    this.poly = this.#generatePolygon(width, roundness);
    this.roundness = roundness;
  }

  #generatePolygon(width = 5, roundness = 10) {
    const { p1, p2 } = this.segment;
    const radius = width / 2;

    const alpha = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const alphaCw = alpha + Math.PI / 2;
    const alphaCcw = alpha - Math.PI / 2;
    const points = [];
    const step = Math.PI / roundness;
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

  draw(ctx, options = {}) {
    this.poly.draw(ctx, options);
  }
}
