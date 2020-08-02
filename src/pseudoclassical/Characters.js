if (typeof window === 'undefined') {
  var jsdom = require('jsdom');
  var { JSDOM } = jsdom;
  var { document } = (new JSDOM('')).window;
  var drangonBallCharacters = [];
  var imgs = {
    SonOgong: {
      normal: 'https://thewiki.ewr1.vultrobjects.com/data/eb939cebb3bced8c8c5feab384ec9995eab68c5fec98a4eab3b52e706e67.png',
      superSaiyan1: 'https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F21460A47586ADFB91C',
      superSaiyan3: 'https://mblogthumb-phinf.pstatic.net/20150917_31/wleorms_1442481742506E9esW_PNG/%C3%CA%BB%E7%C0%CC%BE%F03.png?type=w2',
      wonkiok: './src/pseudoclassical/img/sog-wonkiok.png'
    },
    SonOban: {
      normal: 'https://ww.namu.la/s/e64d5f51fc9786ca9960dcf390b2e07e058f45650c7f2d3a45629b67ebf67142ee6e2446e2b5c58b215ead9c2381eb0d3497bc20be08600c4f5571dac51f834c3d4f33216c99471b396ea58b0ceeda5c8f6d704770858c476b92ea3d194e495afe9a154e71fd9ae327f82459ba45ef66',
      superSaiyan1: './src/pseudoclassical/img/sonoban.png',
    },
    Vegeta: {
      normal: './src/pseudoclassical/img/vegeta.png',
      superSaiyan1: 'https://thewiki.ewr1.vultrobjects.com/data/44424620ebb2a0eca780ed84b028ecb488292e706e67.png',

    },
    MineBoo: 'https://thewiki.ewr1.vultrobjects.com/data/44424620ebb680ec9ab028ec889cec8898292e706e67.png',
    MineBooAttacked: './src/pseudoclassical/img/mineboo-attacked.png',
    explosion: './src/pseudoclassical/img/explosion.png',
    wonkiokExplosion: './src/pseudoclassical/img/wonkiok-explosion.png',
  };

  var dragged;
} // you don't have to worry about this code. this is for testing.

// blinkyDancer를 pseudoclassical한 방식으로 리팩토링하세요
// 참고로, constructor는 대문자로 이름을 시작하는 것이 관례입니다


const removePx = px => {
  return Number(px.split('px')[0]);
}

const getRange = (least, largest) => {
  let randomVal = Math.random();

  while (least > randomVal || randomVal > largest) {
    randomVal = Math.random();
  }
  return randomVal;
}

const toggleFloat = (el, haveToFloat = false) => {

  let style = el.style;

  if (haveToFloat) {

    Object.assign(style, {
      transform: 'translateY(0px)',
      animation: 'float 6s ease-in-out infinite'
    });

  } else {

    Object.assign(style, {
      transform: 'translateX(0px) translateY(0px)',
      animation: ''
    });

  }

};


function Character(name) {

  this.name = name;
  this.node = this.createCharacterEl();
  this.width = 100;
  this.height = 140;
  this.energyWaveSize = '70px';
  this.setPosition();

  this.node.addEventListener('click', this.energyWave.bind(this));
  this.node.classList.add('floating');
  this.addDragEvent();

}

