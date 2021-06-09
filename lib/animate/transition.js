'use strict';

/**
 * FFTransition - Class used to handle scene transition animation
 *
 * ####Example:
 *
 *     const transition = new FFTransition({ name, duration, params });
 *     // https://trac.ffmpeg.org/wiki/Xfade
 *
 * @object
 */
const FFBase = require('../core/base');
const DateUtil = require('../utils/date');

class FFTransition extends FFBase {
  constructor(conf) {
    super({ type: 'transition', ...conf });

    const { name = 'fade', duration = 600 } = this.conf;
    this.name = name;
    this.offset = 0;
    this.duration = DateUtil.toSeconds(duration);
  }

  /**
   * Converted to ffmpeg command line parameters
   * @private
   */
  toFilter(aoffset) {
    const { offset, duration, name } = this;
    return {
      filter: 'xfade',
      options: {
        transition: name,
        duration,
        offset: offset + aoffset,
      },
    };
  }

  destroy() {}
}

module.exports = FFTransition;
