'use strict';

/**
 * Effects - Some simulation css animation effects collection
 * Effect realizes the animation of `animate.css` _4.1.0_ version https://animate.style/
 *
 * ####Example:
 *
 *     const ani = Effects.getAnimation({ type, time, delay }, attr);
 *
 *
 *
 * @class
 */

const Effects = {};

// mapping key
const target = '_target_';
const targetLeft = '_target_left_';
const targetRight = '_target_right_';
const targetUp = '_target_up_';
const targetBottom = '_target_bottom_';
const targetLeftBig = '_target_left_big_';
const targetRightBig = '_target_right_big_';
const targetUpBig = '_target_up_big_';
const targetBottomBig = '_target_bottom_big_';
const targetRotate = '_target_rotate_';
const targetRotateAdd = '_target_rotate_add_';
const targetRotateAddBig = '_target_rotate_add_big_';
const zoomBig = '_zoom_big_';
const zoomBiging = '_zoom_biging_';
const targetSize = '_target_size_';

// base props
const time = 3;
const inDelay = 0;
const outDelay = 5;
const zoomingSpeed = 0.005;
const moveingSpeed = 50;
const ins = { showType: 'in', time, delay: inDelay };
const outs = { showType: 'out', time, delay: outDelay };
const ingins = { showType: 'in', time: 60 * 60, delay: inDelay, ing: true };
const ingouts = { showType: 'out', time: 60 * 60, delay: outDelay, ing: true };

// all effects
Effects.effects = {
  // no
  no: { type: 'move', ...ins, from: target, to: target, name: 'no' },
  show: { type: 'move', ...ins, from: target, to: target, name: 'no' },

  // fade
  fadeIn: { type: 'show', ...ins },
  fadeOut: { type: 'show', ...outs },

  // move normal
  moveInLeft: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetLeft, to: target, ease: 'quadOut' },
  ],
  moveOutLeft: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetLeft, ease: 'quadIn' },
  ],
  moveInRight: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetRight, to: target, ease: 'quadOut' },
  ],
  moveOutRight: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetRight, ease: 'quadIn' },
  ],
  moveInUp: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetUp, to: target, ease: 'quadOut' },
  ],
  moveOutUp: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetUp, ease: 'quadIn' },
  ],
  moveInBottom: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetBottom, to: target, ease: 'quadOut' },
  ],
  moveOutBottom: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetBottom, ease: 'quadIn' },
  ],

  // move big
  moveInLeftBig: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetLeftBig, to: target, ease: 'quadOut' },
  ],
  moveOutLeftBig: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetLeftBig, ease: 'quadIn' },
  ],
  moveInRightBig: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetRightBig, to: target, ease: 'quadOut' },
  ],
  moveOutRightBig: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetRightBig, ease: 'quadIn' },
  ],
  moveInUpBig: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetUpBig, to: target, ease: 'quadOut' },
  ],
  moveOutUpBig: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetUpBig, ease: 'quadIn' },
  ],
  moveInBottomBig: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetBottomBig, to: target, ease: 'quadOut' },
  ],
  moveOutBottomBig: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetBottomBig, ease: 'quadIn' },
  ],

  // move ease back
  moveInLeftBack: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetLeftBig, to: target, ease: 'backOut' },
  ],
  moveOutLeftBack: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetLeftBig, ease: 'backIn' },
  ],
  moveInRightBack: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetRightBig, to: target, ease: 'backOut' },
  ],
  moveOutRightBack: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetRightBig, ease: 'backIn' },
  ],
  moveInUpBack: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetUpBig, to: target, ease: 'backOut' },
  ],
  moveOutUpBack: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetUpBig, ease: 'backIn' },
  ],
  moveInBottomBack: [
    { type: 'show', ...ins },
    { type: 'move', ...ins, from: targetBottomBig, to: target, ease: 'backOut' },
  ],
  moveOutBottomBack: [
    { type: 'show', ...outs },
    { type: 'move', ...outs, from: target, to: targetBottomBig, ease: 'backIn' },
  ],

  // rotate in out
  rotateIn: [
    { type: 'show', ...ins },
    { type: 'rotate', ...ins, from: targetRotateAdd, to: targetRotate, ease: 'linear' },
  ],
  rotateOut: [
    { type: 'show', ...outs },
    { type: 'rotate', ...outs, from: targetRotate, to: targetRotateAdd, ease: 'quadIn' },
  ],
  rotateInBig: [
    { type: 'show', ...ins },
    { type: 'rotate', ...ins, from: targetRotateAddBig, to: targetRotate, ease: 'quadOut' },
  ],
  rotateOutBig: [
    { type: 'show', ...outs },
    { type: 'rotate', ...outs, from: targetRotate, to: targetRotateAddBig, ease: 'quadIn' },
  ],

  // zoom in out
  zoomIn: [
    { type: 'zoom', ...ins, from: 1 / 2, to: 1, size: targetSize, pad: true },
    { type: 'show', ...ins },
  ],
  zoomOut: [
    { type: 'zoom', ...outs, from: 2, to: 1, size: targetSize, pad: true },
    { type: 'show', ...outs },
  ],
  zoomNopadIn: [
    { type: 'zoom', ...ins, from: 1.5, to: 1, size: targetSize },
    { type: 'show', ...ins },
  ],
  zoomNopadOut: [
    { type: 'zoom', ...outs, from: 1, to: 1.5, size: targetSize },
    { type: 'show', ...outs },
  ],
  zoomInUp: [
    { type: 'zoom', ...ins, from: 1, to: 2, size: targetSize, pad: true },
    { type: 'move', ...ins, from: targetUp, to: target, ease: 'quadOut' },
    { type: 'show', ...ins },
  ],
  zoomOutUp: [
    { type: 'zoom', ...outs, from: 2, to: 1, size: targetSize, pad: true },
    { type: 'move', ...outs, from: target, to: targetUp },
    { type: 'show', ...outs },
  ],
  zoomInDown: [
    { type: 'zoom', ...ins, from: 1, to: 2, size: targetSize, pad: true },
    { type: 'move', ...ins, from: targetBottom, to: target, ease: 'quadOut' },
    { type: 'show', ...ins },
  ],
  zoomOutDown: [
    { type: 'zoom', ...outs, from: 2, to: 1, size: targetSize, pad: true },
    { type: 'move', ...outs, from: target, to: targetBottom },
    { type: 'show', ...outs },
  ],

  // background effect ing,,,
  zoomingIn: [{ type: 'zoom', ...ingins, from: 1, add: zoomingSpeed, size: targetSize }],
  zoomingOut: [{ type: 'zoom', ...ingins, from: 2, add: -zoomingSpeed, size: targetSize }],
  moveingLeft: [{ type: 'move', ...ingins, from: target, add: { x: -moveingSpeed, y: 0 } }],
  moveingRight: [{ type: 'move', ...ingins, from: target, add: { x: moveingSpeed, y: 0 } }],
  moveingUp: [{ type: 'move', ...ingins, from: target, add: { x: 0, y: -moveingSpeed } }],
  moveingBottom: [{ type: 'move', ...ingins, from: target, add: { x: 0, y: moveingSpeed } }],
  fadingIn: { type: 'show', ...ingins },
  fadingOut: { type: 'show', ...ingouts },
};

