'use strict';

/**
 * toFadeFilter - Convert to ffmpeg fade filter function
 *
 * @function
 */
const Utils = require('../utils/utils');
const AniFilter = require('./anifilter');

const toFadeFilter = conf => {
  let { time, delay, showType = 'in', alpha = 1, color = 'black' } = conf;

  time = Utils.floor(time, 2);
  delay = Utils.floor(delay, 2);

  const filter = {
    filter: 'fade',
    options: {
      type: showType,
      st: delay,
      d: time,
      color,
      alpha,
    },
  };

  return new AniFilter({
    filter,
    showType,
    name: 'fade',
    type: 'object',
    data: { time, delay },
  });
};

module.exports = { toFadeFilter };
