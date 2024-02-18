class Tree {
  constructor(center, size, hightCoef = 0.3) {
    this.center = center;
    this.size = size;
    this.hightCoef = hightCoef;
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
      point.draw(ctx, { fill: color, size: radius });
    }
  }
}
