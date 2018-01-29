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
   * @param   {{icon:string, number:number, text:string, type:string, ctatext:string, ctaurl:string}} stat the statistic to display
   * @returns {string} HTML output
   */
  xStat(stat) {
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

  /**
   * @summary Portal display.
   * @param   {{name:string, icon:string, url:string, data:string}} port the portal data to display
   * @param   {string} port.name the heading
   * @param   {string} port.icon the subclass of Glyphicon
   * @param   {string} port.url  the url the heading is linked to
   * @param   {string} port.data the identifier property of `portal` in the database (pointing to an array)
   * @returns {string} HTML output
   */
  xPortal(port) {
    let frag = Homepage.NAMED_TEMPLATES.xPortal.cloneNode(true)
    frag.querySelector('h1 > a').href = port.url
    frag.querySelector('.c-Portal__Icon').className = frag.querySelector('.c-Portal__Icon').className.replace('{{ icon }}', port.icon)
    frag.querySelector('.c-Portal__Hn'  ).textContent = port.name
    this._DATA.portal[port.data].forEach(function (link) {
      let innerfrag = frag.querySelector('.c-Portal__List > template').content.cloneNode(true)
      innerfrag.querySelector('.c-Portal__Link').href        = link.url
      innerfrag.querySelector('.c-Portal__Link').textContent = link.text
      frag.querySelector('.c-Portal__List').append(innerfrag)
    })

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Featured Publication display.
   * @param   {!Objecxt} pub the publication data to display
   * @param   {string} pub.id the ID
   * @param   {string} pub.name the heading
   * @param   {string} pub.caption the caption
   * @returns {string} HTML output
   */
  xPub(pub) {
    let frag = Homepage.NAMED_TEMPLATES.xPub.cloneNode(true)
    frag.querySelector('.c-Pub').id = pub.id
    frag.querySelector('.c-Pub__Hn > cite').textContent = pub.name
    frag.querySelector('.c-Pub__Cap' ).innerHTML = pub.caption
    frag.querySelector('.c-Pub__Img' ).src       = this._DATA[pub.id]image
    frag.querySelector('.c-Pub__Body').innerHTML = (typeof this._DATA[pub.id].body === 'string') ? pub.body : pub.body.join('')
    this._DATA[pub.id].links.forEach(function (link) {
      let innerfrag = frag.querySelector('.c-Pub__List > template').content.cloneNode(true)
      innerfrag.querySelector('.c-Pub__Link'       ).href        = link.url
      innerfrag.querySelector('.c-Pub__Link > span').textContent = link.text
      frag.querySelector('.c-c-Pub__List').append(innerfrag)
    })

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
   * @summary Template for Hero section.
   * @const {DocumentFragment}
   */
  hero: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/hero.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Featured Statistic.
   * @const {DocumentFragment}
   */
  xStat: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../template/x-stat.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Promotions section.
   * @const {DocumentFragment}
   */
  timelyPromos: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/timely-promos.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Portal.
   * @const {DocumentFragment}
   */
  xPortal: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../template/x-portal.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Portal.
   * @const {DocumentFragment}
   */
  xPub: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../template/x-pub.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,
}

module.exports = Homepage
