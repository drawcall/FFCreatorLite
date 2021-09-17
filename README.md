[English](./README.md) | [简体中文](./README.zh-CN.md)

<p align="center">
  <img src="https://tnfe.github.io/FFCreator/_media/logo/logo2.png" />
</p>

<div align="center">
<a href="https://www.npmjs.com/ffcreatorlite" target="_blank"><img src="https://img.shields.io/npm/v/ffcreatorlite.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/ffcreatorlite" target="_blank"><img src="https://img.shields.io/npm/l/ffcreatorlite.svg" alt="Package License" /></a>
<a href="https://travis-ci.org/github/tnfe/FFCreatorLite" target="_blank"><img src="https://travis-ci.org/tnfe/FFCreatorLite.svg?branch=master" alt="Travis CI" /></a>
<a href="https://github.com/prettier/prettier" target="_blank"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code Style"></a>
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
- Support for adding music and animation to the live stream before launching.
- The latest version supports more than 30 scene transition animations.
- Contains 70% animation effects of `animate.css`, which can convert css animation to video.

## Demo

<p align="center">
  <a href="https://tnfe.github.io/FFCreator/#/guide/lite" style="margin-right:100px"><img width="300" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/03.gif?raw=true?raw=true" /></a>
  <img width="100" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/foo.png?raw=true" />
  <a href="https://tnfe.github.io/FFCreator/#/guide/lite"><img width="300" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/04.gif?raw=true?raw=true" /></a>
</p>

## Useage

### Install npm Package

```javascript
npm install ffcreatorlite --save
```

Note: To run the preceding commands, Node.js and npm must be installed.

#### Node.js

