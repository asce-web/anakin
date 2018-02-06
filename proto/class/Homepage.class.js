const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')

const xjs = {
  Date: require('extrajs').Date,
  DocumentFragment: require('extrajs-dom').DocumentFragment,
}

const xStatRender = require('../tpl/x-stat.tpl.js')
const xPortalRender = require('../tpl/x-portal.tpl.js')
const xPubRender = require('../tpl/x-pub.tpl.js')
const xHomeActionRender = require('../tpl/x-homeaction.tpl.js')
const xHeroRender = require('../tpl/x-hero.tpl.js')
const xPromoRender = require('../tpl/x-promo.tpl.js')
const xJobRender = require('../tpl/x-job.tpl.js')
const xArticleRender = require('../tpl/x-article.tpl.js')

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


  xStat(stat) {
    let frag = xStatRender(Homepage.NAMED_TEMPLATES.xStat.cloneNode(true), stat)
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xPortal(port) {
    let frag = xPortalRender(Homepage.NAMED_TEMPLATES.xPortal.cloneNode(true), {
      fixed: port,
      fluid: this._DATA['portals'][port.id],
    })
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xPub(pub) {
    let frag = xPubRender(Homepage.NAMED_TEMPLATES.xPub.cloneNode(true), {
      fixed: pub,
      fluid: this._DATA['publication-highlights'][pub.id],
    })
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xHomeAction(act) {
    let frag = xHomeActionRender(Homepage.NAMED_TEMPLATES.xHomeAction.cloneNode(true), {
      fixed: act,
      fluid: this._DATA['learn-contribute'][act.id],
    })
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xHero(hero) {
    let frag = xHeroRender(Homepage.NAMED_TEMPLATES.xHero.cloneNode(true), hero)
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xPromo(promo) {
    let frag = xPromoRender(Homepage.NAMED_TEMPLATES.xPromo.cloneNode(true), promo)
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xJob(job) {
    let frag = xJobRender(Homepage.NAMED_TEMPLATES.xJob.cloneNode(true), job)
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  xArticle(article) {
    let frag = xArticleRender(Homepage.NAMED_TEMPLATES.xArticle.cloneNode(true), article)
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Member Story display.
   * @param   {!Object} member the member data to display
   * @param   {string} member.name the name of the member (as a string)
   * @param   {string} member.grade type of member, title, or subheading
   * @param   {string} member.image url to a headshot photo
   * @param   {string} member.quote quote by the member
   * @returns {string} HTML output
   */
  xMember(member) {
    let frag = Homepage.NAMED_TEMPLATES.xMember.cloneNode(true)
    frag.querySelector('[itemprop="image"]'      ).src         = member.image
    frag.querySelector('[itemprop="name"]'       ).textContent = member.name
    frag.querySelector('[itemprop="description"]').textContent = member.grade
    frag.querySelector('blockquote'              ).textContent = member.quote
    return new xjs.DocumentFragment(frag).innerHTML()
  }



  /**
   * @summary Compile HTML markup from a template file.
   * @description This method takes an entire HTML template file and compiles the static output.
   * @returns {string} compiled HTML output
   */
  compile() {
    const document = Homepage.NAMED_TEMPLATES.homeDocument
    /**
     * @summary Populate a list with a rendering function.
     * @description The list must have a `<template>` element child.
     * @param   {string} listselector the querySelector of the list to fill
     * @param   {Array} data any array of data to fill the list with
     * @param   {function(*):string} renderer a function returning a datum’s HTML output
     */
    function populateList(listselector, data, renderer) {
      let container = document.querySelector(listselector)
      let template = container.querySelector('template').content
      data.forEach(function (item) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = renderer.call(this, item)
        /*
        TODO
        frag.querySelector('li').append(renderer.call(null, item))
        where `renderer` returns a DocumentFragment
         */
        container.append(frag)
      }, this)
    }

    // ++++ HARD-CODED DATA ++++ //
    populateList.call(this, '#we-represent           > ul', Homepage.DATA.stats  , this.xStat  )
    populateList.call(this, '#portals                > ol', Homepage.DATA.portals, this.xPortal)
    populateList.call(this, '#publication-highlights > ul', Homepage.DATA.pubs, this.xPub)
    populateList.call(this, '#learn-contribute       > ul', Homepage.DATA.acts, this.xHomeAction)
    /*
    ;(function () {
      let container = document.querySelector('#we-represent > ul')
      let template = container.querySelector('template').content
      Homepage.DATA.stats.forEach(function (stat) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xStat(stat)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#portals > ol')
      let template = container.querySelector('template').content
      Homepage.DATA.portals.forEach(function (port) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xPortal(port)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#publication-highlights > ul')
      let template = container.querySelector('template').content
      Homepage.DATA.pubs.forEach(function (pub) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xPub(pub)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#learn-contribute > ul')
      let template = container.querySelector('template').content
      Homepage.DATA.acts.forEach(function (act) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xHomeAction(act)
        container.append(frag)
      }, this)
    }).call(this)
     */

    // ++++ USER-INPUT DATA ++++ //
    populateList.call(this, '#promotions             > ul', this._DATA['promotions'            ], this.xPromo     )
    populateList.call(this, '#jobs                   > ul', this._DATA['jobs'                  ], this.xJob       )
    populateList.call(this, '#whats-happening        > ul', this._DATA['whats-happening'       ], this.xArticle   )
    populateList.call(this, '#member-stories         > ul', this._DATA['member-stories'        ], this.xMember    )
    /*
    ;(function () {
      let container = document.querySelector('#promotions > ul')
      let template = container.querySelector('template').content
      this._DATA['promotions'].forEach(function (promo) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xPromo(promo)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#jobs > ul')
      let template = container.querySelector('template').content
      this._DATA['jobs'].forEach(function (job) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xJob(job)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#whats-happening > ul')
      let template = container.querySelector('template').content
      this._DATA['whats-happening'].forEach(function (article) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xArticle(article)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#member-stories > ul')
      let template = container.querySelector('template').content
      this._DATA['member-stories'].forEach(function (member) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xMember(member)
        container.append(frag)
      }, this)
    }).call(this)
     */

    // ++++ DATA WITH NO PATTERNS ++++ //
    document.querySelector('main > header').innerHTML = this.xHero(this._DATA['hero']) // TODO use .append() with a DocumentFragment
    ;(function (data) {
      let foundation = document.querySelector('#asce-foundation')
      foundation.querySelector('[itemprop="description"]').textContent = data.caption
      foundation.querySelector('[itemprop="potentialAction"] [itemprop="url"]' ).href        = data.cta.url
      foundation.querySelector('[itemprop="potentialAction"] [itemprop="name"]').textContent = data.cta.text
    })(this._DATA['asce-foundation'])

    return `<!doctype html>` + document.documentElement.outerHTML
  }
}




/**
 * @summary A set of templates marking up data types.
 * @const {Object<DocumentFragment>}
 */
Homepage.NAMED_TEMPLATES = {
  /**
   * @summary Main Template for whole page.
   * @const {Document}
   */
  homeDocument: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/home.tpl.html'), 'utf8'))
    .window.document,

  /**
   * @summary Template for Featured Statistic.
   * @const {DocumentFragment}
   */
  xStat: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-stat.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Portal.
   * @const {DocumentFragment}
   */
  xPortal: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-portal.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Featured Publication.
   * @const {DocumentFragment}
   */
  xPub: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-pub.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Home Action.
   * @const {DocumentFragment}
   */
  xHomeAction: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-homeaction.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Hero section.
   * @const {DocumentFragment}
   */
  xHero: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-hero.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Timely Promo.
   * @const {DocumentFragment}
   */
  xPromo: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-promo.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Job Listing.
   * @const {DocumentFragment}
   */
  xJob: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-job.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Article Teaser.
   * @const {DocumentFragment}
   */
  xArticle: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-article.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Member Story.
   * @const {DocumentFragment}
   */
  xMember: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-member.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,
}




/**
 * @summary Static (hard-coded) data for the markup.
 * @description This is *not* the user-input data, which is passed to the constructor.
 * @const {!Object}
 */
Homepage.DATA = require('../static-data.json')

module.exports = Homepage
