'use strict';

/**
 * FFText - Text component-based display component
 *
 * ####Example:
 *
 *     const text = new FFText({ text: "hello world", x: 400, y: 300 });
 *     text.setColor("#ffffff");
 *     text.setBackgroundColor("#000000");
 *     text.addEffect("fadeIn", 1, 1);
 *     scene.addChild(text);
 *
 * ####Note:
 *     fontfile - The font file to be used for drawing text.
 *     The path must be included. This parameter is mandatory if the fontconfig support is disabled.
 *
 * @class
 */
const forEach = require('lodash/forEach');
const FFNode = require('./node');
const Utils = require('../utils/utils');
const FilterUtil = require('../utils/filter');

class FFText extends FFNode {
  constructor(conf = { x: 0, y: 0, animations: [] }) {
    super({ type: 'text', ...conf });

    const {
      color = 'black',
      backgroundColor,
      fontSize = 24,
      text = '',
      font,
      fontfile,
      fontFamily,
    } = conf;

    this.text = text;
    this.fontcolor = color;
    this.fontsize = fontSize;
    this.boxcolor = backgroundColor;
    this.fontfile = font || fontFamily || fontfile;
  }

  /**
   * Set text value
   * @param {string} text - text value
   * @public
   */
  setText(text) {
    this.text = text;
  }

  /**
   * Set background color
   * @param {string} backgroundColor - the background color value
   * @public
   */
  setBackgroundColor(backgroundColor) {
    this.boxcolor = backgroundColor;
  }

  /**
   * Set text color value
   * @param {string} color - the text color value
   * @public
   */
  setColor(color) {
    this.fontcolor = color;
  }

  /**
   * Set text font file path
   * @param {string} file - text font file path
   * @public
   */
  setFontFile(file) {
    this.fontfile = file;
  }

  /**
   * Set text font file path
   * @param {string} file - text font file path
   * @public
   */
  setFont(file) {
    return this.setFontFile(file);
  }

  /**
   * Set text style by object
   * @param {object} style - style by object
   * @public
   */
  setStyle(style) {
    if (style.color) this.fontcolor = style.color;
    if (style.opacity) this.alpha = style.opacity;
    if (style.border) this.borderw = style.border;
    if (style.borderSize) this.borderw = style.borderSize;
    if (style.fontSize) this.fontsize = parseInt(style.fontSize);
    if (style.borderColor) this.bordercolor = style.borderColor;
    if (style.backgroundColor) this.boxcolor = style.backgroundColor;
    if (style.lineSpacing) this.line_spacing = parseInt(style.lineSpacing);
  }

  /**
   * Set text border value
   * @param {number} borderSize - style border width size
   * @param {string} borderColor - style border color
   * @public
   */
  setBorder(borderSize, borderColor) {
    this.borderw = borderSize;
    this.bordercolor = borderColor;
  }

  /**
   * concatFilters - Core algorithm: processed into ffmpeg filter syntax
   * @param {object} context - context
   * @private
   */
  concatFilters(context) {
    this.animations.replaceEffectConfVal();

    this.filters = this.preFilters.concat(this.filters);
    this.filters = this.filters.concat(this.customFilters);
    const aniFilters = this.animations.concatFilters();
    this.resetXYByAnimations(aniFilters);
    this.resetAlphaByAnimations(aniFilters);

    const filter = this.toFilter();
    if (filter) {
      this.filters.push(filter);
      this.addInputsAndOutputs(context);
    }

    return this.filters;
  }

  resetXYByAnimations(filters) {
    const { x, y } = this.getXYFromOverlay(filters);
    this.x = x;
    this.y = y;
  }

  resetAlphaByAnimations(filters) {
    const alpha = this.getAlphaFromFilters(filters);
    this.alpha = alpha;
  }

  getAlphaFromFilters(filters) {
    let alpha;
    forEach(filters, f => {
      if (f.filter == 'alpha') {
        alpha = f.options.alpha;
      }
    });
    return alpha;
  }

  getXYFromOverlay(filters) {
    let xy = { x: this.x, y: this.y };
    forEach(filters, filter => {
      if (filter.filter == 'overlay') {
        xy = { x: filter.options.x, y: filter.options.y };
      }
    });
    return xy;
  }

  /**
   * Converted to ffmpeg filter command line parameters
   * @private
   */
  toFilter() {
    // Usually FFMpeg text must specify the font file directory
    // if (!this.fontfile) {
    //   console.error('[FFCreatorLite] Sorry FFText no input font file!');
    //   return;
    // }

    const appearTime = this.appearTime || this.animations.getAppearTime();
    const duration = this.duration || this.animations.getDuration();
    const enable = FilterUtil.createFilterEnable({ appearTime, duration });

    const options = {
      line_spacing: this.line_spacing,
      bordercolor: this.bordercolor,
      borderw: this.borderw,
      fontcolor: this.fontcolor,
      fontfile: this.fontfile,
      fontsize: this.fontsize,
      boxcolor: this.boxcolor,
      text: this.text,
      alpha: this.alpha,
      x: this.x,
      y: this.y,
      enable,
    };

    Utils.deleteUndefined(options);
    if (options.boxcolor) options.box = 1;

    return { filter: 'drawtext', options };
  }

  /**
   * Add input param and output param to filter
   * @private
   */
  addInputsAndOutputs(context) {
    if (!this.filters.length) return;

    forEach(this.filters, (filter, index) => {
      let inputs = index == 0 ? context.input : this.getInId();
      this.genNewOutId();
      let outputs = this.getOutId();

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
}

module.exports = FFText;
