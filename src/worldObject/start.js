class Start extends Marking {
  constructor(position, direction, width, height) {
    super(position, direction, width, height);

    this.image = new Image();
    this.image.src = "assets/taxi.png";
    this.type = "start";
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.direction) - Math.PI);

    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width * 2,
      this.height
    );

    ctx.restore();
  }
}
