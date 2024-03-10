const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext("2d");

canvas.addEventListener("contextmenu", (e) => e.preventDefault());
const savedData = JSON.parse(localStorage.getItem("world"));
let world = savedData ? World.load(savedData) : new World(new Graph());
const graph = world.graph;
// const world = new World(graph, 100, 10);
const viewport = new Viewport(canvas, world.offset, world.zoom);

graph.draw(ctx);

const tools = {
  graph: { button: graphBtn, editor: new GraphEditor(viewport, graph) },
  stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
  crossing: {
    button: crossingBtn,
    editor: new CrossingEditor(viewport, world),
  },
  start: { button: startBtn, editor: new StartEditor(viewport, world) },
};
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
  for (const tool of Object.values(tools)) {
    tool.editor.draw();
  }
  requestAnimationFrame(animate);
}

function dispose() {
  tools.graph.editor.dispose();
  world.markings = [];
}
function save() {
  world.zoom = viewport.zoom;
  world.offset = viewport.offset;
  const el = document.createElement("a");
  el.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(world))
  );

  const fileName = "name.world";
  el.setAttribute("download", fileName);
  el.click();

  localStorage.setItem("world", JSON.stringify(world));
}

function setMode(mode) {
  disableEditors();
  tools[mode].button.disabled = true;
  tools[mode].editor.enable();
}

function disableEditors() {
  for (const tool of Object.values(tools)) {
    tool.button.disabled = false;
    tool.editor.disable();
  }
}

function load(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);
    const world = World.load(data);

    localStorage.setItem("world", JSON.stringify(world));
    location.reload();
  };
  reader.readAsText(file);
}
