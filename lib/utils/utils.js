'use strict';

/**
 * Utils - Utility function collection
 *
 * ####Example:
 *
 *     const effect = Utils.mergeExclude(effect, conf, ["type"]);
 *     const id = Utils.genId(this.type);
 *
 * @object
 */

const forEach = require('lodash/forEach');
const cache = {};

const Utils = {
  /**
   * Generate auto-increment id based on type
   * @param {string} type - type
   * @return {string} id xxxx_10
   * @public
   */
  genId(type) {
    if (!cache[type]) cache[type] = 1;
    return type + String(cache[type]++);
  },

  /**
   * Generate 24-bit random number
   * @return {string} uid adsfUsdfn2
   * @public
   */
  uid() {
    return (
      Math.random()
        .toString(36)
        .substr(-8) +
      Math.random()
        .toString(36)
        .substr(-8)
    );
  },

  /**
   * Delete an element of the array
   * @param {array} arr - target array
   * @param {any} elem - an element
   * @return {array} Original array
   * @public
   */
  deleteArrayElement(arr, elem) {
    const index = arr.indexOf(elem);
    if (index > -1) arr.splice(index, 1);
    return arr;
  },

  /**
   * Swap two elements of an array
   * @param {array} arr - target array
   * @param {any} elem1 - an element
   * @param {any} elem1 - other element
   * @return {array} Original array
   * @public
   */
  swapArrayElement(arr, elem1, elem2) {
    const index1 = typeof elem1 === 'number' ? elem1 : arr.indexOf(elem1);
    const index2 = typeof elem2 === 'number' ? elem2 : arr.indexOf(elem2);
    const temp = arr[index1];

    arr[index1] = arr[index2];
    arr[index2] = temp;
    return arr;
  },

  /**
   * Sort the array according to a certain key
   * @public
   */
  sortArrayByKey(arr, key, val) {
    const carr = [];
    forEach(arr, elem => {
      if (elem[key] === val) {
        carr.unshift(elem);
      } else {
        carr.push(elem);
      }
    });
    return carr;
  },

  /**
   * Remove undefined empty elements
   * @param {object} obj - target object
   * @return {object} target object
   * @public
   */
  deleteUndefined(obj) {
    for (let key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  },

  floor(n, s = 2) {
    const k = Math.pow(10, s);
    return Math.floor(n * k) / k;
  },

  floorObject(obj, s = 2) {
    for (let key in obj) {
      Utils.floor(obj[key], s);
    }
    return obj;
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Destroy the elements in object
   * @param {object} obj - target object
   * @public
   */
  destroyObj(obj) {
    if (typeof obj !== 'object') return;
    for (let key in obj) {
      delete obj[key];
    }
  },

  angleToRadian(angle, s = 4) {
    return this.floor((angle / 180) * Math.PI, s);
  },

  angleToPI(angle, s = 4) {
    const pi = this.angleToRadian(angle, s);
    return `${pi}*PI`;
  },

  replacePlusMinus(str) {
    return str
      .replace(/\+\-/gi, '-')
      .replace(/\-\+/gi, '-')
      .replace(/\-\-/gi, '+')
      .replace(/\+\+/gi, '+')
      .replace(/\(t\-0\)/gi, 't')
      .replace(/\(on\-0\)/gi, 'on');
  },

  /**
   * Fix wrong file directory path // -> /
   * @param {string} path - file directory path
   * @public
   */
  fixFolderPath(path) {
    return path.replace(/\/\//gi, '/');
  },

  explan(json) {
    try {
      return JSON.stringify(json);
    } catch (e) {
      return json.error;
    }
  },

  excludeBind(obj1, obj2 = {}, exclude = []) {
    for (let key in obj2) {
      if (exclude.indexOf(key) < 0 && obj2[key] !== undefined) obj1[key] = obj2[key];
    }
  },

  clone(obj) {
    return Object.assign({}, obj);
  },
};

module.exports = Utils;
