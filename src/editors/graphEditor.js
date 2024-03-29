// @ts-check
// TODO: zoom and click without moving mouse - wrong position

class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.ctx = viewport.canvas.getContext("2d");
    this.graph = graph;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;
  }

  dispose() {
    graph.dispose();
    this.selected = null;
    this.hovered = null;
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", this.#onMouseDown);
    this.canvas.addEventListener("mousemove", this.#onMouseMove);
    this.canvas.addEventListener("mouseup", this.#onMouseUp);
  }
  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.#onMouseDown);
    this.canvas.removeEventListener("mousemove", this.#onMouseMove);
    this.canvas.removeEventListener("mouseup", this.#onMouseUp);
  }
  #onMouseDown = (e) => {
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
    if (e.button === 0) {
      if (this.hovered) {
        this.#select(this.hovered);
        this.dragging = true;

        return;
      }
      this.#addPoint(this.mouse);
    }
  };

  #onMouseUp = (e) => {
    this.dragging = false;
    // this.dragged = false;
    // this.draggedPoint = null;
    // this.draggedSegment = null;
  };

  #onMouseMove = (e) => {
    this.mouse = this.viewport.getMousePos(e, true);
    this.hovered = getNearestPoint(
      this.graph.points,
      this.mouse,
      10 * this.viewport.zoom
    );

    if (this.dragging) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  };

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

    // Cursor
    // this.mouse?.draw(this.ctx, {
    //   size: 4,
    //   fill: false,
    //   outline: "red",
    // });
  }

  enable() {
    this.#addEventListeners();
  }
  disable() {
    this.#removeEventListeners();
    this.selected = null;
    this.hovered = null;
  }
}
