// @ts-check

function getNearestPoint(points, loc, threshold = Number.MAX_SAFE_INTEGER) {
  let nearest = null;
  let minDist = Infinity;
  for (const point of points) {
    const dist = distance(point, loc);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  }
  return nearest;
}

function distance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function addVectors(v1, v2) {
  return new Point(v1.x + v2.x, v1.y + v2.y);
}

function subVectors(v1, v2) {
  return new Point(v1.x - v2.x, v1.y - v2.y);
}

function scaleVector(v, s) {
  return new Point(v.x * s, v.y * s);
}

function translate(loc, angle, offset) {
  return new Point(
    loc.x + offset * Math.cos(angle),
    loc.y + offset * Math.sin(angle)
  );
}
