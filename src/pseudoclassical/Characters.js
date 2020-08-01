if (typeof window === 'undefined') {
  var jsdom = require('jsdom');
  var { JSDOM } = jsdom;
  var { document } = (new JSDOM('')).window;
  var drangonBallCharacters = [];
  var imgs = {};
} // you don't have to worry about this code. this is for testing.

// blinkyDancer를 pseudoclassical한 방식으로 리팩토링하세요
// 참고로, constructor는 대문자로 이름을 시작하는 것이 관례입니다

const removePx = px => {
  return Number(px.split('px')[0]);
}

const getRange = (least, largest) => {
  let randomVal = Math.random();

  while(least > randomVal || randomVal > largest ){
    randomVal = Math.random();
  }
  return randomVal;
}


function Character (name) {
  this.name = name;
  this.node = this.createCharacterEl();
  this.width = 100;
  this.height = 140;
  this.energyWaveSize = '70px';
  this.setPosition();

  this.node.addEventListener('click', this.energyWave.bind(this));
}

Character.prototype.energyWave = function(){
  let startXPosition = Number(this.node.style.left.split('px')[0]) + this.width;
  let startYPosition = Number(this.node.style.top.split('px')[0]) + (this.height / 2);
  let endXPosition;
  let endYPosition;

  if(this.isExist['MineBoo']){
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
    top:startYPosition + 'px',
    left:startXPosition + 'px',
  });
  
  const fireEnergyWave = () => {
    energyWaveEl.style.transform = `translateX(${distanceX}) translateY(${distanceY})`;
    
    const removeEnergyWave = () => {

      energyWaveEl.removeEventListener('transitionend', removeEnergyWave);

      setTimeout(() => {
        
        if(this.isExist['MineBoo']){
          
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
          }, 1500)

        }
        
        energyWaveEl.remove();
      },3600);

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

    setTimeout(fireEnergyWave, 2000);
  };

  setTimeout(gatherEnergy, 100);

}

Character.prototype.createCharacterEl = function(){
  if(Character.prototype.isExist[this.name]) return;

  let img = document.createElement('img');
  
  img.classList.add('character');
  if(this.name === 'SonOgong'){
    img.setAttribute('src', imgs.SonOgong.normal);
  } else if (this.name === 'SonOban'){
    img.setAttribute('src', imgs.SonOban.normal);
  } else if (this.name === 'Vegeta'){
    img.setAttribute('src', imgs.Vegeta.normal);
  } else if (this.name === 'MineBoo'){
    img.setAttribute('src', imgs.MineBoo);
  }

  Character.prototype.isExist[this.name] = true;

  return img;
}

Character.prototype.setPosition = function(){
  let left;
  let top;
  
  if(this.name === 'MineBoo'){  //화면 오른쪽
    
    left = document.body.clientWidth * getRange(0.6, 1);
    top = document.body.clientHeight * getRange(0.3, 0.8);

  } else {  //화면 왼쪽

    left = document.body.clientWidth * getRange(0.1, 0.4);
    
    if(this.name === 'SonOgong'){
      top = document.body.clientHeight * getRange(0.1, 0.3);
    } else if(this.name === 'SonOban'){
      top = document.body.clientHeight * getRange(0.3, 0.6);
    } else if(this.name === 'Vegeta'){
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
function Saiyan (name) {
  Character.call(this, name);
  //초사이언
  this.superSaiyanStage = 0;
  
}

Saiyan.prototype = Object.create(Character.prototype);
Saiyan.constructor = Saiyan;


Saiyan.prototype.changeSuperSaiyan = function(){

  let el = this.node;
  let changing = false;
  
  const changeToSuperSaiyan = () => {
    
    let stage;
    changing = true;

    if(this.superSaiyanStage === 0){

      el.style.backgroundColor = '';
      el.style.boxShadow = '';

      stage = 'superSaiyan1';
      el.classList.add('super-saiyan1');
      this.superSaiyanStage = 1; 
      this.energyWaveSize = '120px';

    } else if (this.superSaiyanStage === 1){

      
      if(this.name === 'SonOgong'){

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
    } else if (this.superSaiyanStage === 3){

      el.style.backgroundColor = '';
      el.style.boxShadow = '';
      stage = 'normal';
      el.classList.remove('super-saiyan3');
      this.superSaiyanStage = 0;
      this.energyWaveSize = '70px';

    }
    
    el.src = imgs[this.name][stage];
    
    changing = false;

  };

  
  Object.assign(el.style, {
    boxShadow: '0 -20px 60px 80px rgb(255, 229, 0, 0.7)',
    backgroundColor: 'rgb(255, 229, 0, 0.7)'
  });

  let time = 5000;

  if(this.superSaiyanStage === 1){

    if(this.name !== 'SonOgong'){
      time = 1500  ;
    } 

  } else if (this.superSaiyanStage === 3){
    time = 1500;
  }

  if(changing === false){
    setTimeout(changeToSuperSaiyan, time);
  }

}


//적(마인부우)
function MineBoo (name) {
  Character.call(this, name);
  
}

MineBoo.prototype = Object.create(Character.prototype);
MineBoo.constructor = MineBoo;

MineBoo.prototype.energyWave = function(){

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

          if(character.name === 'MineBoo') return;

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
    let top = removePx(style.top) - 50 + 'px';
    let left = removePx(style.left) - 230 + 'px';

    Object.assign(energyWaveEl.style, {
      top: top,
      left: left,
      width: '300px',
      height: '300px',
    });

    setTimeout(fireEnergyWave, 2000);
  };

  setTimeout(gatherEnergy, 100);
}

MineBoo.prototype.regenerate = function(){

}

function SonOgong (name) {
  Saiyan.call(this, name);
}

SonOgong.prototype = Object.create(Saiyan.prototype);
SonOgong.constructor = SonOgong;

SonOgong.prototype.wonkiok = function(){
  //console.log('원기옥!!')
}

// you don't have to worry about this code. this is for testing.
if (typeof window === 'undefined') {
  module.exports = {Saiyan, SonOgong, MineBoo};
}
