'use strict';

/**
 * FFNode Class - FFCreatorLite displays the basic class of the object,
 * Other display objects need to inherit from this class.
 *
 * ####Example:
 *
 *     const node = new FFNode({ x: 10, y: 20 });
 *
 * @class
 */
const forEach = require('lodash/forEach');
const FFBase = require('../core/base');
const Utils = require('../utils/utils');
const FilterUtil = require('../utils/filter');
const FFAnimations = require('../animate/animations');

class FFNode extends FFBase {
  constructor(conf = {}) {
    super({ type: 'node', ...conf });

    const { x = 0, y = 0, scale = 1, rotate = 0, animations = [], w, h, props } = this.conf;
    this.index = 0;
    this.fIndex = 0;
    this.duration = 0;
    this.appearTime = 0;
    this.filters = [];
    this.preFilters = [];
    this.customFilters = [];
    this.parent = null;
    this.hasInput = false;

    this.setXY(x, y);
    this.setWH(w, h);
    this.setPorps(props);
    this.setScale(scale);
    this.setRotate(rotate);
    this.animations = new FFAnimations(animations);
    this.animations.setTarget(this);
  }

  /**
   * Get the vid in the ffmpeg filter
   * @param {boolean} k - Whether to include outer brackets
   * @return {string} vid
   * @public
   */
  getFId(k = false) {
    const vid = `${this.index}:v`;
    return k ? `[${vid}]` : `${vid}`;
  }

  /**
   * Get the input id in the ffmpeg filter
   * @param {boolean} k - Whether to include outer brackets
   * @return {string} input id
   * @public
   */
  getInId(k = false) {
    if (this.fIndex === 0) {
      return this.getFId(k);
    } else {
      return this.getOutId(k);
    }
  }

  /**
   * Get the output id in the ffmpeg filter
   * @param {boolean} k - Whether to include outer brackets
   * @return {string} output id
   * @public
   */
  getOutId(k = false) {
    const id = `${this.id}-${this.fIndex}`;
    return k ? `[${id}]` : `${id}`;
  }

  /**
   * Generate new output id
   * @public
   */
  genNewOutId() {
    this.fIndex++;
  }

  /**
   * Set display object scale
   * @param {number} scale
   * @public
   */
  setScale(scale = 1) {
    this.scale = scale;
  }

  /**
   * Set display object rotate
   * @param {number} rotate
   * @public
   */
  setRotate(rotate = 0) {
    this.rotate = rotate;
  }

  setAppearTime(appearTime) {
    this.appearTime = appearTime;
  }

  /**
   * Set display object width and height
   * @param {number} width - object width
   * @param {number} height - object height
   * @public
   */
  setWH(w, h) {
    this.setSize(w, h);
  }

  /**
   * Set display object width and height
   * @param {number} width - object width
   * @param {number} height - object height
   * @public
   */
  setSize(w, h) {
    if (w === undefined) return;
    this.w = w;
    this.h = h;
  }

  /**
   * Get display object width and height
   * @return {string} 1000*120
   * @public
   */
  getSize(dot = '*') {
    return `${this.w}${dot}${this.h}`;
  }

