const canvas = document.getElementById('GameCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');

const timer = new Timer(10 * 60 * 1000, timerDisplay);
const game = new PegSolitaire(ctx);

let gameFinished = false

timer.start();


class Timer {
      constructor(duration, display) {
        this.duration = duration;
        this.display = display;
        this.startTime = null;
        this.running = false;
      }

      start() {
        this.startTime = performance.now();
        this.running = true;
        this.update();
      }

      format(msLeft) {
        const totalMs = Math.max(msLeft, 0);
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
      }

      update = () => {
        if (!this.running) return;
        const now = performance.now();
        const elapsed = now - this.startTime;
        const remaining = this.duration - elapsed;
        this.display.textContent = this.format(remaining);
        if (remaining > 0) {
          requestAnimationFrame(this.update);
        } else {
          this.running = false;
          this.display.textContent = "00:00:00";
          alert("¡Tiempo terminado!");
        }
      }
    }


class PegSolitaire {
      constructor(ctx) {
        this.ctx = ctx;
        this.size = 7;
        this.cellSize = 60;
        this.board = this.createBoard();
        this.selected = null;
        canvas.addEventListener('click', this.handleClick.bind(this));
        this.draw();
      }

      createBoard() {
        const board = Array.from({ length: this.size }, (_, y) =>
          Array.from({ length: this.size }, (_, x) => {
            const isValid = (x >= 2 && x <= 4) || (y >= 2 && y <= 4);
            return isValid ? 1 : null;
          })
        );
        board[3][3] = 0; // Centro vacío
        return board;
      }

      draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < this.size; y++) {
          for (let x = 0; x < this.size; x++) {
            const val = this.board[y][x];
            if (val !== null) {
              const cx = x * this.cellSize + this.cellSize / 2;
              const cy = y * this.cellSize + this.cellSize / 2;
              this.ctx.beginPath();
              this.ctx.arc(cx, cy, 20, 0, Math.PI * 2);
              this.ctx.fillStyle = val === 1 ? 'blue' : 'white';
              this.ctx.fill();
              this.ctx.strokeStyle = 'black';
              this.ctx.stroke();
              if (this.selected && this.selected.x === x && this.selected.y === y) {
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
              }
            }
          }
        }
        if (gameFinished) {
          ctx.save();
              ctx.drawImage(img, offsetX, offsetY, pieceW*2, pieceH*2);
              ctx.font = '40px Poppins, Helvetica';
              ctx.fillStyle = 'rgba(255, 255, 255, 1)';
              ctx.textAlign = 'center';
              ctx.fillText('🎉 Congratulations!!', canvas.width/5, 120);
              ctx.fillText('All levels completed!', canvas.width/5.2, 190);
              ctx.font = '20px Poppins, Helvetica';
              ctx.fillText('Return to MENU to play again!', canvas.width/5.2, 260);
              ctx.font = '24px Poppins, Helvetica';
              reset();
          ctx.restore();
          return;
        }
      }

      handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.cellSize);
        if (this.board[y][x] === 1) {
          this.selected = { x, y };
        } else if (this.board[y][x] === 0 && this.selected) {
          if (this.isValidMove(this.selected.x, this.selected.y, x, y)) {
            this.makeMove(this.selected.x, this.selected.y, x, y);
            this.selected = null;
          }
        }
        this.draw();
      }

      isValidMove(sx, sy, dx, dy) {
        const mx = (sx + dx) / 2;
        const my = (sy + dy) / 2;
        const dxAbs = Math.abs(dx - sx);
        const dyAbs = Math.abs(dy - sy);
        if ((dxAbs === 2 && dyAbs === 0) || (dxAbs === 0 && dyAbs === 2)) {
          return this.board[my][mx] === 1;
        }
        return false;
      }

      makeMove(sx, sy, dx, dy) {
        const mx = (sx + dx) / 2;
        const my = (sy + dy) / 2;
        this.board[sy][sx] = 0;
        this.board[my][mx] = 0;
        this.board[dy][dx] = 1;
      }
    }
