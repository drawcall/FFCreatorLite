const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFText, FFImage, FFCreator } = require('../');

const idiom = `风驰电掣、健步如飞、大步流星、白驹过隙、快马加鞭、眼疾手快、速战速决、转瞬即逝、语重心长、一心一意、急中生智、飞蛾扑火、金蝉脱壳、积蚊成雷、蟾宫折桂、蚕食鲸吞、蜻蜓点水、螳臂挡车、蛛丝马迹、螳螂捕蝉、黄雀在后`.split(
  '、',
);

const getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

const ffcreateTask = () => {
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const bg1 = path.join(__dirname, './assets/imgs/wallp/02.jpeg');
  const bg2 = path.join(__dirname, './assets/imgs/wallp/04.jpeg');
  const font1 = path.join(__dirname, './assets/font/ysst.ttf');
  const font2 = path.join(__dirname, './assets/font/jdnt.ttf');
  const audio = path.join(__dirname, './assets/audio/02.wav');
  const outputDir = path.join(__dirname, './output/');
  const cacheDir = path.join(__dirname, './cache/');

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: 600,
    height: 400,
    debug: false,
    audio,
  });

  // create FFScene
  const scene1 = new FFScene();
  scene1.addChild(new FFImage({ path: bg1 }));

  // 多个文字
  for (let i = 0; i < 50; i++) {
    const font = i % 2 === 0 ? font1 : font2;
    const effect = i % 2 === 0 ? 'moveInLeftBig' : 'moveInRightBig';
    const x = (-20 + Math.random() * 500) >> 0;
    const y = (10 + Math.random() * 350) >> 0;
    const time = (2 + Math.random() * 8) >> 0;
    const delay = ((Math.random() * 10 * 10) >> 0) / 10;
    const fontSize = (16 + Math.random() * 120) >> 0;
    const text1 = new FFText({ text: idiom[i % idiom.length], font, fontSize });
    text1.setXY(x, y);
    text1.setColor(getRandomColor());
    text1.addEffect(effect, time, delay);
    scene1.addChild(text1);
  }
  scene1.setDuration(15);
  scene1.setTransition('radial', 1.2);
  creator.addChild(scene1);

  // scene2
  const scene2 = new FFScene();
  scene2.setBgColor('#b33771');
  const fbg2 = new FFImage({ path: bg2 });
  fbg2.addEffect('rotateInBig', 1.5, 0);
  scene2.addChild(fbg2);

  // logo
  const flogo = new FFImage({ path: logo, x: 150, y: 180 });
  flogo.setScale(0.7);
  flogo.addEffect('moveInUpBack', 1, 2);
  scene2.addChild(flogo);

  scene2.setDuration(5);
  creator.addChild(scene2);

  creator.start();
  // creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('error', e => {
    console.log(`FFCreator error: ${e.error}}`);
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(ffcreateTask));
