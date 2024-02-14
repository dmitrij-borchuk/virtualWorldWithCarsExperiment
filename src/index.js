const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const p1 = new Point(100, 100);
const p2 = new Point(200, 100);
const p3 = new Point(200, 200);
const p4 = new Point(100, 200);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p2, p3);
const s3 = new Segment(p3, p4);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3]);
graph.draw(ctx);

function addRandomPoint() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const p = new Point(x, y);
  graph.tryAddPoint(p);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}

function addRandomSegment() {
  const p1 = graph.points[Math.floor(Math.random() * graph.points.length)];
  const p2 = graph.points[Math.floor(Math.random() * graph.points.length)];
  if (p1.equals(p2)) {
    return;
  }
  const s = new Segment(p1, p2);
  graph.tryAddSegment(s);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
}
