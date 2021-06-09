'use strict';

/**
 * toAlphaFilter - Convert to ffmpeg alpha filter function
 *
 * ####Note:
 *     toAlphaFilter is mainly used in the FFText component
 *
 * @function
 */
const Ease = require('../math/ease');
const { accAdd } = require('../math/maths');
const Utils = require('../utils/utils');
const AniFilter = require('./anifilter');
const forEach = require('lodash/forEach');

const toAlphaFilter = conf => {
  let { time, showType, add, ing = false, delay, ease = 'linear' } = conf;
  let a, elsestr;
  let from = showType == 'in' ? 0 : 1;
  let to = showType == 'in' ? 1 : 0;
  time = Utils.floor(time, 2);
  const ddelay = accAdd(delay, time);
  const coodi = `between(t,${delay},${ddelay})`;

  // Is it continuous animation or single easing animation
  if (ing) {
    if (!to) to = from + add * time;
    add = Utils.angleToRadian(add, 4);
    a = `${from}+${add}*t`;
  } else {
    a = Ease.getVal(ease, from, to - from, time, delay);
  }

  elsestr = `if(lte(t,_delay_),${to},_else_)`;
  let alpha = `if(${coodi}\,${a}\,_else_${to}_else_)`;
  alpha = Utils.replacePlusMinus(alpha);

  const filter = {
    filter: 'alpha',
    options: { alpha },
  };

  return new AniFilter({
    filter,
    showType,
    name: 'alpha',
    type: 'object',
    data: { time, delay, elsestr },
  });
};

/**
 * create new alpha filter
 * if(a<t<b, T1, if(t<c, C1, if(c<t<d, T2, C2)))
 * @private
 */
const mergeIntoNewAlphaFilter = tfilters => {
  const elseReg = /\_else\_/gi;
  const delayReg = /\_delay\_/gi;
  const elseNelse = /\_else\_[0-9a-z]*\_else\_/gi;

  let a = '';
  let elsea = '';
  forEach(tfilters, (aniFilter, index) => {
    const data = aniFilter.data;
    const delay = data.delay;
    const filter = aniFilter.filter;
    if (index > 0) {
      elsea = elsea.replace(delayReg, delay).replace(elseReg, filter.options.alpha);
      a = a.replace(elseNelse, elsea);
    } else {
      a = String(filter.options.alpha);
      elsea = data.elsestr;
    }
  });

  a = a.replace(elseReg, '');
  const filter = {
    filter: 'alpha',
    options: { alpha: a },
  };
  return new AniFilter({
    filter,
    name: 'alpha',
    type: 'object',
  });
};

/**
 * Replace placeholder characters in the filter field
 * @private
 */
const replaceAlphaFilter = aniFilter => {
  const elseReg = /\_else\_/gi;
  let filter = aniFilter.filter;
  filter.options.alpha = String(filter.options.alpha).replace(elseReg, '');
  aniFilter.filter = filter;
};

module.exports = { toAlphaFilter, mergeIntoNewAlphaFilter, replaceAlphaFilter };
