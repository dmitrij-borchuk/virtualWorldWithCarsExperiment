class World {
  constructor(
    graph,
    roadWidth = 100,
    roadRoundness = 3,
    buildingsConfig,
    treesConfig
  ) {
    this.graph = graph;
    this.envelopes = [];
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.roadBorders = [];

    this.buildingsConfig = {
      ...{
        width: 100,
        spacing: 50,
        minLength: 100,
      },
      ...buildingsConfig,
    };
    this.treesConfig = {
      ...{
        size: 100,
      },
      ...treesConfig,
    };
    this.buildings = [];
    this.trees = [];

    this.generate();
  }
  generate() {
    this.envelopes = this.graph.segments.map(
      (s) => new Envelope(s, this.roadWidth, this.roadRoundness)
    );

    this.roadBorders = Polygon.union(this.envelopes.map((d) => d.poly));

    this.buildings = this.#generateBuildings();
    this.trees = this.#generateTrees();
  }
  #generateBuildings() {
    const tmpEnvelopes = [];
    for (const seg of this.graph.segments) {
      const envelope = new Envelope(
        seg,
        this.roadWidth +
          this.buildingsConfig.width +
          this.buildingsConfig.spacing * 2,
        this.roadRoundness
      );
      tmpEnvelopes.push(envelope);
    }
    const guides = Polygon.union(tmpEnvelopes.map((d) => d.poly));
    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];
      if (guide.length() < this.buildingsConfig.minLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    const supports = [];
    for (const seg of guides) {
      const len = seg.length() + this.buildingsConfig.spacing;
      const count = Math.floor(
        len / (this.buildingsConfig.minLength + this.buildingsConfig.spacing)
      );
      const buildingLength = len / count - this.buildingsConfig.spacing;
      const dir = seg.directionVector();

      let q1 = seg.p1;
      let q2 = addVectors(seg.p1, scaleVector(dir, buildingLength));
      supports.push(new Segment(q1, q2));

      for (let i = 1; i < count; i++) {
        q1 = addVectors(q2, scaleVector(dir, this.buildingsConfig.spacing));
        q2 = addVectors(q1, scaleVector(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    const bases = [];
    for (const seg of supports) {
      const envelope = new Envelope(seg, this.buildingsConfig.width);
      bases.push(envelope.poly);
    }

    const epsilon = 0.0001;
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (
          bases[i].intersects(bases[j]) ||
          bases[i].distanceToPoly(bases[j]) <
            this.buildingsConfig.spacing - epsilon
        ) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases;
  }

  #generateTrees() {
    const points = [
      ...this.roadBorders.map((d) => [d.p1, d.p2]).flat(),
      ...this.buildings.map((d) => d.points).flat(),
    ];
    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    const illegalPolys = [
      ...this.buildings,
      ...this.envelopes.map((d) => d.poly),
    ];
    const trees = [];
    let tryCount = 0;
    let maxSteps = 10000;
    while (tryCount < 100 && maxSteps > 0) {
      maxSteps--;
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(top, bottom, Math.random())
      );
      let keep = true;

      // Check if the point is inside buildings or roads
      for (const poly of illegalPolys) {
        if (
          poly.isPointInside(p) ||
          poly.distanceToPoint(p) < this.treesConfig.size / 2
        ) {
          keep = false;
          break;
        }
      }

      if (keep) {
        // Check if the point is too close to other trees
        for (const t of trees) {
          if (distance(t.center, p) < this.treesConfig.size) {
            keep = false;
            break;
          }
        }
      }

      if (keep) {
        // Check if the point is close to something (not to draw trees far from the roads or buildings)
        let closeToSomething = false;
        for (const poly of illegalPolys) {
          if (poly.distanceToPoint(p) < this.treesConfig.size * 2) {
            closeToSomething = true;
            break;
          }
        }

        keep = closeToSomething;
      }

      if (keep) {
        trees.push(new Tree(p, this.treesConfig.size));
        tryCount = 0;
      }
      tryCount++;
    }
    return trees;
  }
  draw(viewPoint) {
    this.envelopes.forEach((d) =>
      d.draw(ctx, { color: "#bbb", stroke: "#bbb", lineWidth: 15 })
    );

    this.graph.segments.forEach((s) =>
      s.draw(ctx, { color: "white", width: 4, dash: [10, 10] })
    );

    this.roadBorders.map((s) => s.draw(ctx, { color: "white", width: 4 }));

    this.buildings.forEach((b) => b.draw(ctx));
    this.trees.forEach((t) => t.draw(ctx, viewPoint));
  }
}
