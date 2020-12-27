'use strict';

/**
 * Renderer - Core classes for rendering animations and videos.
 *
 * ####Example:
 *
 *     const renderer = new Renderer({ queue: 2 });
 *
 *
 * @class
 */
const FFBase = require('./base');
const Perf = require('../utils/perf');
const Utils = require('../utils/utils');
const Synthesis = require('./synthesis');
const forEach = require('lodash/forEach');

class Renderer extends FFBase {
  constructor({queue = 2, creator}) {
    super({type: 'renderer'});

    this.creator = creator;
    this.queue = queue;
    this.cursor = 0;
    this.percent = 0;
  }

  /**
   * Start rendering
   * @async
   * @public
   */
  start() {
    const {creator} = this;
    const log = creator.getConf('log');
    Perf.setEnabled(log);
    Perf.start();

    const {scenes} = creator;
    for (let i = this.cursor; i < this.cursor + this.queue; i++) {
      this.singleStart(scenes[i]);
    }
  }

  async singleStart(scene) {
    if (!scene) return;

    await scene.isReady();
    scene.on('single-start', this.eventHandler.bind(this));
    scene.on('single-error', this.eventHandler.bind(this));
    scene.on('single-progress', this.eventHandler.bind(this));
    scene.on('single-complete', this.eventHandler.bind(this));
    scene.start();
  }

  nextStart() {
    const {scenes} = this.creator;
    const index = this.cursor + this.queue - 1;
    if (index >= scenes.length) return;

    const scene = scenes[index];
    this.singleStart(scene);
  }

  eventHandler(event) {
    event = Utils.clone(event);

    switch (event.type) {
      case 'single-error':
      case 'synthesis-error':
        event.type = 'error';
        this.emits(event);
        break;

      case 'single-progress':
        event.type = 'progress';
        event.percent = this.percent = this.getTotalPercent(event) * 0.7;
        this.emits(event);
        break;

      case 'single-complete':
        this.cursor++;
        this.checkCompleted(event);
        break;
    }
  }

  getTotalPercent(event) {
    let percent = 0;
    const {scenes} = this.creator;
    const scene = event.target;
    scene.percent = event.fpercent;
    forEach(scenes, scene => (percent += scene.percent));
    percent /= scenes.length;
    return percent;
  }

  checkCompleted(event) {
    const {scenes} = this.creator;
    if (this.cursor >= scenes.length) {
      this.synthesisOutput();
    } else {
      this.emits(event);
      this.nextStart();
    }
  }

  /**
   * synthesis Video Function
   * @private
   */
  async synthesisOutput() {
    const {creator} = this;
    const synthesis = new Synthesis(creator);
    synthesis.on('synthesis-error', this.eventHandler.bind(this));
    synthesis.on('synthesis-complete', event => {
      Perf.end();
      event.useage = Perf.getInfo();
      event.percent = 1;
      this.emit('all-complete', event);
    });
    synthesis.on('synthesis-progress', event => {
      event.type = 'progress';
      event.percent = this.percent + event.percent * 0.3;
      this.emits(event);
    });
    synthesis.start();
  }

  destroy() {
    this.creator = null;
    this.synthesis.destroy();
    this.removeAllListeners();
    super.destroy();
  }
}

module.exports = Renderer;
