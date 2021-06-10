const path = require('path');
const colors = require('colors');
const shuffle = require('lodash/shuffle');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFText, FFImage, FFCreator } = require('../');

const width = 600;
const height = 400;
const font = path.join(__dirname, './assets/font/ysst.ttf');
const audio = path.join(__dirname, './assets/audio/01.wav');
const outputDir = path.join(__dirname, './output/');
const cacheDir = path.join(__dirname, './cache/');

const transitionDemoTask = () => {
  const trans = shuffle(['pixelize', 'circleclose', 'slideup', 'hrslice', 'wipetl']);
  const order = ['一', '二', '三', '四', '五'];

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    audio,
    debug: false,
  });

  for (let i = 1; i < 6; i++) {
    const transition = trans[i - 1];
    const text = `这是第 ${order[i - 1]} 屏`;
    const scene = creatScene({ index: i, transition, text });
    creator.addChild(scene);
  }

  creator.openLog();
  creator.start();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(e);
  });

  creator.on('progress', e => {
    // console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

const creatScene = ({ index, transition, text }) => {
  const scene = new FFScene();
  scene.setBgColor('#3b3a98');
  scene.setDuration(5);
  scene.setTransition(transition, 1.5);

  // bg img
  const img = path.join(__dirname, `./assets/imgs/wallp/0${index}.jpeg`);
  const bg = new FFImage({ path: img, resetXY: true });
  scene.addChild(bg);

  // title text
  const ftext = new FFText({ text, x: width / 2 - 100, y: height / 2 + 50, font, fontSize: 38 });
  ftext.setColor('#30336b');
  ftext.setBackgroundColor('#ffffff');
  ftext.addEffect('moveInUpBack', 1, 1.3);
  scene.addChild(ftext);

  // add logo2
  const scale = 1;
  const logo = path.join(__dirname, `./assets/imgs/logo/small/logo${index}.png`);
  const flogo = new FFImage({ path: logo, x: width / 2 - (520 * scale) / 2, y: height / 2 - 100 });
  //flogo.setScale(scale);
  flogo.addEffect('moveInUp', 1, 1.8);
  scene.addChild(flogo);

  return scene;
};

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(transitionDemoTask));
