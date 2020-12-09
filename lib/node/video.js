'use strict';

/**
 * FFVideo - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideo({ path, width: 500, height: 350 });
 *     scene.addChild(video);
 *
 *
 * @class
 */
const isNumber = require('lodash/isNumber');
const FFImage = require('./image');

class FFVideo extends FFImage {
  constructor(conf = {x: 0, y: 0, animations: []}) {
    super({type: 'video', ...conf});
  }

  /**
   * Add ffmpeg input
   * ex: loop 1 -t 20  -i imgs/logo.png
   * @private
   */
  addInput(command) {
    const {loop, delay} = this.conf;

    if (loop) {
      const num = isNumber(loop) ? isNumber(loop) : -1;
      command.addInput(this.getPath()).inputOption('-stream_loop', `${num}`);
    } else {
      command.addInput(this.getPath());
    }

    if (delay) command.inputOption('-itsoffset', delay);
  }

  isReady() {
    return new Promise(resolve => resolve());
  }
}

module.exports = FFVideo;