Character.prototype.energyWave = function () {

  let startXPosition = Number(this.node.style.left.split('px')[0]) + this.width;
  let startYPosition = Number(this.node.style.top.split('px')[0]) + (this.height / 2);
  let endXPosition;
  let endYPosition;

  if (this.isExist['MineBoo']) {
    let mineBoo = drangonBallCharacters.find(character => character.name === 'MineBoo');
    endXPosition = Number(mineBoo.node.style.left.split('px')[0]);
    endYPosition = Number(mineBoo.node.style.top.split('px')[0]) + (mineBoo.height / 2);
  } else {
    endXPosition = document.body.clientWidth;
    endYPosition = startYPosition;
  }
  let energyWaveEl = document.createElement('div');
  let distanceX = endXPosition - startXPosition + 'px';
  let distanceY = endYPosition - startYPosition + 'px';

  energyWaveEl.className = 'energywave';

  document.body.append(energyWaveEl);  //DOM에 먼저 추가해야 transition이 적용된다

  Object.assign(energyWaveEl.style, {
    top: startYPosition + 'px',
    left: startXPosition + 'px',
  });

  const fireEnergyWave = () => {
    energyWaveEl.style.transform = `translateX(${distanceX}) translateY(${distanceY})`;

    const removeEnergyWave = () => {

      energyWaveEl.removeEventListener('transitionend', removeEnergyWave);

      setTimeout(() => {

        if (this.isExist['MineBoo']) {

          let explosionImg = document.createElement('img');

          explosionImg.src = imgs.explosion;
          explosionImg.className = 'explosion';

          let top = endYPosition * getRange(0.8, 1) - 50 + 'px';
          let left = endXPosition * getRange(0.9, 1) - 20 + 'px';

          Object.assign(explosionImg.style, {
            top: top,
            left: left,
          });

          document.body.append(explosionImg);

          setTimeout(() => {
            explosionImg.remove();
          }, 1000)

        }

        energyWaveEl.remove();
      }, 2000);

    };

    energyWaveEl.addEventListener('transitionend', removeEnergyWave);
  };

  const gatherEnergy = () => {

    let top = (Number(energyWaveEl.style.top.split('px')[0]) - 35) + 'px';
    let left = (Number(energyWaveEl.style.left.split('px')[0]) - 15) + 'px';

    Object.assign(energyWaveEl.style, {
      top: top,
      left: left,
      width: this.energyWaveSize,
      height: this.energyWaveSize,
    });

    energyWaveEl.classList.add('twinkling');

    setTimeout(fireEnergyWave, 1500);
  };

  setTimeout(gatherEnergy, 100);

}

Character.prototype.createCharacterEl = function () {
  if (Character.prototype.isExist[this.name]) return;

  let img = document.createElement('img');

  img.classList.add('character');
  if (this.name === 'SonOgong') {
    img.setAttribute('src', imgs.SonOgong.normal);
  } else if (this.name === 'SonOban') {
    img.setAttribute('src', imgs.SonOban.normal);
  } else if (this.name === 'Vegeta') {
    img.setAttribute('src', imgs.Vegeta.normal);
  } else if (this.name === 'MineBoo') {
    img.setAttribute('src', imgs.MineBoo);
  }

  Character.prototype.isExist[this.name] = true;

  return img;
}

Character.prototype.setPosition = function () {
  let left;
  let top;

  if (this.name === 'MineBoo') {  //화면 오른쪽

    left = document.body.clientWidth * getRange(0.6, 1);
    top = document.body.clientHeight * getRange(0.3, 0.8);

  } else {  //화면 왼쪽

    left = document.body.clientWidth * getRange(0.1, 0.4);

    if (this.name === 'SonOgong') {
      top = document.body.clientHeight * getRange(0.1, 0.3);
    } else if (this.name === 'SonOban') {
      top = document.body.clientHeight * getRange(0.3, 0.6);
    } else if (this.name === 'Vegeta') {
      top = document.body.clientHeight * getRange(0.6, 0.9);
    }
  }

  Object.assign(this.node.style, {
    top: `${top}px`,
    left: `${left}px`
  });
}

Character.prototype.isExist = {
  'SonOgong': false,
  'SonOban': false,
  'Vegeta': false,
  'MineBoo': false
};

//사이어인(손오공, 손오반, 베지터) 
function Saiyan(name) {
  Character.call(this, name);
  //초사이언
  this.superSaiyanStage = 0;
  this.changingState = false;

}

Saiyan.prototype = Object.create(Character.prototype);
Saiyan.constructor = Saiyan;


Saiyan.prototype.changeSuperSaiyan = function () {

  if (this.changingState) return false;

  let el = this.node;
  this.changingState = true;

  const changeToSuperSaiyan = () => {

    let stage;

    if (this.superSaiyanStage === 0) {

      el.style.backgroundColor = '';
      el.style.boxShadow = '';

      stage = 'superSaiyan1';
      el.classList.add('super-saiyan1');
      this.superSaiyanStage = 1;
      this.energyWaveSize = '120px';

    } else if (this.superSaiyanStage === 1) {


      if (this.name === 'SonOgong') {

        stage = 'superSaiyan3';
        el.classList.remove('super-saiyan1');
        el.classList.add('super-saiyan3')
        this.superSaiyanStage = 3;
        this.energyWaveSize = '160px';

      } else {

        el.style.backgroundColor = '';
        el.style.boxShadow = '';
        stage = 'normal';
        el.classList.remove('super-saiyan1');
        this.superSaiyanStage = 0;
        this.energyWaveSize = '70px';

      }
    } else if (this.superSaiyanStage === 3) {

      el.style.backgroundColor = '';
      el.style.boxShadow = '';
      stage = 'normal';
      el.classList.remove('super-saiyan3');
      this.superSaiyanStage = 0;
      this.energyWaveSize = '70px';

    }

    el.src = imgs[this.name][stage];

    this.changingState = false;

  };

  let time = 3000;

  if (this.superSaiyanStage === 1) {

    if (this.name !== 'SonOgong') {
      time = 1500;
    }

  } else if (this.superSaiyanStage === 3) {
    time = 1500;
  }


  Object.assign(el.style, {
    boxShadow: '0 -20px 60px 80px rgb(255, 229, 0, 0.7)',
    backgroundColor: 'rgb(255, 229, 0, 0.7)'
  });

  setTimeout(changeToSuperSaiyan, time);

  return true;

};

