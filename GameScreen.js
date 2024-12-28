const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1792
canvas.height = 936

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png',
  scale:1.75
})

const shop = new Sprite({
  position: {
    x: 1050,
    y: 224
  },
  imageSrc: './img/shop.png',
  scale:4.8125,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      audioSrc: './audio/samuraiMack/Attack1.mp3',
      framesMax: 6
    },
    attack2: {
      imageSrc: './img/samuraiMack/Attack2.png',
      audioSrc: './audio/samuraiMack/Attack2.mp3',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      audioSrc: './audio/samuraiMack/Take Hit.mp3',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      audioSrc: './audio/samuraiMack/Death.mp3',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 1700,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      audioSrc: './audio/kenji/Attack1.mp3',
      framesMax: 4
    },
    attack2: {
      imageSrc: './img/kenji/Attack2.png',
      audioSrc: './audio/kenji/Attack2.mp3',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      audioSrc: './audio/kenji/Take Hit.mp3',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      audioSrc: './audio/kenji/Death.mp3',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  l: {
    pressed: false
  },
  j: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  if (keys.j.pressed && enemy.lastKey === 'j') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.l.pressed && enemy.lastKey === 'l') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()
const backgroundMusic= new Audio("./audio/background.mp3");
var isPlaying=false;

window.addEventListener('keydown', (event) => {
  switch (event.key)
  {
  case "m":
      if (isPlaying)
      {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      }
      else
      {
        backgroundMusic.play();
        backgroundMusic.loop=true;
      }
      isPlaying=!isPlaying;
  break;
  case "Escape":
      {
        window.location.href = 'HomeScreen.html';
      }
    }
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (player.velocity.y == 0)
        player.velocity.y = -20
        break
      case 'e':
        player.attack1()
        break
      case 'q':
        player.attack2()
        break  
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'j':
        keys.j.pressed = true
        enemy.lastKey = 'j'
        break
      case 'l':
        keys.l.pressed = true
        enemy.lastKey = 'l'
        break
      case 'i':
        if (enemy.velocity.y == 0)
        enemy.velocity.y = -20
        break
      case 'u':
        enemy.attack1()
        break
      case 'o':
        enemy.attack2()
        break  
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch (event.key) {
    case 'l':
      keys.l.pressed = false
      break
    case 'j':
      keys.j.pressed = false
      break
  }
})