```javascript
const { FFCreatorCenter, FFScene, FFImage, FFText, FFCreator } = require('ffcreatorlite');

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
const fbg = new FFImage({ path: bg1 });
scene1.addChild(fbg);

const fimg1 = new FFImage({ path: img1, x: 300, y: 60 });
fimg1.addEffect('moveInRight', 1.5, 1.2);
scene1.addChild(fimg1);

const text = new FFText({ text: '这是第一屏', font, x: 100, y: 100 });
text.setColor('#ffffff');
text.setBackgroundColor('#000000');
text.addEffect('fadeIn', 1, 1);
scene1.addChild(text);

scene1.setDuration(8);
creator.addChild(scene1);

// scene2
const fbg2 = new FFImage({ path: bg2 });
scene2.addChild(fbg2);
// logo
const flogo = new FFImage({ path: logo, x: 100, y: 100 });
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

## About Transition

The latest version of ffcreatorlite already supports scene transition animation, which means you can use it to make cool effects like ffcreator.

Of course you need to install [4.3.0](https://stackoverflow.com/questions/60704545/xfade-filter-not-available-with-ffmpeg) above version of ffmpeg. Because here is the [Xfade](https://trac.ffmpeg.org/wiki/Xfade) filter to achieve Animation.

#### useage

```javascript
// https://trac.ffmpeg.org/wiki/Xfade
scene.setTransition('diagtl', 1.5);
```

<table class="wiki">
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fade.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fade.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fadeblack.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fadeblack.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fadewhite.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fadewhite.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/distance.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/distance.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center"><strong>fade</strong> (default)</td>
    <td style="text-align: center">fadeblack</td>
    <td style="text-align: center">fadewhite</td>
    <td style="text-align: center">distance</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipeleft.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipeleft.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wiperight.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wiperight.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipeup.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipeup.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipedown.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipedown.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center"><strong>wipeleft</strong></td>
    <td style="text-align: center"><strong>wiperight</strong></td>
    <td style="text-align: center"><strong>wipeup</strong></td>
    <td style="text-align: center"><strong>wipedown</strong></td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slideleft.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slideleft.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slideright.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slideright.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slideup.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slideup.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slidedown.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/slidedown.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center"><strong>slideleft</strong></td>
    <td style="text-align: center"><strong>slideright</strong></td>
    <td style="text-align: center"><strong>slideup</strong></td>
    <td style="text-align: center"><strong>slidedown</strong></td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothleft.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothleft.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothright.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothright.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothup.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothup.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothdown.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/smoothdown.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">smoothleft</td>
    <td style="text-align: center">smoothright</td>
    <td style="text-align: center">smoothup</td>
    <td style="text-align: center">smoothdown</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/circlecrop.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/circlecrop.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/rectcrop.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/rectcrop.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/circleclose.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/circleclose.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/circleopen.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/circleopen.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">rectcrop</td>
    <td style="text-align: center">circlecrop</td>
    <td style="text-align: center">circleclose</td>
    <td style="text-align: center">circleopen</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/horzclose.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/horzclose.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/horzopen.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/horzopen.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vertclose.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vertclose.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vertopen.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vertopen.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">horzclose</td>
    <td style="text-align: center">horzopen</td>
    <td style="text-align: center">vertclose</td>
    <td style="text-align: center">vertopen</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagbl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagbl.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagbr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagbr.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagtl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagtl.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagtr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/diagtr.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">diagbl</td>
    <td style="text-align: center">diagbr</td>
    <td style="text-align: center">diagtl</td>
    <td style="text-align: center">diagtr</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/hlslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/hlslice.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/hrslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/hrslice.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vuslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vuslice.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vdslice.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/vdslice.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">hlslice</td>
    <td style="text-align: center">hrslice</td>
    <td style="text-align: center">vuslice</td>
    <td style="text-align: center">vdslice</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/dissolve.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/dissolve.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/pixelize.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/pixelize.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/radial.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/radial.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/hblur.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/hblur.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">dissolve</td>
    <td style="text-align: center">pixelize</td>
    <td style="text-align: center">radial</td>
    <td style="text-align: center">hblur</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipetl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipetl.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipetr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipetr.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipebl.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipebl.gif?raw=true"
      /></a>
    </td>
    <td>
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipebr.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/wipebr.gif?raw=true"
      /></a>
    </td>
  </tr>
  <tr>
    <td style="text-align: center">wipetl</td>
    <td style="text-align: center">wipetr</td>
    <td style="text-align: center">wipebl</td>
    <td style="text-align: center">wipebr</td>
  </tr>
  <tr>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fadegrays.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/fadegrays.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/squeezev.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/squeezev.gif?raw=true"
      /></a>
    </td>
    <td style="text-align: center">
      <a href="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/squeezeh.gif?raw=true" style="padding:0; border:none"
        ><img src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/gif/squeezeh.gif?raw=true"
      /></a>
    </td>
    <td></td>
  </tr>
  <tr>
    <td style="text-align: center">fadegrays</td>
    <td style="text-align: center">squeezev</td>
    <td style="text-align: center">squeezeh</td>
    <td></td>
  </tr>
</table>


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

### `FFCreatorLite` depends on `FFmpeg`, so you need to install `FFmpeg`

FFCreatorLite depends on `FFmpeg>=0.9` and above. Please set FFmpeg as a global variable, otherwise you need to use setFFmpegPath to add FFmpeg native path. (The ffmpeg for windows users is probably not in your `%PATH`, so you must set `%FFMPEG_PATH`)

```javascript
FFCreator.setFFmpegPath('...');
```

Of course, you can also compile ffmpeg on your machine, please see [https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu).

### `FFmpeg` Installation tutorial

> For more `FFmpeg` tutorials, please view [https://trac.ffmpeg.org/wiki](https://trac.ffmpeg.org/wiki)

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to Install FFmpeg on Windows [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
- How to Install FFmpeg on Mac OSX [https://trac.ffmpeg.org/wiki/CompilationGuide/macOS](https://trac.ffmpeg.org/wiki/CompilationGuide/macOS)

## Contribute

You are very welcome to join us in developing `FFCreatorLite`, if you want to contribute code, please read [here](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
