const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const viewport = new Viewport(canvas);
const savedData = JSON.parse(localStorage.getItem("graph"));
const graph = Graph.load(savedData);
graph.draw(ctx);

const graphEditor = new GraphEditor(viewport, graph);

animate();
function animate() {
  viewport.reset();
  graphEditor.draw();
  new Envelope(graph.segments[0], 100).draw(ctx);
  requestAnimationFrame(animate);
}

// function addRandomPoint() {
//   const x = Math.random() * canvas.width;
//   const y = Math.random() * canvas.height;
//   const p = new Point(x, y);
//   graph.tryAddPoint(p);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   graph.draw(ctx);
// }

// function addRandomSegment() {
//   const p1 = graph.points[Math.floor(Math.random() * graph.points.length)];
//   const p2 = graph.points[Math.floor(Math.random() * graph.points.length)];
//   if (p1.equals(p2)) {
//     return;
//   }
//   const s = new Segment(p1, p2);
//   graph.tryAddSegment(s);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   graph.draw(ctx);
// }

// function removeRandomSegment() {
//   graph.segments.pop();
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   graph.draw(ctx);
// }

// function removeRandomPoint() {
//   const index = Math.floor(Math.random() * graph.points.length);
//   graph.removePoint(graph.points[index]);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   graph.draw(ctx);
// }

function dispose() {
  graphEditor.dispose();
}
function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
