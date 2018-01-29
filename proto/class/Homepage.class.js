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
    frag.querySelector('.c-Hero').style.setProperty('background-image', `url('${this._DATA.hero.image}')`)
    frag.querySelector('.c-Hero__Cap').textContent = this._DATA.hero.caption
    frag.querySelector('.c-Hero__Cta').href        = this._DATA.hero.cta.url
    frag.querySelector('.c-Hero__Cta').textContent = this._DATA.hero.cta.text

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
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
  hero: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/hero.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,
}

module.exports = Homepage
