const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFImage, FFText, FFLive, FFCreator } = require('../');

const createFFTask = () => {
  const img1 = path.join(__dirname, './assets/imgs/06.png');
  const bg1 = path.join(__dirname, './assets/imgs/wallp/06.jpeg');
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const font = path.join(__dirname, './assets/font/scsf.ttf');
  const audio = path.join(__dirname, './assets/audio/03.wav');

  console.log('Please enter the correct live stream.');
  const live = 'rtmp://server/live/originalStream';
  const output = 'rtmp://server/live/h264Stream';

  const cacheDir = path.join(__dirname, './cache/');
  const outputDir = path.join(__dirname, './output/');

  const width = 1920;
  const height = 1080;
  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    output,
    outputDir,
    width,
    height,
    log: true,
    preset: 'veryfast',
    vprofile: 'baseline',
    upStreaming: true,
    audio,
  });

  // create FFScene
  const scene = new FFScene();
  scene.setBgColor('#9980fa');

  const fbg = new FFImage({ path: bg1 });
  fbg.setXY(50, 50);
  scene.addChild(fbg);

  const fflive = new FFLive({ path: live, x: 0, y: 0 });
  fflive.setScale(1);
  fflive.addEffect('moveInRight', 2.5, 3.5);
  scene.addChild(fflive);

  const fimg1 = new FFImage({ path: img1, x: -80, y: 80 });
  fimg1.addEffect('moveInLeft', 1.5, 0);
  scene.addChild(fimg1);

  const text1 = new FFText({ text: 'FFLive案例', font, x: width / 2 - 120, y: 100, fontSize: 42 });
  text1.setColor('#ffffff');
  text1.setBorder(5, '#000000');
  scene.addChild(text1);

  scene.setDuration(17);
  creator.addChild(scene);

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
