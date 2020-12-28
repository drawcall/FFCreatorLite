'use strict';

/**
 * FFImage - Image component-based display component
 *
 * ####Example:
 *
 *     const img = new FFImage({ path, x: 94, y: 271, width: 375, height: 200, resetXY: true });
 *     img.addEffect("slideInDown", 1.2, 0);
 *     scene.addChild(img);
 *
 * @class
 */
const sizeOf = require('image-size');
const FFNode = require('./node');

class FFImage extends FFNode {
  constructor(conf = {x: 0, y: 0, animations: []}) {
    super({type: 'image', ...conf});
    this.hasInput = true;
    // this.addImagePreFilter();
  }

  /**
   * Add image preprocessing filter parameters
   * @public
   */
  addImagePreFilter() {
    this.addPreFilter('format=yuv420p');
  }

  /**
   * Add zoom and rotate filter parameters
   * @public
   */
  toSRFilter() {
    let filter = super.toSRFilter();
    filter = `format=yuv420p,${filter}`;
    filter = filter.replace(/,$/gi, '');
    return filter;
  }

  /**
   * Get image path
   * @public
   */
  getPath() {
    return this.conf.path || this.conf.image || this.conf.url;
  }

  /**
   * Add ffmpeg input
   * ex: loop 1 -t 20  -i imgs/logo.png
   * @private
   */
  addInput(command) {
    command.addInput(this.getPath()).loop();
  }

  /**
   * Reset picture size
   * @private
   */
  setImageSize(resolve) {
    if (this.w) return resolve();

    sizeOf(this.getPath(), (err, dimensions) => {
      if (!err) this.setSize(dimensions.width, dimensions.height);
      resolve();
    });
  }

  isReady() {
    return new Promise(resolve => this.setImageSize(resolve));
  }
}

module.exports = FFImage;
