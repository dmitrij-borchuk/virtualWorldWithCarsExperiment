class Crossing {
  constructor(viewport, world) {
    this.viewport = viewport;
    this.world = world;
    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouse = null;
    this.intend = null;
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", this.#onMouseDown);
    this.canvas.addEventListener("mousemove", this.#onMouseMove);
  }
  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.#onMouseDown);
    this.canvas.removeEventListener("mousemove", this.#onMouseMove);
  }

  #onMouseMove = (e) => {
    this.mouse = this.viewport.getMousePos(e, true);
    const seg = getNearestSegment(
      this.world.graph.segments,
      this.mouse,
      10 * this.viewport.zoom
    );

    if (seg) {
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intend = new Stop(
          proj.point,
          seg.directionVector(),
          world.roadWidth,
          world.roadWidth / 2
        );
      }
    } else {
      this.intend = null;
    }
  };

  #onMouseDown = () => {};

  draw() {
    if (this.intend) {
      this.intend.draw(this.ctx, { color: "white", width: 4 });
    }
  }
  enable() {
    this.#addEventListeners();
  }
  disable() {
    this.#removeEventListeners();
  }
}
