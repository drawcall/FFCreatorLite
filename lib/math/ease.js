'use strict';

/**
 * Ease
 *
 * ####Note:
 *
 *     The source of these formulas is
 *     https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
 *     Limited to CPU computing power, there is no more ease function.
 *
 *     Arguments
 *     t,b,c,d,e - time, start, change(end-start), totalTime, delay
 *
 * @object
 */

const Ease = {
  getVal(type, b, c, d, e) {
    if (this[type]) return this[type](b, c, d, e);
    else return this.linear(b, c, d, e);
  },

  linear(b, c, d, e) {
    const x = `(t-${e})/${d}`;
    return `${b}+${c}*${x}`;
  },

  quadIn(b, c, d, e) {
    // c*(t/=d)*t + b;
    const x = `(t-${e})/${d}`;
    const xx = `pow(${x},2)`;
    return `${b}+${c}*${xx}`;
  },

  quadOut(b, c, d, e) {
    const c2 = 2 * c;
    const x = `(t-${e})/${d}`;
    const xx = `pow(${x},2)`;
    // -c*x^2 + 2*x*c + b
    return `${b}+${c2}*${x}-${c}*${xx}`;
  },

  backIn(b, c, d, e) {
    // c*(t/=d)*t*((s+1)*t - s) + b;
    const s = 1.7016;
    const cs = c * s;
    const cs1 = c * (s + 1);
    const x = `(t-${e})/${d}`;
    const xx = `pow(${x},2)`;
    const xxx = `pow(${x},3)`;
    return `${cs1}*${xxx}-${cs}*${xx}+${b}`;
  },

  backOut(b, c, d, e) {
    // c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    const s = 1.7016;
    const cs = c * s;
    const cs1 = c * (s + 1);
    const x = `(t-${e})/${d}-1`;
    const xx = `pow(${x},2)`;
    const xxx = `pow(${x},3)`;
    return `${cs1}*${xxx}+${cs}*${xx}+${b}+${c}`;
  },
};

module.exports = Ease;
