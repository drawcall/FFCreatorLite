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
    command.addInput(this.getPath());
  }

  isReady() {
    return new Promise(resolve => resolve());
  }
}

module.exports = FFVideo;
