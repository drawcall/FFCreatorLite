'use strict';

/**
 * FFScene - Scene component, a container used to load display object components.
 *
 * ####Example:
 *
 *     const scene = new FFScene();
 *     scene.setBgColor("#ffcc00");
 *     scene.setDuration(6);
 *     creator.addChild(scene);
 *
 * @class
 */
const path = require('path');
const rmfr = require('rmfr');
const fs = require('fs-extra');
const FFCon = require('./cons');
const FFAudio = require('./audio');
const FFImage = require('./image');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');
const FFContext = require('../core/context');
const FFmpegUtil = require('../utils/ffmpeg');
const FFBackGround = require('../node/background');
const FFTransition = require('../animate/transition');

class FFScene extends FFCon {
  constructor(conf) {
    super({ type: 'scene', ...conf });

    this.percent = 0;
    this.duration = 10;
    this.directory = '';
    this.context = null;
    this.command = null;
    this.transition = null;
    this.pathId = Utils.uid();

    this.setBgColor('#000000');
    this.addBlankImage();
  }

  addBlankImage() {
    const blank = path.join(__dirname, '../assets/blank.png');
    this.addChild(new FFImage({ path: blank, x: -10, y: 0 }));
  }

  /**
   * Set the time the scene stays in the scree
   * @param {number} duration - the time the scene
   * @public
   */
  setDuration(duration) {
    this.background && this.background.setDuration(duration);
    this.duration = duration;
  }

  /**
   * Set scene transition animation
   * @param {string|object} name - transition animation name or animation conf object
   * @param {number} duration - transition animation duration
   * @param {object} params - transition animation params
   * @public
   */
  setTransition(name, duration) {
    if (typeof name === 'object') {
      name = name.name;
      duration = name.duration;
    }
    this.transition = new FFTransition({ name, duration });
  }

  /**
   * Set background color
   * @param {string} bgcolor - background color
   * @public
   */
  setBgColor(color) {
    if (this.background) this.removeChild(this.background);
    this.background = new FFBackGround({ color });
    this.addChildAt(this.background, 0);
  }

  getFile() {
    return this.filepath;
  }

  getNormalDuration() {
    const transTime = this.transition ? this.transition.duration : 0;
    return this.duration - transTime;
  }

  createFilepath() {
    const { id, pathId } = this;
    const cacheDir = this.rootConf('cacheDir').replace(/\/$/, '');
    const format = this.rootConf('cacheFormat');
    const dir = `${cacheDir}/${pathId}`;
    const directory = dir.replace(/\/$/, '');
    const filepath = `${directory}/${id}.${format}`;
    fs.ensureDir(dir);

    this.filepath = filepath;
    this.directory = directory;
    return filepath;
  }

  // about command
  createNewCommand() {
    const conf = this.rootConf();
    const threads = conf.getVal('threads');
    const upStreaming = conf.getVal('upStreaming');
    const command = FFmpegUtil.createCommand({ threads });
    if (!upStreaming) {
      command.setDuration(this.duration);
    }

    this.command = command;
    this.context = new FFContext();
  }

  toCommand() {
    const command = this.command;
    this.addNodesInputCommand(command);
    this.toFiltersCommand(command);
    this.addCommandOptions(command);
    this.addCommandOutputs(command);
    this.addNodesOutputCommand(command);
    this.addCommandEvents(command);

    return command;
  }

  start() {
    this.createNewCommand();
    this.toCommand();
    this.command.run();
  }

  addCommandOptions(command) {
    const conf = this.rootConf();
    const upStreaming = conf.getVal('upStreaming');

    if (upStreaming) {
      FFmpegUtil.addDefaultOptions({ command, conf, audio: true });
    } else {
      FFmpegUtil.addDefaultOptions({ command, conf, audio: false });
    }

    const fps = conf.getVal('fps');
    if (fps != 25) command.outputFPS(fps);

    const { children } = this;
    forEach(children, child => child.addOptions(command));
  }

  addCommandOutputs(command) {
    let filepath;
    const conf = this.rootConf();
    const output = conf.getVal('output');
    const upStreaming = conf.getVal('upStreaming');

    if (upStreaming) {
      filepath = output;
      command.outputOptions(['-f', 'flv']);
    } else {
      filepath = this.createFilepath();
    }

    command.output(filepath);
  }

  deleteCacheFile() {
    const conf = this.rootConf();
    const debug = conf.getVal('debug');
    if (!debug && this.directory) rmfr(this.directory);
  }

  // addInputs
  addNodesInputCommand(command) {
    forEach(this.children, child => child.addInput(command));
  }

  // addOutputs
  addNodesOutputCommand(command) {
    forEach(this.children, child => child.addOutput(command));
  }

  // filters toCommand
  toFiltersCommand(command) {
    const filters = this.concatFilters();
    command.complexFilter(filters, this.context.input);
  }

  toTransFilter(offset) {
    return this.transition.toFilter(offset);
  }

  fillTransition() {
    if (!this.transition) {
      this.setTransition('fade', 0.5);
    }
  }

  /**
   * Combine various filters as ffmpeg parameters
   * @private
   */
  concatFilters() {
    forEach(this.children, child => {
      const filters = child.concatFilters(this.context);
      if (filters.length) this.filters = this.filters.concat(filters);
    });

    return this.filters;
  }

  getTotalFrames() {
    return this.rootConf().getVal('fps') * this.duration;
  }

  // add command eventemitter3
  addCommandEvents(command) {
    const log = this.rootConf('log');
    FFmpegUtil.addCommandEvents({
      log,
      command,
      type: 'single',
      totalFrames: this.getTotalFrames(),
      start: this.commandEventHandler.bind(this),
      error: this.commandEventHandler.bind(this),
      complete: this.commandEventHandler.bind(this),
      progress: this.commandEventHandler.bind(this),
    });
  }

  commandEventHandler(event) {
    event.target = this;
    this.emits(event);
  }

  addAudio() {
    const conf = this.rootConf();
    const audio = conf.getVal('audio');
    const loop = conf.getVal('audioLoop');
    if (audio) this.addChild(new FFAudio({ audio, loop }));
  }

  isReady() {
    return new Promise(resolve => {
      let readyIndex = 0;
      forEach(this.children, child => {
        child.isReady().then(() => {
          readyIndex++;
          if (readyIndex >= this.children.length) {
            resolve();
          }
        });
      });
    });
  }

  destroy() {
    FFmpegUtil.destroy(this.command);
    super.destroy();
    this.transition.destroy();
    this.transition = null;
    this.context = null;
    this.command = null;
  }
}

module.exports = FFScene;
