
/* eslint-disable */
const dancers = [];

function handleClickDancerButton () {
  /* makeBlinkyDancer is the dancer maker functions available in global scope.
  * A new object of the given type will be created and added
  * to the stage.
  */

  // make a dancer with a random position
  //
  // TODO:
  let dancer = new BlinkyDancerClass(
    document.body.clientHeight * Math.random(),
    document.body.clientWidth * Math.random(),
    Math.random() * 1000
  )

  dancers.push(dancer);

  document.body.append(dancer.$node);
}

window.addEventListener('DOMContentLoaded', () => {
  const elAddDancerButton = document.querySelector('.addDancerButton');
  elAddDancerButton.addEventListener('click', handleClickDancerButton);
  
  const lineupBtn = document.querySelector('#lineupButton');
  lineupBtn.addEventListener('click', ev => {
    let containerEl = document.createElement('div');
    let innerEl = document.createElement('div');

    containerEl.id = 'container';
    innerEl.id = 'inner';

    containerEl.append(innerEl);
    document.body.append(containerEl);

    dancers.forEach(dancer => dancer.lineup());
  });
});