Character.prototype.addDragEvent = function () {

  let el = this.node;

  el.draggable = true;

  const handleDragStart = ev => {
    dragged = ev.currentTarget;
  };

  const handleDrag = ev => {
  };

  el.addEventListener('dragstart', handleDragStart);
  el.addEventListener('drag', handleDrag);

};


//적(마인부우)
function MineBoo(name) {
  Character.call(this, name);

  Object.assign(this.node.style, {
    boxShadow: '0 0 10px 20px rgb(156, 39, 176, 0.4)',
    background: 'rgb(156, 39, 176, 0.4)',
    padding: '0'
  });
}

MineBoo.prototype = Object.create(Character.prototype);
MineBoo.constructor = MineBoo;

MineBoo.prototype.energyWave = function () {

  let style = this.node.style;
  let startXPosition = removePx(style.left);
  let startYPosition = removePx(style.top) + (removePx(style.height) / 2);
  let energyWaveEl = document.createElement('div');

  energyWaveEl.className = 'energywave-mineboo';

  Object.assign(style, {
    top: startYPosition + 'px',
    left: startXPosition + 'px'
  });

  document.body.append(energyWaveEl);

  const fireEnergyWave = () => {

    let distanceY = (document.body.clientHeight / 2) - removePx(style.top) - 160 + 'px';
    let distanceX = -document.body.clientWidth + 'px';

    energyWaveEl.style.transform = `translateX(${distanceX}) translateY(${distanceY})`;

    const removeEnergyWave = () => {

      energyWaveEl.removeEventListener('transitionend', removeEnergyWave);

      setTimeout(() => { //3.6초 이후 에너지파 제거 & 폭팔

        const attackedByMineBoo = character => {

          if (character.name === 'MineBoo') return;

          let style = character.node.style;
          let posX = removePx(style.left) + removePx(style.width) - 15;
          let posY = removePx(style.top) + (removePx(style.height) / 2);

          let explosionImg = document.createElement('img');

          explosionImg.src = imgs.explosion;
          explosionImg.className = 'explosion';

          let top = posY * getRange(0.8, 1) + 'px';
          let left = posX * getRange(0.8, 1) + 50 + 'px';

          Object.assign(explosionImg.style, {
            top: top,
            left: left,
          });

          document.body.append(explosionImg);

          setTimeout(() => {
            explosionImg.remove();
          }, 1500)

        };

        energyWaveEl.remove();
        drangonBallCharacters.forEach(attackedByMineBoo);

      }, 1300);


    };

    energyWaveEl.addEventListener('transitionend', removeEnergyWave);
  };

  const gatherEnergy = () => {
    let top = removePx(style.top) + 'px';
    let left = removePx(style.left) - 100 + 'px';

    Object.assign(energyWaveEl.style, {
      top: top,
      left: left,
      width: '160px',
      height: '160px',
    });

    setTimeout(fireEnergyWave, 2000);
  };

  setTimeout(gatherEnergy, 100);
}

MineBoo.prototype.regenerate = function () {
  if (this.changingState) return;

  this.changingState = true;

  setTimeout(() => {

    this.node.src = imgs.MineBoo;
    this.changingState = false;

  }, 7000);

};

function SonOgong(name) {
  Saiyan.call(this, name);

  this.wonkiokSize = 200;

}

SonOgong.prototype = Object.create(Saiyan.prototype);
SonOgong.constructor = SonOgong;