  /**
   * Set the duration of node in the scene
   * @param {number} duration
   * @public
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * Set display object x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   * @public
   */
  setXY(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  setPorps(a, b) {
    if (b === undefined) {
      this.props = a;
    } else {
      this[a] = b;
    }
  }

  /**
   * Set display object x,y position from style object
   * @param {object} style - css style object
   * @public
   */
  setXYFromStyle(style) {
    const x = parseInt(style.left);
    const y = parseInt(style.top);
    return this.setXY(x, y);
  }

  /**
   * Add one/multiple animations or effects
   * @public
   */
  setAnimations(animations) {
    this.animations.setAnimations(animations);
  }

  /**
   * Add special animation effects
   * @param {string} type - animation effects name
   * @param {number} time - time of animation
   * @param {number} delay - delay of animation
   * @public
   */
  addEffect(type, time, delay) {
    this.animations.addEffect(type, time, delay);
  }

  addAnimate(animation) {
    return this.animations.addAnimate(animation);
  }

  /**
   * concatFilters - Core algorithm: processed into ffmpeg filter syntax
   * 1. add preset filters    -> pre filter
   * 2. scale+rotate          -> pre filter
   * 3. other filters
   * 4. fade/zoompan
   * 5. x/y                   -> last overlay
   *
   * @param {object} context - context
   * @private
   */
  concatFilters(context) {
    // 1. recorrect position
    this.animations.replaceEffectConfVal();
    this.recorrectPosition();

    // 2. add preset filters
    this.filters = this.preFilters.concat(this.filters);

    // 3. add scale rotate filters
    const srFilter = FilterUtil.assembleSRFilter({ scale: this.scale, rotate: this.rotate });
    if (srFilter) this.filters.push(srFilter);

    // 4. add others custom filters
    this.filters = this.filters.concat(this.customFilters);

    // 5. add animations filters
    this.appearTime = this.appearTime || this.animations.getAppearTime();
    // Because overlay enable is used, remove this
    // this.animations.modifyDelayTime(this.appearTime);
    const aniFilters = this.animations.concatFilters();
    this.filters = this.filters.concat(aniFilters);

    // 6. set overlay filter x/y
    if (!FilterUtil.getOverlayFromFilters(this.filters)) {
      const xyFilter = FilterUtil.createOverlayFilter(this.x, this.y);
      this.filters.push(xyFilter);
    }

    // 7. add appearTime setpts
    // Because overlay enable is used, remove this
    // this.filters.push(FilterUtil.createSetptsFilter(this.appearTime));

    // 8. add this duration time
    this.addDurationToOverlay();

    // 9. add inputs and outputs
    this.addInputsAndOutputs(context);
    return this.filters;
  }

  recorrectPosition() {
    if (this.animations.hasAnimate('rotate')) {
      const w = this.w;
      const h = this.h;
      const diagonal = Math.sqrt(w * w + h * h);
      this.x += Utils.floor((w - diagonal) / 2, 0);
      this.y += Utils.floor((h - diagonal) / 2, 0);
    } else if (this.animations.hasZoompanPad()) {
      //const scale = this.animations.getMaxScale();
      // this.x -= ((scale - 1) * this.w) / 2;
      // this.y -= ((scale - 1) * this.h) / 2;
    }
  }

  /**
   * Add Duration interval time to filter
   * @private
   */
  addDurationToOverlay() {
    this.appearTime = this.appearTime || this.animations.getAppearTime();
    this.duration = this.duration || this.animations.getDuration();

    FilterUtil.addDurationToOverlay({
      filters: this.filters,
      appearTime: this.appearTime,
      duration: this.duration,
    });
  }

  /**
   * Add input param and output param to filter
   * @private
   */
  addInputsAndOutputs(context) {
    if (!this.filters.length) return;

    forEach(this.filters, (filter, index) => {
      const inputs = this.getInId();
      this.genNewOutId();
      const outputs = this.getOutId();

      this.filters[index] = FilterUtil.setInputsAndOutputs({
        filter,
        inputs,
        outputs,
        contextInputs: context.input,
      });
    });

    // 5. set context input
    context.input = this.getOutId();
  }

  /**
   * other methods
   * @private
   */
  addFilter(filter) {
    this.customFilters.push(filter);
  }

  addPreFilter(filter) {
    this.preFilters.push(filter);
  }

  addInput(command) {
    //command.addInput(this.conf.path);
  }

  addOutput(command) {
    //command.addInput(this.conf.path);
  }

  addOptions() {}

  addBlend(blend) {
    this.addPreFilter(`blend=all_expr='${blend}'`);
  }

  addTBlend(blend, mode = 'all_mode') {
    this.addPreFilter(`tblend=${mode}=${blend}`);
  }

  isReady() {
    return new Promise(resolve => resolve());
  }

  toFilter() {}
}

module.exports = FFNode;
