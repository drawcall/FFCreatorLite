'use strict';

/**
 * FFCreator - FFCreatorLite main class, a container contains multiple scenes and pictures, etc.
 * Can be used alone, more often combined with FFCreatorCenter.
 *
 * ####Example:
 *
 *     const creator = new FFCreator({ cacheDir, outputDir, width: 800, height: 640, audio });
 *     creator.addChild(scene2);
 *     creator.output(output);
 *     creator.start();
 *
 *
 * ####Note:
 *     The library depends on `ffmpeg` and `webgl` (linux server uses headless-webgl).
 *
 * @class
 */
const forEach = require('lodash/forEach');
const FFCon = require('./node/cons');
const Conf = require('./conf/conf');
const Utils = require('./utils/utils');
const Renderer = require('./core/renderer');
const FFmpegUtils = require('./utils/ffmpeg');

class FFCreator extends FFCon {
  constructor(conf = {}) {
    super({type: 'creator', ...conf});

    this.conf = new Conf(conf);
    this.renderer = new Renderer({threads: this.conf.threads, creator: this});

    this.setConf('log', false);
    this.inCenter = false;
    this.scenes = [];
  }

  setFps(fps) {
    this.setConf('fps', fps);
  }

  setConf(key, val) {
    this.conf.setVal(key, val);
  }

  getConf(key) {
    return this.conf.getVal(key);
  }

  setSize(w, h) {
    this.setConf('w', w);
    this.setConf('h', h);
  }

  addAudio(audio) {
    this.setConf('audio', audio);
  }

  setOutput(output) {
    this.setConf('output', output);
  }

  getOutput() {
    return this.getConf('output');
  }

  openLog() {
    this.setConf('log', true);
  }

  closeLog() {
    this.setConf('log', false);
  }

  addChild(child) {
    this.scenes.push(child);
    super.addChild(child);
  }

  async start() {
    await Utils.sleep(20);

    this.emit('start');
    const {renderer} = this;
    renderer.on('error', event => {
      this.emitsClone('error', event);
      this.deleteAllCacheFile();
    });

    renderer.on('progress', event => {
      this.emitsClone('progress', event);
    });

    renderer.on('all-complete', event => {
      this.emitsClone('complete', event);
      this.deleteAllCacheFile();
    });

    renderer.start();
  }

  getTotalFrames() {
    let frames = 0;
    forEach(this.scenes, scene => (frames += scene.getTotalFrames()));
    return frames;
  }

  /**
   * Create output path, only used when using FFCreatorCenter.
   * @public
   */
  generateOutput() {
    let outputDir = this.getConf('outputDir');
    if (this.inCenter && outputDir) {
      outputDir = outputDir.replace(/\/$/, '');
      const output = `${outputDir}/${Utils.uid()}.mp4`;
      this.setConf('output', output);
    }
  }

  /**
   * Get the video output path
   * @return {string} output - the video output path
   * @public
   */
  getFile() {
    return this.getConf('output');
  }

  deleteAllCacheFile() {
    forEach(this.scenes, scene => scene.deleteCacheFile());
  }

  destroy() {
    super.destroy();
    this.renderer.destroy();
    forEach(this.scenes, scene => scene.destroy());
  }

  static setFFmpegPath(path) {
    FFmpegUtils.setFFmpegPath(path);
  }

  static setFFprobePath(path) {
    FFmpegUtils.setFFprobePath(path);
  }
}

module.exports = FFCreator;
