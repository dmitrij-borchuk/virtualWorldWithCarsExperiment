class Tree {
  constructor(center, size, hightCoef = 0.3) {
    this.center = center;
    this.size = size;
    this.hightCoef = hightCoef;
    this.base = this.#generateLevel(center, size);
  }

  draw(ctx, viewPoint) {
    const diff = subVectors(this.center, viewPoint);
    const top = addVectors(this.center, scaleVector(diff, this.hightCoef));

    const levels = 7;
    for (let i = 0; i < levels; i++) {
      const t = i / levels;
      const point = lerp2d(this.center, top, t);
      const radius = this.size * (1 - i / levels);
      const color = `rgba(30,${lerp(50, 200, t)},70,1)`;
      const poly = this.#generateLevel(point, radius);
      poly.draw(ctx, { color });
      // point.draw(ctx, { fill: color, size: radius });
    }
  }

  #generateLevel(point, size) {
    const steps = 16;
    const points = [];
    const radius = size / 2;
    for (let a = 0; a < 2 * Math.PI; a += Math.PI / steps) {
      const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noisyRadius = radius + kindOfRandom * 10;
      // const x = this.center.x + radius * Math.cos(a);
      // const y = this.center.y + radius * Math.sin(a);
      points.push(translate(point, a, noisyRadius));
    }
    return new Polygon(points);
  }
}
