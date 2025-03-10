class Stop extends Marking {
  constructor(position, direction, width, height) {
    super(position, direction, width, height);
    this.border = this.poly.segments[2];

    this.type = "stop";
  }

  draw(ctx) {
    this.border.draw(ctx, { color: "white", width: 4 });

    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.direction) - Math.PI / 2);
    ctx.scale(1, 3);

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold ${this.height * 0.3}px sans-serif`;
    ctx.fillText("STOP", 0, 1);

    ctx.restore();
  }
}
