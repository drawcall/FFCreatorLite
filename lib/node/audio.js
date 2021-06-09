'use strict';

/**
 * FFVideo - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideo({ path, width: 500, height: 350, loop: true });
 *     scene.addChild(video);
 *
 *
 * @class
 */
const FFNode = require('./node');

class FFAudio extends FFNode {
  constructor(conf) {
    super({ type: 'audio', ...conf });
    this.hasInput = true;
  }

  /**
   * Add video ffmpeg input
   * ex: loop 1 -t 20  -i imgs/logo.png
   * @private
   */
  addInput(command) {
    const { audio, loop } = this.conf;
    command.addInput(audio);
    loop && command.inputOptions(['-stream_loop', '-1']);
  }

  getFId(k = false) {
    const vid = `${this.index}:a`;
    return k ? `[${vid}]` : `${vid}`;
  }

  setLoop(loop) {
    this.conf.loop = loop;
  }

  addOptions(command) {
    const inputs = this.getInId();
    command.outputOptions(`-map ${inputs} -c:a aac -shortest`.split(' '));
  }

  concatFilters() {
    return this.filters;
  }
}

module.exports = FFAudio;
