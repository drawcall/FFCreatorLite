'use strict';

/**
 * toZoomFilter - Convert to zoom filter function
 *
 * ####Note:
 *     Fix ffmpeg zoompan jiggle bug.
 *     https://superuser.com/questions/1112617/ffmpeg-smooth-zoompan-with-no-jiggle/1112680#1112680
 *
 *
 * @function
 */
const forEach = require('lodash/forEach');
const Ease = require('../math/ease');
const Utils = require('../utils/utils');
const AniFilter = require('./anifilter');
const FilterUtil = require('../utils/filter');

const toZoomFilter = conf => {
  let { from = 1, to, showType, time, delay, add, ing = false, size, pad, ease = 'linear' } = conf;
  let zoom, elsestr, filter;
  let maxScale = 1;
  let x = 'iw/2-(iw/zoom/2)';
  let y = 'ih/2-(ih/zoom/2)';

  // reset from to value
  if (from < 1 && pad) {
    to = (1 / from) * to;
    from = 1;
  }

  const fps = conf.rootConf.getVal('fps');
  const frames = fps * time;
  const delayFrames = fps * delay;
  // (max>=x>=min)
  const coodi = `between(on,${delayFrames - 1},${delayFrames + frames})`;

  // Is it continuous animation or single easing animation
  if (ing) {
    if (!to) to = from + add * frames;
    zoom = `${from}+${add}*(on-${delayFrames})`;
  } else {
    zoom = Ease.getVal(ease, from, to - from, frames, delayFrames).replace(/t/gi, 'on');
  }

  //-
  elsestr = `if(lte(on,_delay_),${to},_else_)`;
  let z = `if(${coodi}\,${zoom}\,_else_${to}_else_)`;
  z = Utils.replacePlusMinus(z);

  //-
  maxScale = Math.max(from, to);
  const padFilter = FilterUtil.createPadFilter(maxScale);
  const scaleFilter = FilterUtil.createScaleFilter(4000);
  const zoomFilter = FilterUtil.createZoomFilter({ x, y, z, s: size, fps, d: frames });
  filter = pad ? `${padFilter},${scaleFilter},${zoomFilter}` : `${scaleFilter},${zoomFilter}`;

  return new AniFilter({
    filter,
    showType,
    name: 'zoompan',
    type: 'string',
    data: { time, delay: delayFrames, elsestr, z },
  });
};

/**
 * create new zoompan filter
 * if(a<t<b, T1, if(t<c, C1, if(c<t<d, T2, C2)))
 * @private
 */
const mergeIntoNewZoompanFilter = tfilters => {
  const elseReg = /\_else\_/gi;
  const delayReg = /\_delay\_/gi;
  const elseNelse = /\_else\_[0-9a-z]*\_else\_/gi;

  let zoom = '';
  let elsez;

  // if(lte(t,_delay_),${to.x},_else_)
  forEach(tfilters, (aniFilter, index) => {
    const data = aniFilter.data;
    const delay = data.delay;
    const z = data.z;
    const filter = aniFilter.filter;
    if (index > 0) {
      elsez = elsez.replace(delayReg, delay).replace(elseReg, z);
      zoom = zoom.replace(elseNelse, elsez);
    } else {
      zoom = String(filter);
      elsez = data.elsestr;
    }
  });

  zoom = zoom.replace(elseReg, '');
  return new AniFilter({
    filter: zoom,
    name: 'zoompan',
    type: 'string',
  });
};

/**
 * Replace placeholder characters in the filter field
 * @private
 */
const replaceZoomFilter = aniFilter => {
  const elseReg = /\_else\_/gi;
  let filter = aniFilter.filter;
  filter = String(filter).replace(elseReg, '');
  aniFilter.filter = filter;
};

module.exports = { toZoomFilter, mergeIntoNewZoompanFilter, replaceZoomFilter };
