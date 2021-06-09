/**
 * AniFilter - FFCreatorLite animation filter class
 *
 * @class
 */
class AniFilter {
  constructor({ name, filter, showType, type, data }) {
    this.name = name;
    this.filter = filter;
    this.type = type;
    this.data = data;
    this.showType = showType;
  }
}

module.exports = AniFilter;
