'use strict';

const FFNode = require('./node');

class FFBackGround extends FFNode {
  constructor(conf = {}) {
    super({type: 'background', ...conf});
    
    this.color = conf.color;
    this.duration = conf.time || conf.duration || 999999;
  }

  concatFilters(context) {
    const filter = this.toFilter(context);
    this.filters.push(filter);
    return this.filters;
  }

  toFilter(context) {
    const filter = {
      filter: 'color',
      options: {
        c: this.color,
        d: this.duration,
        size: this.rootConf().getWH('*'),
      },
      outputs: this.getOID(),
    };

    context.input = this.getOID();
    return filter;
  }
}

module.exports = FFBackGround;
