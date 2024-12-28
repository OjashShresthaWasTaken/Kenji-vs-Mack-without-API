function openRules() {
    document.getElementById('rules-box').style.display = 'block';
  }
  
  function closeRules() {
    document.getElementById('rules-box').style.display = 'none';
  }
  
  function openScore() {
    document.getElementById('scorebox').style.display = 'block';
    updateScoreDisplay();
  }
  
  function closeScore() {
    document.getElementById('scorebox').style.display = 'none';
  }
  
  function updateScoreDisplay() {
    const scores = JSON.parse(localStorage.getItem('gameScores')) || {
      playerWins: 0,
      enemyWins: 0,
      ties: 0,
    };
    document.getElementById('player-wins').textContent = scores.playerWins;
    document.getElementById('enemy-wins').textContent = scores.enemyWins;
    document.getElementById('ties').textContent = scores.ties;
  }
  
  function saveScores({ playerWins, enemyWins, ties }) {
    const scores = {
      playerWins: playerWins || 0,
      enemyWins: enemyWins || 0,
      ties: ties || 0,
    };
    localStorage.setItem('gameScores', JSON.stringify(scores));
  }
  
  const canvas = document.querySelector('canvas');
  const c = canvas.getContext('2d');
  
  canvas.width = 1792;
  canvas.height = 936;
  
  class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
      this.position = position;
      this.image = new Image();
      this.image.src = imageSrc;
      this.scale = scale;
      this.framesMax = framesMax;
      this.framesCurrent = 0;
      this.framesElapsed = 0;
      this.framesHold = 10;
      this.offset = offset;
    }
  
    draw() {
      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      );
    }
  
    animateFrames() {
      this.framesElapsed++;
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++;
        } else {
          this.framesCurrent = 0;
        }
      }
    }
  
    update() {
      this.draw();
      if (this.framesMax > 1) this.animateFrames();
    }
  }
  
  const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png',
    scale: 1.75,
  });
  
  const shop = new Sprite({
    position: { x: 1050, y: 224 },
    imageSrc: './img/shop.png',
    scale: 4.8125,
    framesMax: 6,
  });
  
  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
  }
  
  animate();
  
  window.onload = updateScoreDisplay;
  