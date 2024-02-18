// @ts-check
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

  removePoint(point) {
    if (!point) {
      return;
    }
    this.points = this.points.filter((p) => !p.equals(point));
    const segs = this.getSegmentsOfPoint(point);
    for (const seg of segs) {
      this.removeSegment(seg);
    }
  }

  removeSegment(segment) {
    this.segments = this.segments.filter((s) => !s.equals(segment));
  }

  getSegmentsOfPoint(point) {
    return this.segments.filter((seg) => seg.includes(point));
  }

  hash() {
    return JSON.stringify(this);
  }

  dispose() {
    this.points = [];
    this.segments = [];
  }

  getNearestPoint(point) {
    let minDist = Infinity;
    return getNearestPoint(this.points, point);
  }

  draw(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx);
    }
    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  static load(json) {
    const points = json?.points?.map((p) => new Point(p.x, p.y)) ?? [];
    const segments =
      json?.segments?.map(
        (s) =>
          new Segment(
            points.find((p) => p.equals(s.p1)),
            points.find((p) => p.equals(s.p2))
          )
      ) ?? [];

    return new Graph(points, segments);
  }
}
