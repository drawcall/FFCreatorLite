'use strict';

/**
 * FilterUtil - Utility function collection of filter
 *
 * ####Example:
 *
 *     const padFilter = FilterUtil.createPadFilter(maxScale);
 *     const scaleFilter = FilterUtil.createScaleFilter(4000);
 *     const zoomFilter = FilterUtil.createZoomFilter({x, y, z, s: size, fps, d: frames});
 *
 * @object
 */

const Utils = require('./utils');
const isArray = require('lodash/isArray');

const FilterUtil = {
  // if include overlay filter
  getOverlayFromFilters(filters) {
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (typeof filter === 'string') {
        if (/^overlay=/g.test(filter)) return filter;
      } else {
        if (filter.filter == 'overlay') return filter;
      }
    }

    return null;
  },

  createPadFilter(scale) {
    return `format=yuva420p,pad=${scale}*iw:${scale}*ih:(ow-iw)/2:(oh-ih)/2:black@0`;
  },

  createScaleFilter(w = 6000) {
    return `scale=${w}x${w}`;
  },

  createZoomFilter({ x, y, z, s, fps, d }) {
    let filter = 'zoompan=';
    if (z) filter += `z='${z}'`;
    if (d) filter += `:d='${d}'`;
    if (x) filter += `:x='${x}'`;
    if (y) filter += `:y='${y}'`;
    if (s) filter += `:s='${s}'`;
    if (fps) filter += `:fps='${fps}'`;

    return filter;
  },

  createOverlayFilter(x, y) {
    return {
      filter: 'overlay',
      options: { x, y },
    };
  },

  createSetptsFilter(appearTime = 0) {
    return `setpts=PTS-STARTPTS+${appearTime}/TB`;
  },

  // assemble scale rotate filters
  assembleSRFilter({ scale, rotate }) {
    let filter = '';
    if (scale != 1) {
      scale = Utils.floor(scale, 2);
      filter += `scale=iw*${scale}:ih*${scale},`;
    }

    if (rotate != 0) {
      rotate = Utils.angleToPI(this.rotate);
      filter += `rotate=${rotate},`;
    }

    filter = filter.replace(/,$/gi, '');
    return filter;
  },

  // set inputs and outputs
  setInputsAndOutputs({ filter, contextInputs, inputs, outputs }) {
    if (typeof filter === 'string') {
      // is overlay filter
      if (/^overlay=/g.test(filter)) {
        filter = `[${contextInputs}][${inputs}]${filter}[${outputs}]`;
      } else {
        filter = `[${inputs}]${filter}[${outputs}]`;
      }
    } else {
      // is overlay filter
      if (filter.filter === 'overlay') {
        filter.inputs = [contextInputs, inputs];
        filter.outputs = outputs;
      } else {
        filter.inputs = inputs;
        filter.outputs = outputs;
      }
    }

    return filter;
  },

  // add overlay filter duration ---
  addDurationToOverlay({ filters, appearTime, duration }) {
    let overlay = this.getOverlayFromFilters(filters);
    if (!overlay) return;
    if (appearTime <= 0) return;

    const index = filters.indexOf(overlay);
    const enable = this.createFilterEnable({ appearTime, duration });
    if (typeof overlay === 'string') {
      overlay += `:enable='${enable}'`;
    } else {
      overlay.options.enable = enable;
    }
    filters[index] = overlay;
  },

  createFilterEnable({ appearTime, duration }) {
    if (duration <= 0) duration = 99999;
    return `between(t,${appearTime},${duration})`;
  },

  makeFilterStrings(filters) {
    const streamRegexp = /^\[?(.*?)\]?$/;
    const filterEscapeRegexp = /[,]/;

    return filters.map(function(filterSpec) {
      if (typeof filterSpec === 'string') return filterSpec;

      let filterString = '';
      if (isArray(filterSpec.inputs)) {
        filterString += filterSpec.inputs
          .map(streamSpec => streamSpec.replace(streamRegexp, '[$1]'))
          .join('');
      } else if (typeof filterSpec.inputs === 'string') {
        filterString += filterSpec.inputs.replace(streamRegexp, '[$1]');
      }

      // Add filter
      filterString += filterSpec.filter;

      // Add options
      if (filterSpec.options) {
        if (typeof filterSpec.options === 'string' || typeof filterSpec.options === 'number') {
          // Option string
          filterString += '=' + filterSpec.options;
        } else if (isArray(filterSpec.options)) {
          // Option array (unnamed options)
          filterString +=
            '=' +
            filterSpec.options
              .map(function(option) {
                if (typeof option === 'string' && option.match(filterEscapeRegexp)) {
                  return "'" + option + "'";
                } else {
                  return option;
                }
              })
              .join(':');
        } else if (Object.keys(filterSpec.options).length) {
          // Option object (named options)
          filterString +=
            '=' +
            Object.keys(filterSpec.options)
              .map(function(option) {
                let value = filterSpec.options[option];

                if (typeof value === 'string' && value.match(filterEscapeRegexp)) {
                  value = "'" + value + "'";
                }

                return option + '=' + value;
              })
              .join(':');
        }
      }

      // Add outputs
      if (isArray(filterSpec.outputs)) {
        filterString += filterSpec.outputs
          .map(streamSpec => streamSpec.replace(streamRegexp, '[$1]'))
          .join('');
      } else if (typeof filterSpec.outputs === 'string') {
        filterString += filterSpec.outputs.replace(streamRegexp, '[$1]');
      }

      return filterString;
    });
  },
};

module.exports = FilterUtil;
