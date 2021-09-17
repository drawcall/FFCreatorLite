'use strict';

/**
 * FFCon - display object container.
 *
 * ####Example:
 *
 *     class FFScene extends FFCon
 *
 * @class
 */
const FFBase = require('../core/base');
const Utils = require('../utils/utils');

class FFCon extends FFBase {
  constructor(conf) {
    super({ type: 'con', ...conf });
    this.children = [];
    this.filters = [];
    this.vLength = 0;
    this.hasInput = false;
    this.context = null;
    this.command = null;
    this.parent = null;
  }

  addChild(child) {
    if (child.hasInput) {
      const index = this.vLength++;
      child.index = index;
      this.context && (this.context.currentIndex = index);
    }

    child.parent = this;
    this.children.push(child);
  }

  addChildAt(child, index) {
    if (child.hasInput) {
      const index = this.vLength++;
      child.index = index;
      this.context && (this.context.currentIndex = index);
    }

    child.parent = this;
    this.children.splice(index, 0, child);
  }

  removeChild(child) {
    child.parent = null;
    Utils.deleteArrayElement(this.children, child);
  }

  swapChild(child1, child2) {
    Utils.swapArrayElement(this.children, child1, child2);
  }

  toCommand() {}

  destroy() {
    this.children.length = 0;
  }
}

module.exports = FFCon;
