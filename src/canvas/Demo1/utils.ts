// @ts-nocheck
export const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

export class Point {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.r = 4; // 圆的半径
    this.x = getRandom(0, canvas.width - this.r / 2); // 圆心的x坐标
    this.y = getRandom(0, canvas.height - this.r / 2); // 圆心的y坐标
    this.xSpeed = getRandom(-50, 50); // 圆心x轴的速度
    this.ySpeed = getRandom(-50, 50); // 圆心x轴的速度
    this.lastDrawTime = null;
  }
  draw() {
    if (!this.lastDrawTime) {
      this.lastDrawTime = Date.now();
    } else {
      const now = Date.now();
      const delta = (now - this.lastDrawTime) / 1000;
      let x = this.x + this.xSpeed * delta;
      let y = this.y + this.ySpeed * delta;
      if (x < 0) {
        x = 0;
        this.xSpeed = -this.xSpeed;
      } else if (x > this.canvas.width - this.r / 2) {
        x = this.canvas.width - this.r / 2;
        this.xSpeed = -this.xSpeed;
      }
      if (y < 0) {
        y = 0;
        this.ySpeed = -this.ySpeed;
      } else if (y > this.canvas.height - this.r / 2) {
        y = this.canvas.height - this.r / 2;
        this.ySpeed = -this.ySpeed;
      }
      this.x = x;
      this.y = y;
      this.lastDrawTime = now;
    }

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgb(200, 200, 200)';
    this.ctx.fill();
  }
}

export class Graph {
  constructor(ctx, canvas, pointNumber = 40, maxDistance = 300) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.points = Array(pointNumber)
      .fill(0)
      .map(() => new Point(this.ctx, this.canvas));
    this.maxDistance = maxDistance;
    this.draw();
  }
  draw() {
    requestAnimationFrame(() => {
      this.draw();
    });
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i];
      p1.draw();
      for (let j = i + 1; j < this.points.length; j++) {
        const p2 = this.points[j];
        const distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
        );
        const opacity = 1 - distance / this.maxDistance;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
        this.ctx.stroke();
      }
    }
  }
}
