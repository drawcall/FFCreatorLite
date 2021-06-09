'use strict';

const FFNode = require('./node');

class FFBackGround extends FFNode {
  constructor(conf = {}) {
    super({ type: 'background', ...conf });

    this.color = conf.color;
    this.duration = conf.time || conf.duration || 999999;
  }

  /**
   * Combine various filters as ffmpeg parameters
   * @private
   */
  concatFilters(context) {
    const filter = this.toFilter(context);
    this.filters.push(filter);
    return this.filters;
  }

  /**
   * Converted to ffmpeg filter command line parameters
   * @private
   */
  toFilter(context) {
    const conf = this.rootConf();
    const filter = {
      filter: 'color',
      options: {
        c: this.color,
        d: this.duration,
        size: conf.getWH('*'),
      },
      outputs: this.getOutId(),
    };

    context.input = this.getOutId();
    return filter;
  }
}

module.exports = FFBackGround;