SonOgong.prototype.wonkiok = function () {

  if (this.changingState) return;

  const toggleFloating = (el) => {
    if (el.classList.contains('floating')) {
      el.classList.remove('floating');

    } else {
      el.classList.add('floating');
    }
  };

  this.changingState = true;

  let body = document.body;
  let el = this.node;
  let posX = body.clientWidth * 0.1 + 'px';
  let posY = body.clientHeight * 0.5 + 'px';
  let distanceX, distanceY;
  let targetX, targetY;

  toggleFloating(el);

  el.classList.forEach((className, idx, classList) => {
    if (className !== 'character') {
      classList.remove(className);
    }
  });

  const locate = () => {

    distanceX = removePx(el.style.left) + removePx(posX) + 'px';
    distanceY = removePx(el.style.top) + removePx(posY) + 'px';

    Object.assign(el.style, {
      left: distanceX,
      top: distanceY,
    });

  };

  locate();

  let explodeWonkiok = () => {

    let explosionEl = document.createElement('img');

    explosionEl.className = 'wonkiok-explosion';
    explosionEl.src = imgs.wonkiokExplosion;

    el.classList.remove('gather-wonkiok');
    el.src = imgs.SonOgong.normal;

    const revertPos = () => {

      let left = body.clientWidth * 0.2 + 'px';
      let top = body.clientHeight * 0.2 + 'px';

      Object.assign(el.style, {
        left: left,
        top: top
      });

      setTimeout(() => {

        explosionEl.remove();
        toggleFloating(el);

      }, 3000);

      this.energyWaveSize = '70px';
      this.changingState = false;
    }

    wonkiokEl.addEventListener('transitionend', () => {

      Object.assign(explosionEl.style, {
        left: removePx(targetX) - 500 + 'px',
        top: removePx(targetY) - 650 + 'px',
      });

      body.append(explosionEl);

      const mineBooIsAttaced = () => {

        let mineboo = drangonBallCharacters.find(character => character.name === 'MineBoo');

        if (mineboo) {
          mineboo.node.src = imgs.MineBooAttacked;

          setTimeout(mineboo.regenerate.bind(mineboo), 1000);
        }

      };

      const resetBackground = () => {

        body.classList.remove('darken');

        drangonBallCharacters.forEach(character => {
          if (character.name === 'SonOban' || character.name === 'Vegeta') {
            character.node.style.display = 'initial';
          }
        });

      };

      setTimeout(mineBooIsAttaced, 1200);
      setTimeout(revertPos, 2000);
      setTimeout(resetBackground, 1000);

    })

  };

  let gatherWonkiok = () => {

    el.src = imgs['SonOgong'].wonkiok;
    el.classList.add('gather-wonkiok');

    el.style.backgroundColor = '';
    el.style.boxShadow = '';

    let fireWonkiok = () => {

      wonkiokEl.removeEventListener('transitionend', fireWonkiok);

      targetX = body.clientWidth + 'px';
      targetY = body.clientHeight + 'px';

      wonkiokEl.style.transform = `translateX(${targetX}) translateY(${targetY})`;

      explodeWonkiok = explodeWonkiok.bind(this);

      wonkiokEl.addEventListener('transitionend', explodeWonkiok);

    };

    let makeWonkiok = () => {

      wonkiokEl = document.createElement('div');
      wonkiokEl.className = 'wonkiok';

      let top = removePx(el.style.top) - this.wonkiokSize + 'px';
      let left = removePx(el.style.left) - (this.wonkiokSize / 2) + 60 + 'px';

      document.body.append(wonkiokEl);

      const changeBackground = () => {

        body.classList.add('darken');

        drangonBallCharacters.forEach(character => {
          if (character.name === 'SonOban' || character.name === 'Vegeta') {
            character.node.style.display = 'none';
          }
        });

      };

      changeBackground();

      setTimeout(() => { //브라우저는 싱글 스레드 기반이기 때문에 비동기 요청으로 처리할 시간을 준다
        Object.assign(wonkiokEl.style, {
          top: top,
          left: left,
          width: this.wonkiokSize + 'px',
          height: this.wonkiokSize + 'px'
        });
      }, 100);

      fireWonkiok = fireWonkiok.bind(this);

      wonkiokEl.addEventListener('transitionend', fireWonkiok);

    };

    makeWonkiok();

  };

  setTimeout(gatherWonkiok, 2000);

};

SonOgong.prototype.energyWave = function () {
  if (this.changingState === false) {
    Character.prototype.energyWave.call(this);
  }
}

SonOgong.prototype.changeSuperSaiyan = function () {
  if (this.changingState === false) {
    return Saiyan.prototype.changeSuperSaiyan.call(this);
  }
}

// you don't have to worry about this code. this is for testing.
if (typeof window === 'undefined') {
  module.exports = { Saiyan, SonOgong, MineBoo };
}
