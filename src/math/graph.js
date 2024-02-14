class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  addPoint(point) {
    this.points.push(point);
  }

  tryAddPoint(point) {
    if (this.containsPoint(point)) {
      return false;
    }
    this.addPoint(point);
    return true;
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  tryAddSegment(segment) {
    if (this.containsSegment(segment)) {
      return false;
    }
    this.addSegment(segment);
    return true;
  }

  containsSegment(segment) {
    for (const seg of this.segments) {
      if (seg.equals(segment)) {
        return true;
      }
    }
    return false;
  }

  containsPoint(point) {
    for (const p of this.points) {
      if (p.equals(point)) {
        return true;
      }
    }
    return false;
  }

  draw(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx);
    }
    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}
