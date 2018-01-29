const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')

/**
 * ASCE Homepage.
 */
class Homepage {
  /**
   * @summary Construct a new Homepage object.
   * @param {!Object=} jsondata a JSON object containing the data
   */
  constructor(jsondata) {
    /**
     * Raw JSON data for this object.
     * @type {!Object}
     */
    this._DATA = jsondata
  }

  /**
   * @summary Hero display.
   * @returns {string} HTML output
   */
  hero() {
    let frag = Homepage.NAMED_TEMPLATES.hero
    return '<b>hello</b> <em>world</em>'
  }
}

/**
 * @summary A set of templates marking up data types.
 * @const {Object<DocumentFragment>}
 */
Homepage.NAMED_TEMPLATES = {
  /**
   * @summary Template for hero section.
   * @const {DocumentFragment}
   */
  hero: {},
}

module.exports = Homepage
