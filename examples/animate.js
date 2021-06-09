const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const {FFCreatorCenter, FFScene, FFImage, FFText, FFCreator} = require('../');

const createFFTask = () => {
  const img1 = path.join(__dirname, './assets/imgs/04.png');
  const img2 = path.join(__dirname, './assets/imgs/05.png');
  const img3 = path.join(__dirname, './assets/imgs/06.png');
  const img4 = path.join(__dirname, './assets/imgs/07.png');
  const bg1 = path.join(__dirname, './assets/imgs/wallp/03.jpeg');
  const bg2 = path.join(__dirname, './assets/imgs/wallp/02.jpeg');
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const font = path.join(__dirname, './assets/font/scsf.ttf');
  const audio = path.join(__dirname, './assets/audio/03.wav');
  const cacheDir = path.join(__dirname, './cache/');
  const outputDir = path.join(__dirname, './output/');

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: 576,
    height: 1024,
    log: true,
    audio,
  });

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#b53471');
  scene2.setBgColor('#0752dd');

  // scene1
  const fbg = new FFImage({path: bg1, y: 300});
  scene1.addChild(fbg);

  const fimg2 = new FFImage({path: img2, x: 20, y: 420});
  fimg2.addEffect('zoomNopadIn', 1.5, 0);
  scene1.addChild(fimg2);

  const fimg3 = new FFImage({path: img3, x: 300, y: 460});
  fimg3.setScale(0.7);
  fimg3.addEffect('rotateInBig', 2.5, 3.5);
  scene1.addChild(fimg3);

  const fimg4 = new FFImage({path: img4, x: 60, y: 170});
  fimg4.addEffect('zoomInDown', 1.8, 5.5);
  scene1.addChild(fimg4);

  const fimg1 = new FFImage({path: img1});
  fimg1.addAnimate({
    type: 'move',
    showType: 'in',
    time: 2,
    delay: 2,
    from: {x: 520, y: 120},
    to: {x: 320, y: 220},
  });
  scene1.addChild(fimg1);

  const text1 = new FFText({text: 'FFCreatorLite动画效果', font, x: 40, y: 100, fontSize: 42});
  text1.setColor('#ffffff');
  text1.setBorder(5, '#000000');
  text1.addEffect('fadeIn', 2, 1);
  scene1.addChild(text1);

  scene1.setDuration(12);
  creator.addChild(scene1);

  // scene2
  const fbg2 = new FFImage({path: bg2, y: 300});
  fbg2.addEffect('zoomIn', 1.2, 0.1);
  scene2.addChild(fbg2);
  // logo
  const flogo = new FFImage({path: logo, x: 150, y: 170});
  flogo.setScale(0.75);
  flogo.addEffect('moveInRight', 2, 0.3);
  scene2.addChild(flogo);

  const text2 = new FFText({text: '支持多种自定义动画', font, x: 40, y: 100, fontSize: 42});
  text2.setColor('#ffc310');
  text2.setBorder(5, '#000000');
  text2.addEffect('moveInLeft', 2, 1);
  scene2.addChild(text2);

  const fimg5 = new FFImage({path: img3, x: 220, y: 420});
  fimg5.setScale(0.7);
  fimg5.addEffect('rotateInBig', 2.5, 1.5);
  scene2.addChild(fimg5);

  scene2.setDuration(6);
  creator.addChild(scene2);

  creator.start();
  creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreatorLite start`);
  });

  creator.on('error', e => {
    console.log(`FFCreatorLite error:: \n ${e}`);
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

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(createFFTask));
