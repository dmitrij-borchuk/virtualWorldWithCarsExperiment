const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const viewport = new Viewport(canvas);
const savedData = JSON.parse(localStorage.getItem("graph"));
const graph = Graph.load(savedData);
const world = new World(graph, 100, 10);

graph.draw(ctx);

const graphEditor = new GraphEditor(viewport, graph);
let oldGraphHash = graph.hash();

animate();
function animate() {
  viewport.reset();
  if (oldGraphHash !== graph.hash()) {
    world.generate();
    oldGraphHash = graph.hash();
  }
  const viewPoint = scaleVector(viewport.getOffset(), -1);
  world.draw(viewPoint);
  ctx.globalAlpha = 0.3;
  graphEditor.draw();
  requestAnimationFrame(animate);
}

function dispose() {
  graphEditor.dispose();
}
function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
