// @ts-check
class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.graph = graph;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => this.#onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.#onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.#onMouseUp(e));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  #onMouseDown(e) {
    if (e.button === 2) {
      if (this.selected) {
        this.selected = null;
        return;
      }
      if (this.hovered) {
        this.#removePoint(this.hovered);
        return;
      }
    }
    if (this.hovered) {
      this.#select(this.hovered);
      this.dragging = true;

      return;
    }
    this.#addPoint(this.mouse);
  }

  #onMouseUp(e) {
    this.dragging = false;
    // this.dragged = false;
    // this.draggedPoint = null;
    // this.draggedSegment = null;
  }

  #onMouseMove(e) {
    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;
    this.mouse = new Point(x, y);
    this.hovered = getNearestPoint(this.graph.points, this.mouse, 10);

    if (this.dragging) {
      this.selected.x = x;
      this.selected.y = y;
    }
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    if (point === this.selected) {
      this.selected = null;
    }
    this.hovered = null;
  }

  #select(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }
  #addPoint(point) {
    this.graph.addPoint(point);

    this.#select(point);
    this.hovered = point;
  }

  draw() {
    graph.draw(this.ctx);

    if (this.selected) {
      const intent = this.hovered ?? this.mouse;
      new Segment(this.selected, intent).draw(this.ctx, {
        dash: [3, 3],
      });
      this.selected.draw(this.ctx, {
        fill: "white",
      });
    }
    if (this.hovered) {
      this.hovered.draw(this.ctx, {
        size: 24,
        fill: false,
        outline: "#ccc",
      });
    }
  }
}
