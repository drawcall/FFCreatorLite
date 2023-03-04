const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFImage, FFText, FFVideo, FFCreator } = require('../');

const createFFTask = () => {
  const img3 = path.join(__dirname, './assets/imgs/06.png');
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const font = path.join(__dirname, './assets/font/scsf.ttf');
  const audio = path.join(__dirname, './assets/audio/03.wav');
  const video1 = path.join(__dirname, './assets/video/video1.mp4');
  const video2 = path.join(__dirname, './assets/video/video2.mp4');

  const cacheDir = path.join(__dirname, './cache/');
  const outputDir = path.join(__dirname, './output/');

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: 576,
    height: 1024,
    log: true,
    //audio,
  });

  // create FFScene
  const scene1 = new FFScene();
  const scene2 = new FFScene();
  scene1.setBgColor('#9980fa');
  scene2.setBgColor('#ea2228');

  const fvideo1 = new FFVideo({ path: video1, audio: true, y: 330 });
  fvideo1.setScale(0.6);
  scene1.addChild(fvideo1);

  const fvideo2 = new FFVideo({ path: video2, audio: false,  x: 300, y: 330 });
  fvideo2.setScale(0.3);
  fvideo2.addEffect('moveInRight', 2.5, 3.5);
  scene1.addChild(fvideo2);

  const fimg3 = new FFImage({ path: img3, x: 60, y: 600 });
  fimg3.setScale(0.4);
  fimg3.addEffect('rotateInBig', 2.5, 1.5);
  scene1.addChild(fimg3);

  const text1 = new FFText({ text: 'FFVideo案例', font, x: 140, y: 100, fontSize: 42 });
  text1.setColor('#ffffff');
  text1.setBorder(5, '#000000');
  //text1.addEffect('fadeIn', 2, 1);
  scene1.addChild(text1);

  scene1.setDuration(17);
  creator.addChild(scene1);

  creator.start();
  creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreatorLite start`);
  });

  creator.on('error', e => {
    console.log(`FFCreatorLite error:: \n ${e.error}`);
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
