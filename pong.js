class Vect {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {

  constructor(w, h) {
    this.pos = new Vect;
    this.size = new Vect(w, h);
  }

  get left() {
    return this.pos.x - this.size.x / 2;
  }

  get right() {
    return this.pos.x + this.size.x / 2;
  }

  get top() {
    return this.pos.y - this.size.y / 2;
  }

  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {

  constructor() {
    super(10, 10);
    this.vel = new Vect;
  }
}

class Player extends Rect {

  constructor() {
    super(25, 150);
    this.score = 0
  }
}

class Pong {

  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d')

    this.ball = new Ball;

    this.players = [
      new Player,
      new Player
    ]

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2;
    })

    let lastTime;
    const callback = (millis) => {
      if (lastTime) {
        this.update((millis - lastTime) / 1000);
      }
      lastTime = millis;
      requestAnimationFrame(callback);
    }
    callback();
    this.reset();
  }

  collide(player, ball) {
    if(player.left < ball.right && player.right > ball.left && 
      player.top < ball.bottom && player.bottom > ball.top) {
         ball.vel.x = -ball.vel.y;
      }
  }

  draw() {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);

    this.players.forEach(player => this.drawRect(player));
  }

  drawRect(rect) {
    this._context.fillStyle = '#FFF';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  start() {
    if(this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 150;
      this.ball.vel.y = 150;
    }
  }

  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
  
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      let playerId;
      if (this.ball.vel.x < 0) {
        playerId = 1
      } else {
        playerId = 0
      }
      this.players[playerId].score++;
      this.reset()
      this.ball.vel.x = -this.ball.vel.x; 
    }
    
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    this.players[1].pos.y = this.ball.pos.y;

    this.draw();

    this.players.forEach(player => this.collide(player, this.ball));
  }
  
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
  pong.players[0].pos.y = event.offsetY;
})

canvas.addEventListener('click', event => {
  pong.start();
})