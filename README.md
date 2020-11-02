[English](./README.md) | [简体中文](./README.zh-CN.md)

<p align="center">
  <img src="https://tnfe.github.io/FFCreator/_media/logo/logo2.png" />
</p>

<div align="center">
<a href="https://www.npmjs.com/ffcreatorlite" target="_blank"><img src="https://img.shields.io/npm/v/ffcreatorlite.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/ffcreatorlite" target="_blank"><img src="https://img.shields.io/npm/l/ffcreatorlite.svg" alt="Package License" /></a>
<a href="https://travis-ci.org/github/tnfe/FFCreatorLite" target="_blank"><img src="https://travis-ci.org/tnfe/FFCreatorLite.svg?branch=master" alt="Travis CI" /></a>
<a href="https://github.com/prettier/prettier" target="_blank"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="Code Style"></a>
<a href="https://github.com/tnfe/FFCreatorLite/pulls" target="_blank"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"/></a>
<a href="https://nodejs.org" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D%208.0.0-brightgreen.svg" alt="Node Version" /></a>
</div>

## Overview

FFCreatorLite is a lightweight and flexible short video processing library based on <a href="http://nodejs.org" target="_blank">Node.js</a>. You only need to add some pictures, music or video clips, you can use it to quickly create a very exciting video album.

Nowadays, short video is an increasingly popular form of media communication. Like [_weishi_](https://weishi.qq.com/) and _tiktok_ is full of all kinds of wonderful short videos. So how to make users visually create video clips on the web easily and quickly. Or based on pictures Text content, dynamic batch generation of short videos is a technical problem.

`FFCreatorLite` is developed based on the famous video processing library `FFmpeg`, and splicing the complicated and tedious command line parameters of `FFmpeg` (this is not so easy), using `FFmpeg` various filters and features to realize animation And video clips and generate the final movie. So its processing speed is beyond your imagination, even faster than [`FFCreator`](https://github.com/tnfe/FFCreator).

#### For more introduction, please see [here](https://tnfe.github.io/FFCreator/#/guide/lite)

### Features

- Based on node.js development, it is very simple to use and easy to expand and develop.
- Only rely on `FFmpeg`, easy to install, cross-platform, and low requirements for machine configuration.
- The video processing speed is extremely fast, a 5-7 minute video only takes 1 minute.
- Supports multiple elements such as pictures, sounds, video clips, and text.
- Contains 70% animation effects of ʻanimate.css`, which can convert css animation to video.

## Demo

<p align="center">
  <a href="https://tnfe.github.io/FFCreator/#/guide/lite" style="margin-right:100px"><img width="300" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/03.gif?raw=true" /></a>     
  <a href="https://tnfe.github.io/FFCreator/#/guide/lite"><img width="300" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/04.gif?raw=true" /></a>
</p>


## Useage

### Install npm Package

```javascript
npm install ffcreatorlite --save
```

Note: To run the preceding commands, Node.js and npm must be installed.

#### Node.js

```javascript
const {FFCreatorCenter, FFScene, FFImage, FFText, FFCreator} = require('ffcreatorlite');

// create creator instance
const creator = new FFCreator({
  cacheDir,
  outputDir,
  width: 600,
  height: 400,
  log: true,
});

// create FFScene
const scene1 = new FFScene();
const scene2 = new FFScene();
scene1.setBgColor('#ff0000');
scene2.setBgColor('#b33771');

// scene1
const fbg = new FFImage({path: bg1});
scene1.addChild(fbg);

const fimg1 = new FFImage({path: img1, x: 300, y: 60});
fimg1.addEffect('moveInRight', 1.5, 1.2);
scene1.addChild(fimg1);

const text = new FFText({text: '这是第一屏', font, x: 100, y: 100});
text.setColor('#ffffff');
text.setBackgroundColor('#000000');
text.addEffect('fadeIn', 1, 1);
scene1.addChild(text);

scene1.setDuration(8);
creator.addChild(scene1);

// scene2
const fbg2 = new FFImage({path: bg2});
scene2.addChild(fbg2);
// logo
const flogo = new FFImage({path: logo, x: 100, y: 100});
flogo.addEffect('moveInUpBack', 1.2, 0.3);
scene2.addChild(flogo);

scene2.setDuration(4);
creator.addChild(scene2);

creator.addAudio(audio);
creator.start();

creator.on('progress', e => {
  console.log(colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`));
});

creator.on('complete', e => {
  console.log(
    colors.magenta(`FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
  );
});
```

## About `FFCreator`

[`FFCreator`](https://github.com/tnfe/FFCreator) is not an enhanced version of `FFCreatorLite`, in fact the two implementation principles are completely different. When you need to process a lot of video without special cool transition animation, `FFCreatorLite` may be a better choice.

#### Principle difference
- `FFCreator` uses `opengl` to process graphics rendering and `shader` post-processing to generate transition effects, and finally uses `FFmpeg` to synthesize the video.
- `FFCreatorLite` completely uses `FFmpeg` filters and other effects, splicing `FFmpeg` commands to generate animations and videos.

`FFCreatorLite` has 70% of the functions of [`FFCreator`](https://github.com/tnfe/FFCreator), but in some cases the processing speed is faster and the installation is extremely simple. So please choose which version of the library to use according to the actual usage.

#### The difference between registration points

The default registration point of `FFCreatorLite` is the upper left corner and cannot be modified, while the default registration point of `FFCreator` is the center and can be modified.

#### For a more detailed tutorial, please check [here](https://tnfe.github.io/FFCreator/#/guide/lite)

## Installation

#### Since `FFCreatorLite` only depends on `FFmpeg`, you need to install the regular version of `FFmpeg`

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to Install FFmpeg on Windows [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
- How to Install FFmpeg on Mac OSX [https://trac.ffmpeg.org/wiki/CompilationGuide/macOS](https://trac.ffmpeg.org/wiki/CompilationGuide/macOS)

## Contribute

You are very welcome to join us in developing `FFCreatorLite`, if you want to contribute code, please read [here](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
