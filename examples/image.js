const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFImage, FFText, FFCreator } = require('../');

const createImageAnimation = () => {
  const img1 = path.join(__dirname, './assets/imgs/01.png');
  const img2 = path.join(__dirname, './assets/imgs/02.png');
  const img3 = path.join(__dirname, './assets/imgs/03.png');
  const bg1 = path.join(__dirname, './assets/imgs/wallp/06.jpeg');
  const bg2 = path.join(__dirname, './assets/imgs/wallp/01.jpeg');
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const font = path.join(__dirname, './assets/font/ysst.ttf');
  const audio = path.join(__dirname, './assets/audio/01.wav');
  const cacheDir = path.join(__dirname, './cache/');
  const outputDir = path.join(__dirname, './output/');

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: 600,
    height: 400,
    log: true,
    //debug: true,
    audio,
  });

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#ff0000');
  scene2.setBgColor('#b33771');

  // scene1
  const fbg = new FFImage({ path: bg1 });
  scene1.addChild(fbg);

  const fimg1 = new FFImage({ path: img1, x: 300, y: 60 });
  fimg1.addEffect('moveInRight', 1.5, 1.2);
  scene1.addChild(fimg1);

  const fimg2 = new FFImage({ path: img2, x: 20, y: 80 });
  fimg2.addEffect('moveInLeft', 1.5, 0);
  scene1.addChild(fimg2);

  const fimg3 = new FFImage({ path: img3, x: 200, y: 170 });
  fimg3.addEffect('rotateInBig', 2.5, 3.5);
  scene1.addChild(fimg3);

  const text1 = new FFText({ text: '这是第一屏', font, x: 220, y: 30, fontSize: 36 });
  text1.setColor('#ffffff');
  text1.setBackgroundColor('#000000');
  text1.addEffect('fadeIn', 1, 1);
  scene1.addChild(text1);

  scene1.setDuration(8);
  creator.addChild(scene1);

  // scene2
  const fbg2 = new FFImage({ path: bg2 });
  fbg2.addEffect('zoomIn', 0.5, 0);
  scene2.addChild(fbg2);
  // logo
  const flogo = new FFImage({ path: logo, x: 120, y: 170 });
  flogo.setScale(0.75);
  flogo.addEffect('moveInUpBack', 1.2, 0.3);
  scene2.addChild(flogo);

  const text2 = new FFText({ text: '这是第二屏', font, x: 220, y: 30, fontSize: 36 });
  text2.setColor('#ffffff');
  text2.setBackgroundColor('#000000');
  text2.addEffect('fadeIn', 1, 0.3);
  scene2.addChild(text2);

  scene2.setDuration(6);
  creator.addChild(scene2);

  creator.start();
  creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreatorLite start`);
  });

  creator.on('error', e => {
    console.log(`FFCreatorLite error:: \n ${JSON.stringify(e)}`);
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(createImageAnimation));
