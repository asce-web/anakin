const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')
const xjs = {
  Date: require('extrajs').Date,
  ...require('extrajs-dom'),
}

const xStat       = require('../tpl/x-stat.tpl.js')
const xPortal     = require('../tpl/x-portal.tpl.js')
const xPub        = require('../tpl/x-pub.tpl.js')
const xHomeAction = require('../tpl/x-homeaction.tpl.js')
const xPromo      = require('../tpl/x-promo.tpl.js')
const xJob        = require('../tpl/x-job.tpl.js')
const xArticle    = require('../tpl/x-article.tpl.js')
const xMember     = require('../tpl/x-member.tpl.js')
const xHero       = require('../tpl/x-hero.tpl.js')


/**
 * ASCE Homepage.
 */
class Homepage {
  /**
   * @summary Construct a new Homepage object.
   * @param {!Object=} jsondata a JSON object containing the site instance data
   */
  constructor(jsondata) {
    /**
     * Raw JSON data for this object.
     * @type {!Object}
     */
    this._DATA = jsondata
  }


  /**
   * @summary Compile HTML markup from a template file.
   * @description This method takes an entire HTML template file and compiles the static output.
   * @returns {string} compiled HTML output
   */
  compile() {
    const dom = new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/home.tpl.html'), 'utf8'))
    const document = dom.window.document

    /**
     * @summary Populate a list with a rendering function.
     * @description The list must have a `<template>` element child.
     * @private
     * @param   {!Object} arg the object argument
     * @param   {HTMLElement} arg.container the list to fill
     * @param   {Array} arg.datalist any array of data to fill the list with
     * @param   {xjs.HTMLTemplateElement} arg.component component builder for each item in the list
     */
    function populateList({container, datalist, component}) {
      let Wrapper = xjs[container.constructor.name] // NOTE-WARNING: the `name` property of a function is not reliable! It could fail after agressive minification (wherein functions names could change).
      if (!Wrapper) throw new ReferenceError(`No constructor \`xjs.${container.constructor.name}\` found.`)

      // Use the following code if `Function#constructor.name` fails.
      // let Wrapper;
      // let matches = {
      //   'ol'   : xjs.HTMLOListElement,
      //   'ul'   : xjs.HTMLUListElement,
      //   'thead': xjs.HTMLTableSectionElement,
      //   'tfoot': xjs.HTMLTableSectionElement,
      //   'tbody': xjs.HTMLTableSectionElement,
      //   'tr'   : xjs.HTMLTableRowElement,
      // }
      // for (let tag in matches) { Wrapper = (container.matches(tag)) ? matches[tag] : Wrapper }

      new Wrapper(container).populate(datalist, function (frag, data) {
        new xjs.HTMLLIElement(frag.querySelector('li')).empty().append(component.render(data))
      })
    }

    // ++++ HARD-CODED DATA ++++ //
    populateList({ container: document.querySelector('#we-represent           .o-List'), datalist: Homepage.DATA.stats                                                                                , component: xStat       })
    populateList({ container: document.querySelector('#portals                .o-List'), datalist: Homepage.DATA.portals.map((d) => ({ fixed: d, fluid: this._DATA['portals'               ][d.id] })), component: xPortal     })
    populateList({ container: document.querySelector('#publication-highlights .o-List'), datalist: Homepage.DATA.pubs   .map((d) => ({ fixed: d, fluid: this._DATA['publication-highlights'][d.id] })), component: xPub        })
    populateList({ container: document.querySelector('#learn-contribute       .o-List'), datalist: Homepage.DATA.acts   .map((d) => ({ fixed: d, fluid: this._DATA['learn-contribute'      ][d.id] })), component: xHomeAction })

    // ++++ USER-INPUT DATA ++++ //
    populateList({ container: document.querySelector('#jobs                   .o-List'), datalist: this._DATA['jobs'           ]                                                                      , component: xJob        })
    populateList({ container: document.querySelector('#news                   .o-List'), datalist: this._DATA['news'           ]                                                                      , component: xArticle    })
    populateList({ container: document.querySelector('#member-stories         .o-List'), datalist: this._DATA['member-stories' ]                                                                      , component: xMember     })

    // ++++ DATA WITH NO PATTERNS ++++ //
    new xjs.HTMLElement(document.querySelector('slot[name="hero"]')).empty()
      .append(xHero.render(this._DATA['hero']))

    ;(function () {
      let container = document.querySelector('#promotions [role="tablist"]')
      let temp = jsdom.JSDOM.fragment('')
      const xPromoTab = new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (frag, data) {
        frag.querySelector('[role="tab"]').setAttribute('aria-label', data.title)
        frag.querySelector('[role="tab"]').nextSibling.remove() // remove the following Text node (“twig”)
        frag.querySelector('[role="tabpanel"]').id = `promotions-panel${this._DATA['promotions'].indexOf(data)}`
        frag.querySelector('[role="tabpanel"]').append(xPromo.render(data))
      })
      temp.append(...this._DATA['promotions'].map((datum) => xPromoTab.render(datum, this)))
      container.insertBefore(temp, container.querySelector('button[value="next"]'))
    }).call(this)

    ;(function () {
      let container = document.querySelector('#asce-foundation')
      const xFoundation = new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (frag, data) {
        frag.querySelector('[itemprop="description"]').textContent                       = data.caption
        frag.querySelector('[itemprop="potentialAction"] [itemprop="url"]' ).href        = data.cta.url
        frag.querySelector('[itemprop="potentialAction"] [itemprop="name"]').textContent = data.cta.text
      })
      container.append(xFoundation.render(this._DATA['asce-foundation']))
    }).call(this)

    return dom.serialize()
  }
}



/**
 * @summary Static (hard-coded) data for the markup.
 * @description This is *not* the user-input data, which is passed to the constructor.
 * @const {!Object}
 */
Homepage.DATA = require('../static-data.json')

module.exports = Homepage
