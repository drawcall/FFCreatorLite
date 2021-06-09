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
const Cache = require('../utils/cache');

class FFImage extends FFNode {
  constructor(conf = { x: 0, y: 0, animations: [] }) {
    super({ type: 'image', ...conf });
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
   * Get use cache
   * @public
   */
  getNoCache() {
    return this.conf.nocache || this.conf.noCache;
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

    const path = this.getPath();
    const noCache = this.getNoCache();

    if (!noCache) {
      if (Cache[path]) {
        const info = Cache[path];
        this.setSize(info.width, info.height);
        resolve();
      } else {
        sizeOf(path, (err, dimensions) => {
          if (!err) {
            const { width, height } = dimensions;
            Cache[path] = { width, height };
            this.setSize(width, height);
          }
          resolve();
        });
      }
    } else {
      sizeOf(path, (err, dimensions) => {
        const { width, height } = dimensions;
        if (!err) this.setSize(width, height);
        resolve();
      });
    }
  }

  isReady() {
    return new Promise(resolve => this.setImageSize(resolve));
  }
}

module.exports = FFImage;
