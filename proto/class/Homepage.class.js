const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')
const xjs = {
  Date: require('extrajs').Date,
  ...require('extrajs-dom'),
}


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
      container.append(...datalist.map((datum) =>
        new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (frag, data) {
          new xjs.HTMLLIElement(frag.querySelector('li')).empty().node
            .append(component.render(data))
        }).render(datum)
      ))
    }

    // ++++ HARD-CODED DATA ++++ //
    populateList({ container: document.querySelector('#we-represent           .o-List'), datalist: Homepage.DATA.stats                                                                                , component: Homepage.TEMPLATES.xStat       })
    populateList({ container: document.querySelector('#portals                .o-List'), datalist: Homepage.DATA.portals.map((d) => ({ fixed: d, fluid: this._DATA['portals'               ][d.id] })), component: Homepage.TEMPLATES.xPortal     })
    populateList({ container: document.querySelector('#publication-highlights .o-List'), datalist: Homepage.DATA.pubs   .map((d) => ({ fixed: d, fluid: this._DATA['publication-highlights'][d.id] })), component: Homepage.TEMPLATES.xPub        })
    populateList({ container: document.querySelector('#learn-contribute       .o-List'), datalist: Homepage.DATA.acts   .map((d) => ({ fixed: d, fluid: this._DATA['learn-contribute'      ][d.id] })), component: Homepage.TEMPLATES.xHomeAction })

    // ++++ USER-INPUT DATA ++++ //
    populateList({ container: document.querySelector('#jobs                   .o-List'), datalist: this._DATA['jobs'           ]                                                                      , component: Homepage.TEMPLATES.xJob        })
    populateList({ container: document.querySelector('#whats-happening        .o-List'), datalist: this._DATA['whats-happening']                                                                      , component: Homepage.TEMPLATES.xArticle    })
    populateList({ container: document.querySelector('#member-stories         .o-List'), datalist: this._DATA['member-stories' ]                                                                      , component: Homepage.TEMPLATES.xMember     })

    // ++++ DATA WITH NO PATTERNS ++++ //
    ;(function () {
      let container = document.querySelector('main > header')
      new xjs.HTMLElement(container).empty()
      container.append(Homepage.TEMPLATES.xHero.render(this._DATA['hero']))
    }).call(this)

    ;(function () {
    }).call(this)

    ;(function () {
      let container = document.querySelector('#promotions [role="tablist"]')
      let temp = jsdom.JSDOM.fragment('')
      temp.append(...this._DATA['promotions'].map((datum, i) =>
        new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (frag, data) {
          frag.querySelector('[role="tab"]').setAttribute('aria-label', data.title)
          frag.querySelector('[role="tab"]').nextSibling.remove() // remove the following Text node (“twig”)
          frag.querySelector('[role="tabpanel"]').id = `promotions-panel${i}`
          frag.querySelector('[role="tabpanel"]').append(Homepage.TEMPLATES.xPromo.render(data))
        }).render(datum)
      ))
      container.insertBefore(temp, container.querySelector('button[value="next"]'))
    }).call(this)

    ;(function () {
      let container = document.querySelector('#asce-foundation')
      container.append(new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (frag, data) {
        frag.querySelector('[itemprop="description"]').textContent                       = data.caption
        frag.querySelector('[itemprop="potentialAction"] [itemprop="url"]' ).href        = data.cta.url
        frag.querySelector('[itemprop="potentialAction"] [itemprop="name"]').textContent = data.cta.text
      }).render(this._DATA['asce-foundation']))
    }).call(this)

    return dom.serialize()
  }
}




/**
 * @summary A set of component builders. Each has a template and a renderer.
 * @namespace
 */
Homepage.TEMPLATES = {
  xStat      : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-stat.tpl.html'      )).setRenderer(require('../tpl/x-stat.tpl.js'      )),
  xPortal    : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-portal.tpl.html'    )).setRenderer(require('../tpl/x-portal.tpl.js'    )),
  xPub       : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-pub.tpl.html'       )).setRenderer(require('../tpl/x-pub.tpl.js'       )),
  xHomeAction: xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-homeaction.tpl.html')).setRenderer(require('../tpl/x-homeaction.tpl.js')),
  xPromo     : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-promo.tpl.html'     )).setRenderer(require('../tpl/x-promo.tpl.js'     )),
  xJob       : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-job.tpl.html'       )).setRenderer(require('../tpl/x-job.tpl.js'       )),
  xArticle   : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-article.tpl.html'   )).setRenderer(require('../tpl/x-article.tpl.js'   )),
  xMember    : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-member.tpl.html'    )).setRenderer(require('../tpl/x-member.tpl.js'    )),
  xHero      : xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, '../tpl/x-hero.tpl.html'      )).setRenderer(require('../tpl/x-hero.tpl.js'      )),
}




/**
 * @summary Static (hard-coded) data for the markup.
 * @description This is *not* the user-input data, which is passed to the constructor.
 * @const {!Object}
 */
Homepage.DATA = require('../static-data.json')

module.exports = Homepage