// Map pronouns to numeric values
Effects.mapping = (key, obj) => {
  let val = null;
  const minDis = 100;
  const maxDis = 400;

  switch (key) {
    case target:
      val = { x: obj.x, y: obj.y };
      break;

    // up / down/ left/ right
    case targetLeft:
      val = { x: obj.x - minDis, y: obj.y };
      break;
    case targetRight:
      val = { x: obj.x + minDis, y: obj.y };
      break;
    case targetUp:
      val = { x: obj.x, y: obj.y - minDis };
      break;
    case targetBottom:
      val = { x: obj.x, y: obj.y + minDis };
      break;

    // big up / down/ left/ right
    case targetLeftBig:
      val = { x: obj.x - maxDis, y: obj.y };
      break;
    case targetRightBig:
      val = { x: obj.x + maxDis, y: obj.y };
      break;
    case targetUpBig:
      val = { x: obj.x, y: obj.y - maxDis };
      break;
    case targetBottomBig:
      val = { x: obj.x, y: obj.y + maxDis };
      break;

    // rotate
    case targetRotate:
      val = obj.rotate;
      break;
    case targetRotateAdd:
      val = obj.rotate + 60;
      break;
    case targetRotateAddBig:
      val = obj.rotate + 180;
      break;

    // zoom
    case zoomBig:
      val = 1.5;
      break;
    case zoomBiging:
      val = 2;
      break;
    case targetSize:
      val = obj.getSize();
      break;
  }

  return val;
};

module.exports = Effects;
