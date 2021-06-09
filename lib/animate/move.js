'use strict';

/**
 * toMoveFilter - Convert to ffmpeg overlay filter function
 *
 * @function
 */
const Ease = require('../math/ease');
const { accAdd } = require('../math/maths');
const Utils = require('../utils/utils');
const AniFilter = require('./anifilter');
const forEach = require('lodash/forEach');

const toMoveFilter = conf => {
  let x, y, movex, movey, elsestr;
  let { from, to, time, delay, showType, add, ing = false, ease = 'linear' } = conf;
  time = Utils.floor(time, 2);
  const ddelay = accAdd(delay, time);
  const coodi = `between(t,${delay},${ddelay})`;

  // Is it continuous animation or single easing animation
  if (ing) {
    if (!to) {
      to = {};
      to.x = from.x + add.x * time;
      to.y = from.y + add.y * time;
    }
    movex = `${from.x}+${add.x}*t`;
    movey = `${from.y}+${add.y}*t`;
  } else {
    movex = Ease.getVal(ease, from.x, to.x - from.x, time, delay);
    movey = Ease.getVal(ease, from.y, to.y - from.y, time, delay);
  }

  elsestr = {};
  elsestr.x = `if(lte(t,_delay_),${to.x},_else_)`;
  elsestr.y = `if(lte(t,_delay_),${to.y},_else_)`;

  x = `if(${coodi}\,${movex}\,_else_${to.x}_else_)`;
  y = `if(${coodi}\,${movey}\,_else_${to.y}_else_)`;
  x = Utils.replacePlusMinus(x);
  y = Utils.replacePlusMinus(y);
  const filter = { filter: 'overlay', options: { x, y } };

  return new AniFilter({
    filter,
    showType,
    name: 'overlay',
    type: 'object',
    data: { time, delay, elsestr },
  });
};

/**
 * create new overlay filter
 * if(a<t<b, T1, if(t<c, C1, if(c<t<d, T2, C2)))
 * @private
 */
const mergeIntoNewOverflyFilter = tfilters => {
  const elseReg = /\_else\_/gi;
  const delayReg = /\_delay\_/gi;
  const elseNelse = /\_else\_[0-9a-z]*\_else\_/gi;

  let x = '';
  let y = '';
  let elsex, elsey;

  // if(lte(t,_delay_),${to.x},_else_)
  forEach(tfilters, (aniFilter, index) => {
    const data = aniFilter.data;
    const delay = data.delay;
    const filter = aniFilter.filter;
    if (index > 0) {
      elsex = elsex.replace(delayReg, delay).replace(elseReg, filter.options.x);
      elsey = elsey.replace(delayReg, delay).replace(elseReg, filter.options.y);
      x = x.replace(elseNelse, elsex);
      y = y.replace(elseNelse, elsey);
    } else {
      x = String(filter.options.x);
      y = String(filter.options.y);
      elsex = data.elsestr.x;
      elsey = data.elsestr.y;
    }
  });

  x = x.replace(elseReg, '');
  y = y.replace(elseReg, '');

  return new AniFilter({
    filter: `overlay=x='${x}':y='${y}'`,
    name: 'overlay',
    type: 'string',
  });
};

/**
 * Replace placeholder characters in the filter field
 * @private
 */
const replaceOverflyFilter = aniFilter => {
  const elseReg = /\_else\_/gi;
  let filter = aniFilter.filter;
  filter.options.x = String(filter.options.x).replace(elseReg, '');
  filter.options.y = String(filter.options.y).replace(elseReg, '');
  aniFilter.filter = filter;
};

module.exports = { toMoveFilter, mergeIntoNewOverflyFilter, replaceOverflyFilter };
