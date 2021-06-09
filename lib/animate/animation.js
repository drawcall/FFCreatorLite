'use strict';

/**
 * FFAnimation - The class used to animate the display element
 *
 * ####Example:
 *
 *     const animation = new FFAnimation({ ...animation, parent });
 *     animation.start();
 *     animation.stop();
 *
 *
 * ####Note:
 *     Easeing function
 *     Type In-Out-InOut
 *     Ease Quadratic Cubic Quartic Quintic Exponential Circular Elastic Back Bounce
 *
 * @class
 */
const FFBase = require('../core/base');
const { toMoveFilter } = require('./move');
const { toFadeFilter } = require('./fade');
const { toZoomFilter } = require('./zoom');
const { toAlphaFilter } = require('./alpha');
const { toRotateFilter } = require('./rotate');

class FFAnimation extends FFBase {
  constructor(conf = { type: 'fade', showType: 'in', time: 2, delay: 0 }) {
    super({ type: 'animation', ...conf });

    this.conf = conf;
    this.filter = null;
    this.isFFAni = true;
  }

  /**
   * Converted to ffmpeg command line parameters
   * @private
   */
  toFilter() {
    const conf = this.getFromConf();
    conf.rootConf = this.rootConf();
    let method;

    switch (this.conf.type) {
      case 'move':
        method = toMoveFilter;
        break;

      case 'fade':
      case 'show':
        method = toFadeFilter;
        break;

      case 'rotate':
        method = toRotateFilter;
        break;

      case 'zoom':
      case 'zoompan':
        method = toZoomFilter;
        break;

      case 'alpha':
        method = toAlphaFilter;
        break;
    }

    if (method) this.filter = method(conf);
    return this.filter;
  }

  /**
   * Get value from conf
   * @private
   */
  getFromConf(key) {
    return key ? this.conf[key] : this.conf;
  }

  setToConf(key, val) {
    this.conf[key] = val;
  }

  /**
   * Get from and to value from conf
   * @private
   */
  getFromTo() {
    let { from, to, add, time, type } = this.getFromConf();
    if (!to) {
      if (type === 'move') {
        to = {};
        to.x = from.x + add.x * time;
        to.y = from.y + add.y * time;
      } else if (type === 'zoom') {
        const fps = this.rootConf().getVal('fps');
        const frames = fps * time;
        to = from + add * frames;
      } else {
        to = from + add * time;
      }
    }

    return { from, to };
  }
}

module.exports = FFAnimation;
