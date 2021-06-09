'use strict';

/**
 * toRotateFilter - Convert to ffmpeg rotate filter function
 *
 * @function
 */
const Ease = require('../math/ease');
const { accAdd } = require('../math/maths');
const Utils = require('../utils/utils');
const AniFilter = require('./anifilter');
const forEach = require('lodash/forEach');

const toRotateFilter = conf => {
  let rotate, elsestr;
  let { from, to, time, showType, add, ing = false, delay, ease = 'linear' } = conf;
  time = Utils.floor(time, 2);
  from = Utils.angleToRadian(from, 4);
  to = Utils.angleToRadian(to, 4);

  const ddelay = accAdd(delay, time);
  const coodi = `between(t,${delay},${ddelay})`;

  // Is it continuous animation or single easing animation
  if (ing) {
    if (!to) to = from + add * time;
    add = Utils.angleToRadian(add, 4);
    rotate = `${from}+${add}*t`;
  } else {
    rotate = Ease.getVal(ease, from, to - from, time, delay);
  }

  elsestr = `if(lte(t,_delay_),${to},_else_)`;
  let a = `if(${coodi}\,${rotate}\,_else_${to}_else_)`;
  a = Utils.replacePlusMinus(a);

  const filter = {
    filter: 'rotate',
    options: { a, ow: 'hypot(iw,ih)', oh: 'ow', c: `black@0` },
  };

  return new AniFilter({
    filter,
    showType,
    name: 'rotate',
    type: 'object',
    data: { time, delay, elsestr },
  });
};

/**
 * create new rotate filter
 * if(a<t<b, T1, if(t<c, C1, if(c<t<d, T2, C2)))
 * @private
 */
const mergeIntoNewRotateFilter = tfilters => {
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
      elsea = elsea.replace(delayReg, delay).replace(elseReg, filter.options.a);
      a = a.replace(elseNelse, elsea);
    } else {
      a = String(filter.options.a);
      elsea = data.elsestr;
    }
  });

  a = a.replace(elseReg, '');
  const filter = {
    filter: 'rotate',
    options: { a, ow: 'hypot(iw,ih)', oh: 'ow', c: `black@0` },
  };
  return new AniFilter({
    filter,
    name: 'rotate',
    type: 'object',
  });
};

/**
 * Replace placeholder characters in the filter field
 * @private
 */
const replaceRotateFilter = aniFilter => {
  const elseReg = /\_else\_/gi;
  let filter = aniFilter.filter;
  filter.options.a = String(filter.options.a).replace(elseReg, '');
  aniFilter.filter = filter;
};

module.exports = { toRotateFilter, mergeIntoNewRotateFilter, replaceRotateFilter };
