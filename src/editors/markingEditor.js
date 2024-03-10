class MarkingEditor {
  constructor(viewport, world, targetSegments) {
    this.viewport = viewport;
    this.world = world;
    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouse = null;
    this.intend = null;
    this.markings = world.markings;
    this.targetSegments = targetSegments;
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
      this.targetSegments,
      this.mouse,
      10 * this.viewport.zoom
    );

    if (seg) {
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intend = this.createMarking(proj.point, seg.directionVector());
      }
    } else {
      this.intend = null;
    }
  };

  createMarking(center, directionVector) {
    return center;
  }

  #onMouseDown = (e) => {
    if (e.button === 0) {
      if (this.intend) {
        this.markings.push(this.intend);
        this.intend = null;
      }
    } else if (e.button === 2) {
      for (let i = 0; i < this.markings.length; i++) {
        if (this.markings[i].poly.isPointInside(this.mouse)) {
          this.markings.splice(i, 1);
          break;
        }
      }
    }
  };

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
