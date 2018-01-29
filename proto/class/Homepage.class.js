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
   * @summary Hero section display.
   * @returns {string} HTML output
   */
  hero() {
    let frag = Homepage.NAMED_TEMPLATES.hero.cloneNode(true)
    frag.querySelector('.c-Hero').style.setProperty('background-image', `url('${this._DATA.hero.image}')`)
    frag.querySelector('.c-Hero__Cap').textContent = this._DATA.hero.caption
    frag.querySelector('.c-Hero__Cta').href        = this._DATA.hero.cta.url
    frag.querySelector('.c-Hero__Cta').textContent = this._DATA.hero.cta.text

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Featured Statistic display.
   * @returns {string} HTML output
   */
  weRepresentStat(stat) {
    let frag = Homepage.NAMED_TEMPLATES.xStat.cloneNode(true)
    frag.querySelector('.c-Stat__Icon'      ).className   = frag.querySelector('.c-Stat__Icon').className.replace('{{ icon }}', stat.icon)
    frag.querySelector('.c-Stat__Num'       ).textContent = stat.number.toLocaleString('en')
    frag.querySelector('.c-Stat__Text'      ).textContent = stat.text
    frag.querySelector('.c-Stat__Cta'       ).href        = stat.ctaurl
    frag.querySelector('.c-Stat__Cta > span').textContent = stat.ctatext
    frag.querySelector('.c-Stat__Cta'       ).parentNode.setAttribute('itemtype', `http://schema.org/${stat.type || 'Action'}`)

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Timely Promotions section display.
   * @returns {string} HTML output
   */
  timelyPromos() {
    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(...this._DATA.promotions.map(function (promo) {
      let frag = Homepage.NAMED_TEMPLATES.timelyPromos.cloneNode(true)
      frag.querySelector('.c-Promotion').style.setProperty('background-image', `url('${promo.image}')`)
      frag.querySelector('.c-Promotion__Hn'  ).textContent = promo.title
      frag.querySelector('.c-Promotion__Cta' ).href        = promo.cta.url
      frag.querySelector('.c-Promotion__Cta' ).textContent = promo.cta.text
      frag.querySelector('.c-Promotion__Text').textContent = promo.caption
      return frag
    }))
    return returned.innerHTML
  }
}

/**
 * @summary A set of templates marking up data types.
 * @const {Object<DocumentFragment>}
 */
Homepage.NAMED_TEMPLATES = {
  /**
   * @summary Template for Hero section.
   * @const {DocumentFragment}
   */
  hero: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/hero.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for We Represent section.
   * @const {DocumentFragment}
   */
  xStat: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../template/x-stat.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for We Represent section.
   * @const {DocumentFragment}
   */
  timelyPromos: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/timely-promos.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,
}

module.exports = Homepage
