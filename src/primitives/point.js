class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, size = 18, color = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, size / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}
