'use strict';

/**
 * ScenesUtil - A scene manager with some functions.
 *
 * ####Example:
 *
 *     ScenesUtil.isSingle(creator)
 *
 *
 * @class
 */
const forEach = require('lodash/forEach');

const ScenesUtil = {
  isSingle(creator) {
    const { scenes } = creator;
    const conf = creator.rootConf();
    const speed = conf.getVal('speed');
    return speed === 'high' && scenes.length === 1;
  },

  hasTransition(creator) {
    const scene0 = creator.scenes[0];
    return scene0.transition;
  },

  fillTransition(creator) {
    const { scenes } = creator;
    forEach(scenes, scene => scene.fillTransition());
  },

  getLength(creator) {
    const { scenes } = creator;
    return scenes.length;
  },
};

module.exports = ScenesUtil;
