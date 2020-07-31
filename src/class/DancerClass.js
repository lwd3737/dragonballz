if (typeof window === 'undefined') {
  var jsdom = require('jsdom');
  var { JSDOM } = jsdom;
  var { document } = (new JSDOM('')).window;
} // you don't have to worry about this code. this is for testing.

// dancer를 class 키워드를 써서 ES6 방식으로 리팩토링하세요
// 여기에는 Pseudoclassical에서 정의된 Dancer와 이름이 겹치므로, DancerClass라는 이름을 사용합니다.
class DancerClass {
  constructor(top, left, timeBetweenSteps){
    this.timeBetweenSteps = timeBetweenSteps;
    this.$node = this.createDanderElement();

    this.setPosition(top, left);
  }

  createDanderElement(){
    let elDancer = document.createElement('span');
    elDancer.className = 'dancer';
    return elDancer;
  }

  step(){
    setTimeout(this.step.bind(this), this.timeBetweenSteps);
  }

  setPosition(top, left){
    Object.assign(this.$node.style, {
      top: `${top}px`,
      left: `${left}px`
    });
  }
}

// you don't have to worry about this code. this is for testing.
if (typeof window === 'undefined') {
  module.exports = DancerClass;
}
