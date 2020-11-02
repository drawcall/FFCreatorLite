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

`FFCreatorLite`是一个基于<a href="http://nodejs.org" target="_blank">node.js</a>的轻量、灵活的短视频制作库。您只需要添加几张图片或视频片段再加一段背景音乐，就可以快速生成一个很酷的的视频短片。

今天，短视频已成为一种越来越流行的媒体传播形式。像[微视](https://weishi.qq.com/)和抖音这种 app，每天都会生产成千上万个精彩短视频。而这些视频也为产品带来了巨大的流量。
随之而来，如何让用户可以快速生产一个短视频；或者产品平台如何利用已有的图片、视频、音乐素材批量合成大量视频就成为一个技术难点。

`FFCreatorLite`是一种轻量又简单的解决方案，只需要很少的依赖和较低的机器配置就可以快速开始工作。并且它模拟实现了[`animate.css`](https://animate.style/)90%的动画效果，您可以轻松地把 web 页面端的动画效果转为视频。

`FFCreatorLite`基于著名的视频处理库`FFmpeg`开发, 并且对`FFmpeg`复杂繁琐的命令行参数进行拼接操作(这一点并不是那么容易), 利用`FFmpeg`各种滤镜和特性来实现动画和视频剪辑并生成最终影片。所以它的处理速度超乎你的想象, 甚至远快于[`FFCreator`](https://github.com/tnfe/FFCreator)。

#### 更多介绍请查看[这里](https://tnfe.github.io/FFCreator/#/guide/lite)

## 特性

- 完全基于`node.js`开发，非常易于使用，并且易于扩展和开发。
- 仅依赖`FFmpeg`、易于安装、跨平台，对机器配置要求较低。
- 视频制作速度极快，一个 5 分钟的视频只需要不到 1 分钟。
- 支持图片、声音、视频剪辑、文本等多种元素。
- 视频处理能力极强, 可以对多个视频片段进行裁切、合成等操作。
- 包含`animate.css`70%的动画效果，可以将 css 动画转换为视频。

## Demo

<p align="center">
  <a href="https://tnfe.github.io/FFCreator/#/guide/lite" style="margin-right:100px"><img width="300" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/03.gif?raw=true" /></a>   
  <img width="100" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/foo.png?raw=true" />     
  <a href="https://tnfe.github.io/FFCreator/#/guide/lite"><img width="300" src="https://github.com/tnfe/FFCreatorLite/blob/master/examples/assets/imgs/demo/04.gif?raw=true" /></a>
</p>


## 使用

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

## 关于`FFCreator`

[`FFCreator`](https://github.com/tnfe/FFCreator)并非是`FFCreatorLite`的加强版, 事实上这两者的实现原理完全不同。当您要大量处理视频同时又不需要特别酷炫的过渡动画时, `FFCreatorLite`也许是更好的选择。

#### 实现原理区别
- `FFCreator`使用`opengl`来处理图形渲染并使用`shader`后处理来生成转场效果，最后使用`FFmpeg`合成视频。
- `FFCreatorLite`则完全使用`FFmpeg`滤镜等效果，拼接`FFmpeg`命令来生成动画和视频。

`FFCreatorLite`具备[`FFCreator`](https://github.com/tnfe/FFCreator)70%的功能，但是某些情况下处理速度反而更快，并且安装异常简单。所以请您根据实际的使用情况，来选择具体使用哪个版本的库。

#### 关于注册点的区别

`FFCreatorLite`的默认注册点是左上角且无法修改, 而[`FFCreator`](https://github.com/tnfe/FFCreator)默认注册点是中心而且可以修改。

#### 更详细的教程请查看[这里](https://tnfe.github.io/FFCreator/#/guide/lite)

## 安装

### 由于`FFCreatorLite`仅仅依赖于`FFmpeg`，因此您需要安装`FFmpeg`的常规版本

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to Install FFmpeg on Windows [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
- How to Install FFmpeg on Mac OSX [https://trac.ffmpeg.org/wiki/CompilationGuide/macOS](https://trac.ffmpeg.org/wiki/CompilationGuide/macOS)

##### 更多`FFmpeg`教程请查看[https://trac.ffmpeg.org/wiki](https://trac.ffmpeg.org/wiki)

## 贡献代码

非常欢迎您加入我们一起开发`FFCreatorLite`，如果想要贡献代码请先阅读[这里](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE)
