class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
  length() {
    return distance(this.p1, this.p2);
  }

  equals(other) {
    return this.includes(other.p1) && this.includes(other.p2);
  }

  includes(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  distanceToPoint(point) {
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }
    const distToP1 = distance(point, this.p1);
    const distToP2 = distance(point, this.p2);
    return Math.min(distToP1, distToP2);
  }

  projectPoint(point) {
    const a = subVectors(point, this.p1);
    const b = subVectors(this.p2, this.p1);
    const normB = normalizeVector(b);
    const scaler = dot(a, normB);
    const proj = {
      point: addVectors(this.p1, scaleVector(normB, scaler)),
      offset: scaler / magnitude(b),
    };
    return proj;
  }

  directionVector() {
    return normalizeVector(subVectors(this.p2, this.p1));
  }

  draw(ctx, { width = 2, color = "black", dash = [] } = {}) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
