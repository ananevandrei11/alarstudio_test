function StarCanvas() {
  this.canvas_h_600 = document.getElementById("canvas_h_600");
  this.canvas_h_50 = document.getElementById("canvas_h_50");
  this.canvasInput = null;
  this.canvasOutput = null;
  this.coordsStars = [];
}

StarCanvas.prototype.setCanvas = function (elem) {
  return elem.getContext("2d");
};

StarCanvas.prototype.starDraw = function (ctx, x, y, size, color) {
  // Source for function of create star - https://codepen.io/hmonika/pen/vYNJmzb?editors=1010
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size * 0.85, y + size * 0.5);
  ctx.lineTo(x + size * 0.5, y - size * 0.4);
  ctx.lineTo(x + size * 0.15, y + size * 0.5);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
  this.coordsStars.push({
    color,
    startX: x,
    endX: x + size,
    startY: y - size / 2,
    endY: y - size / 2 + size,
  });
};

StarCanvas.prototype.setCoordClick = function (event) {
  return {
    x: event.pageX - event.target.offsetLeft,
    y: event.pageY - event.target.offsetTop,
  };
};

StarCanvas.prototype.fillColorCanvasOutput = function (color) {
  this.canvasOutput.fillStyle = color;
  this.canvasOutput.fillRect(0, 0, 600, 50);
};

StarCanvas.prototype.compareCoordsClickAndStar = function (event) {
  let _this = this;
  let { x, y } = this.setCoordClick(event);
  let currentColor = "white";
  this.coordsStars.forEach((star, index) => {
    if (
      x <= star.endX &&
      x >= star.startX &&
      y <= star.endY &&
      y >= star.startY
    ) {
      currentColor = star.color;
    }
  });
  _this.fillColorCanvasOutput(currentColor);
};

StarCanvas.prototype.addHendlers = function () {
  let _this = this;

  this.canvas_h_600.addEventListener("click", (e) =>
    _this.compareCoordsClickAndStar(e)
  );
};

StarCanvas.prototype.init = function () {
  this.canvasInput = this.setCanvas(this.canvas_h_600);
  this.canvasOutput = this.setCanvas(this.canvas_h_50);

  this.starDraw(this.canvasInput, 50, 50, 50, "red");
  this.starDraw(this.canvasInput, 50, 125, 50, "blue");
  this.starDraw(this.canvasInput, 50, 200, 50, "green");
  this.starDraw(this.canvasInput, 50, 275, 50, "yellow");
  this.starDraw(this.canvasInput, 50, 350, 50, "black");

  this.addHendlers();
};

const starCnavas = new StarCanvas();
starCnavas.init();
