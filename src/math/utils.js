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
function average(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function normalizeVector(v) {
  return scaleVector(v, 1 / magnitude(v));
}

function magnitude(v) {
  return Math.hypot(v.x, v.y);
}

function translate(loc, angle, offset) {
  return new Point(
    loc.x + offset * Math.cos(angle),
    loc.y + offset * Math.sin(angle)
  );
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  const epsilon = 0.0001;
  if (Math.abs(bottom) > epsilon) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerp2d(p1, p2, t) {
  return new Point(lerp(p1.x, p2.x, t), lerp(p1.y, p2.y, t));
}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}
function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}
