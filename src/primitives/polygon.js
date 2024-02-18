class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = this.#generateSegments();
  }

  #generateSegments() {
    const segments = [];
    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i];
      const p2 = this.points[(i + 1) % this.points.length];
      segments.push(new Segment(p1, p2));
    }
    return segments;
  }

  intersects(other) {
    for (const seg of this.segments) {
      for (const otherSeg of other.segments) {
        if (getIntersection(seg.p1, seg.p2, otherSeg.p1, otherSeg.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  draw(ctx, { stroke, lineWidth = 2, color = "rgba(0,0,255,0.3)" } = {}) {
    if (this.points.length < 3) {
      return;
    }
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawSegments(ctx) {
    this.segments.forEach((s) =>
      s.draw(ctx, { color: getRandomColor(), width: 5 })
    );
  }

  containsSegment(seg) {
    const midPoint = average(seg.p1, seg.p2);
    return this.isPointInside(midPoint);
  }

  containsPoint(point) {
    for (const p of this.points) {
      if (p.equals(point)) {
        return true;
      }
    }
    return false;
  }

  isPointInside(point) {
    const outerPoint = new Point(
      Math.max(...this.points.map((p) => p.x)) + 100,
      Math.max(...this.points.map((p) => p.y)) + 100
    );
    const ray = new Segment(point, outerPoint);
    let count = 0;
    for (const seg of this.segments) {
      if (getIntersection(ray.p1, ray.p2, seg.p1, seg.p2)) {
        count++;
      }
    }

    return count % 2 === 1;
  }

  distanceToPoint(point) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }
  distanceToPoly(poly) {
    return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
  }

  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const intersection = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );

        if (
          intersection &&
          intersection.offset !== 1 &&
          intersection.offset !== 0
        ) {
          const point = new Point(intersection.x, intersection.y);

          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));

          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  static multiBreak(polygons) {
    for (let i = 0; i < polygons.length - 1; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        Polygon.break(polygons[i], polygons[j]);
      }
    }
  }

  static union(polys) {
    Polygon.multiBreak(polys);
    const kept = [];
    for (let i = 0; i < polys.length; i++) {
      for (const seg of polys[i].segments) {
        let keep = true;
        for (let j = 0; j < polys.length; j++) {
          if (i !== j && polys[j].containsSegment(seg)) {
            keep = false;
            break;
          }
        }
        if (keep) {
          kept.push(seg);
        }
      }
    }
    return kept;
  }
}
