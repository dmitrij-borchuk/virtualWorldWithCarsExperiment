const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

canvas.addEventListener("contextmenu", (e) => e.preventDefault());
const viewport = new Viewport(canvas);
const savedData = JSON.parse(localStorage.getItem("graph"));
const graph = Graph.load(savedData);
const world = new World(graph, 100, 10);
const graphBtn = document.getElementById("graphBtn");
const stopBtn = document.getElementById("stopBtn");

graph.draw(ctx);

const graphEditor = new GraphEditor(viewport, graph);
const stopEditor = new StopEditor(viewport, world);
let oldGraphHash = graph.hash();

setMode("graph");

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
  stopEditor.draw();
  requestAnimationFrame(animate);
}

function dispose() {
  graphEditor.dispose();
}
function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}

function setMode(mode) {
  disableEditors();

  switch (mode) {
    case "graph":
      stopBtn.disabled = false;
      graphEditor.enable();
      break;
    case "stop":
      graphBtn.disabled = false;
      stopEditor.enable();
      break;
  }
}

function disableEditors() {
  graphBtn.disabled = true;
  stopBtn.disabled = true;

  graphEditor.disable();
  stopEditor.disable();
}
