class Building {
  constructor(poly, hightCoef = 0.4) {
    this.base = poly;
    this.hightCoef = hightCoef;
  }

  draw(ctx, viewpoint) {
    const topPoints = this.base.points.map((p) =>
      addVectors(p, scaleVector(subVectors(p, viewpoint), this.hightCoef))
    );
    const ceiling = new Polygon(topPoints);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length;
      sides.push(
        new Polygon([
          this.base.points[i],
          this.base.points[nextI],
          topPoints[nextI],
          topPoints[i],
        ])
      );
    }
    sides.sort(
      (a, b) => b.distanceToPoint(viewpoint) - a.distanceToPoint(viewpoint)
    );

    this.base.draw(ctx, {
      color: "rgba(255,255,255,1)",
      stroke: "rgba(0,0,0,1)",
    });
    sides.forEach((s) =>
      s.draw(ctx, { color: "rgba(255,255,255,1)", stroke: "rgba(0,0,0,1)" })
    );
    ceiling.draw(ctx, {
      color: "rgba(255,255,255,1)",
      stroke: "rgba(0,0,0,1)",
    });
    // ctx.beginPath();
    // ctx.moveTo(this.base[0].x, this.base[0].y);
    // for (let i = 1; i < this.base.length; i++) {
    //   ctx.lineTo(this.base[i].x, this.base[i].y);
    // }
    // ctx.closePath();
    // ctx.fill();
  }
}
