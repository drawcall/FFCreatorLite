'use strict';

/**
 * FFCreator - FFCreatorLite main class, a container contains multiple scenes and pictures, etc.
 * Can be used alone, more often combined with FFCreatorCenter.
 *
 * ####Example:
 *
 *     const creator = new FFCreator({ cacheDir, outputDir, width: 800, height: 640, audio });
 *     creator.addChild(scene);
 *     creator.output(output);
 *     creator.openLog();
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
const FFmpegUtil = require('./utils/ffmpeg');

class FFCreator extends FFCon {
  constructor(conf = {}) {
    super({ type: 'creator', ...conf });

    this.conf = new Conf(conf);
    const queue = this.getConf('queue');
    this.renderer = new Renderer({ queue, creator: this });

    this.closeLog();
    this.scenes = [];
    this.taskId = null;
    this.inCenter = false;
  }

  /**
   * Set the fps of the composite video.
   * @param {number} fps - the fps of the composite video
   * @public
   */
  setFps(fps) {
    this.setConf('fps', fps);
  }

  /**
   * Set configuration.
   * @param {string} key - the config key
   * @param {any} val - the config val
   * @public
   */
  setConf(key, val) {
    this.conf.setVal(key, val);
  }

  /**
   * Get configuration.
   * @param {string} key - the config key
   * @return {any}  the config val
   * @public
   */
  getConf(key) {
    return this.conf.getVal(key);
  }

  /**
   * Set the stage size of the scene
   * @param {number} width - stage width
   * @param {number} height - stage height
   * @public
   */
  setSize(w, h) {
    this.setConf('w', w);
    this.setConf('h', h);
  }

  /**
   * Add background sound.
   * @param {string|objecg} args - the audio config
   * @public
   */
  addAudio(audio) {
    this.setConf('audio', audio);
  }

  /**
   * Set the video output path
   * @param {string} output - the video output path
   * @public
   */
  setOutput(output) {
    this.setConf('output', output);
  }

  /**
   * Get Current ffmpeg version
   * @return {string} current ffmpeg version
   * @public
   */
  async getFFmpegVersion() {
    return await FFmpegUtil.getVersion();
  }

  getOutput() {
    return this.getConf('output');
  }

  /**
   * Open logger switch
   * @public
   */
  openLog() {
    this.setConf('log', true);
  }

  /**
   * Close logger switch
   * @public
   */
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
    const { renderer } = this;
    renderer.on('error', event => {
      this.emitsClone('error', event);
      this.deleteAllCacheFile();
    });

    renderer.on('progress', event => {
      this.emitsClone('progress', event);
    });

    renderer.on('all-complete', event => {
      if (this.inCenter) {
        event.taskId = this.taskId;
      }

      event.creator = this.id;
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
    const upStreaming = this.getConf('upStreaming');
    let outputDir = this.getConf('outputDir');

    if (this.inCenter && outputDir && !upStreaming) {
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

  /**
   * delete All Cache File
   * @private
   */
  deleteAllCacheFile() {
    forEach(this.scenes, scene => scene.deleteCacheFile());
  }

  destroy() {
    super.destroy();
    this.renderer.destroy();
    forEach(this.scenes, scene => scene.destroy());
  }

  /**
   * Set the installation path of the current server ffmpeg.
   * @param {string} path - installation path of the current server ffmpeg
   * @public
   */
  static setFFmpegPath(path) {
    FFmpegUtil.setFFmpegPath(path);
  }

  /**
   * Set the installation path of the current server ffprobe.
   * @param {string} path - installation path of the current server ffprobe
   * @public
   */
  static setFFprobePath(path) {
    FFmpegUtil.setFFprobePath(path);
  }
}

module.exports = FFCreator;
