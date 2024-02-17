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
