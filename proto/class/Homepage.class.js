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
     * @param   {string} arg.listselector the querySelector of the list to fill
     * @param   {Array} arg.datalist any array of data to fill the list with
     * @param   {!Object} arg.component component builder; see {@link Homepage.COMPONENT} for details
     * @param   {DocumentFragment} arg.component.template
     * @param   {function(DocumentFragment,*):DocumentFragment} arg.component.renderer
     */
    function populateList({listselector, datalist, component}) {
      let container = document.querySelector(listselector)
      container.append(...datalist.map((datum) => (function (frag, data) {
        // empty the list item, then append rendered component
        new xjs.HTMLLIElement(frag.querySelector('li')).empty().node
          .append(component.renderer(component.template.cloneNode(true), data))
        return frag
      })(container.querySelector('template').content.cloneNode(true), datum)))
    }

    // ++++ HARD-CODED DATA ++++ //
    populateList({ listselector: '#we-represent           > ul', datalist: Homepage.DATA.stats                                                                                , component: Homepage.COMPONENT.xStat       })
    populateList({ listselector: '#portals                > ol', datalist: Homepage.DATA.portals.map((d) => ({ fixed: d, fluid: this._DATA['portals'               ][d.id] })), component: Homepage.COMPONENT.xPortal     })
    populateList({ listselector: '#publication-highlights > ul', datalist: Homepage.DATA.pubs   .map((d) => ({ fixed: d, fluid: this._DATA['publication-highlights'][d.id] })), component: Homepage.COMPONENT.xPub        })
    populateList({ listselector: '#learn-contribute       > ul', datalist: Homepage.DATA.acts   .map((d) => ({ fixed: d, fluid: this._DATA['learn-contribute'      ][d.id] })), component: Homepage.COMPONENT.xHomeAction })

    // ++++ USER-INPUT DATA ++++ //
    populateList({ listselector: '#promotions             > ul', datalist: this._DATA['promotions'     ]                                                                      , component: Homepage.COMPONENT.xPromo      })
    populateList({ listselector: '#jobs                   > ul', datalist: this._DATA['jobs'           ]                                                                      , component: Homepage.COMPONENT.xJob        })
    populateList({ listselector: '#whats-happening        > ul', datalist: this._DATA['whats-happening']                                                                      , component: Homepage.COMPONENT.xArticle    })
    populateList({ listselector: '#member-stories         > ul', datalist: this._DATA['member-stories' ]                                                                      , component: Homepage.COMPONENT.xMember     })

    // ++++ DATA WITH NO PATTERNS ++++ //
    ;(function () {
      let container = document.querySelector('main > header')
      new xjs.HTMLElement(container).empty()
      container.append(Homepage.COMPONENT.xHero.renderer(Homepage.COMPONENT.xHero.template.cloneNode(true), this._DATA['hero']))
    }).call(this)

    ;(function () {
      let container = document.querySelector('#asce-foundation')
      container.append((function renderer(frag, data) {
        frag.querySelector('[itemprop="description"]').textContent                       = data.caption
        frag.querySelector('[itemprop="potentialAction"] [itemprop="url"]' ).href        = data.cta.url
        frag.querySelector('[itemprop="potentialAction"] [itemprop="name"]').textContent = data.cta.text
        return frag
      })(container.querySelector('template').content.cloneNode(true), this._DATA['asce-foundation']))
    }).call(this)

    return dom.serialize()
  }
}




/**
 * @summary A set of component builders. Each has a template and a renderer.
 * @const {!Object<{template:DocumentFragment, renderer:(function(DocumentFragment,*):DocumentFragment)}>}
 */
Homepage.COMPONENT = {
  xStat      : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-stat.tpl.html'      ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-stat.tpl.js'      ) },
  xPortal    : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-portal.tpl.html'    ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-portal.tpl.js'    ) },
  xPub       : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-pub.tpl.html'       ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-pub.tpl.js'       ) },
  xHomeAction: { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-homeaction.tpl.html'), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-homeaction.tpl.js') },
  xPromo     : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-promo.tpl.html'     ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-promo.tpl.js'     ) },
  xJob       : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-job.tpl.html'       ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-job.tpl.js'       ) },
  xArticle   : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-article.tpl.html'   ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-article.tpl.js'   ) },
  xMember    : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-member.tpl.html'    ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-member.tpl.js'    ) },
  xHero      : { template: jsdom.JSDOM.fragment(fs.readFileSync(path.join(__dirname, '../tpl/x-hero.tpl.html'      ), 'utf8')).querySelector('template').content,  renderer: require('../tpl/x-hero.tpl.js'      ) },
}




/**
 * @summary Static (hard-coded) data for the markup.
 * @description This is *not* the user-input data, which is passed to the constructor.
 * @const {!Object}
 */
Homepage.DATA = require('../static-data.json')

module.exports = Homepage
