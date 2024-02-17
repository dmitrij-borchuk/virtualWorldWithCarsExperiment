// @ts-check
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, { size = 18, fill = "black", outline = "" } = {}) {
    if (fill) {
      ctx.beginPath();
      ctx.fillStyle = fill;
      ctx.arc(this.x, this.y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (outline) {
      ctx.beginPath();
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2;
      ctx.arc(this.x, this.y, size / 2, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}
