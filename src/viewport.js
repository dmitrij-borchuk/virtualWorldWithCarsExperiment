class Viewport {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.zoom = 2;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scaleVector(this.center, -1);
    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.#addEventListeners();
  }

  getMousePos(e, subtractDragOffset = false) {
    const p = new Point(
      (e.offsetX - this.center.x) * this.zoom - this.offset.x,
      (e.offsetY - this.center.y) * this.zoom - this.offset.y
    );

    return subtractDragOffset ? subVectors(p, this.drag.offset) : p;
  }

  getOffset() {
    return addVectors(this.offset, this.drag.offset);
  }

  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousewheel", (e) => this.#onWheel(e));
    this.canvas.addEventListener("mousedown", (e) => this.#onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.#onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.#onMouseUp(e));
  }

  #onWheel(e) {
    e.preventDefault();
    const sign = Math.sign(e.deltaY);
    const step = 0.1;
    this.zoom += sign * step;
    this.zoom = Math.max(1, Math.min(10, this.zoom));
  }

  #onMouseDown(e) {
    if (e.button !== 1) {
      return;
    }
    this.drag.active = true;
    this.drag.start = this.getMousePos(e);
  }
  #onMouseMove(e) {
    if (!this.drag.active) {
      return;
    }

    this.drag.end = this.getMousePos(e);
    this.drag.offset = subVectors(this.drag.end, this.drag.start);
  }
  #onMouseUp(e) {
    if (!this.drag.active) {
      return;
    }

    this.offset = addVectors(this.offset, this.drag.offset);
    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };
  }
}
