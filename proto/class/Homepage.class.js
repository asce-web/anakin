const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')

const xjs = {
  Date: require('extrajs').Date,
  DocumentFragment: require('extrajs-dom').DocumentFragment,
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
   * @summary Featured Statistic display.
   * @param   {!Object} stat the statistic to display
   * @param   {string} stat.icon the classname of the glyphicon
   * @param   {number} stat.number the featured numerical value
   * @param   {string} stat.text the featured textual value
   * @param   {{text:string, url:string}} stat.cta call-to-action
   * @returns {string} HTML output
   */
  xStat(stat) {
    let frag = Homepage.NAMED_TEMPLATES.xStat.cloneNode(true)
    frag.querySelector('.glyphicons').className = frag.querySelector('.glyphicons').className.replace('{{ icon }}', stat.icon)
    frag.querySelector('slot[name="stat-number"]').textContent = stat.number.toLocaleString('en')
    frag.querySelector('slot[name="stat-text"]'  ).textContent = stat.text
    let action = frag.querySelector('[itemprop="potentialAction"]')
    action.setAttribute('itemtype', `http://schema.org/${stat.type || 'Action'}`)
    action.querySelector('[itemprop="url"]' ).href        = stat.cta.url
    action.querySelector('[itemprop="name"]').textContent = stat.cta.text
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Portal display.
   * @param   {!Object} port the portal data to display
   * @param   {string} port.id the identifier property of `portal` in the database (pointing to an array)
   * @param   {string} port.name the heading
   * @param   {string} port.icon the subclass of Glyphicon
   * @param   {string} port.url  the url the heading is linked to
   * @returns {string} HTML output
   */
  xPortal(port) {
    let frag = Homepage.NAMED_TEMPLATES.xPortal.cloneNode(true)
    let orig = frag.querySelectorAll('.c-Portal')[0]
    orig.id = port.id
    orig.querySelector('[itemprop="url"]').href = port.url
    orig.querySelector('.glyphicons').className = frag.querySelector('.glyphicons').className.replace('{{ icon }}', port.icon)
    orig.querySelector('[itemprop="name"]').textContent = port.name
    let list = orig.querySelector('.c-Portal__List')
    this._DATA['portals'][port.id].forEach(function (link) {
      let innerfrag = list.querySelector('template').content.cloneNode(true)
      innerfrag.querySelector('[itemprop="significantLink"]').href        = link.url
      innerfrag.querySelector('[itemprop="significantLink"]').textContent = link.text
      list.append(innerfrag)
    })
    let dupe = frag.querySelectorAll('.c-Portal')[1]
    dupe.append(list.cloneNode(true))
    dupe.querySelector('.c-Portal__Head').append(...Array.from(orig.querySelector('.c-Portal__Head').childNodes).map((n) => n.cloneNode(true)))
    dupe.querySelector('.glyphicons').classList.remove('c-BigAssIcon', 'h-Block')

    return new xjs.DocumentFragment(frag).innerHTML()
  }


  /**
   * @summary Hero section display.
   * @param   {!Object} hero the hero image and contents
   * @param   {string} hero.image url to hero image
   * @param   {string} hero.caption text caption
   * @param   {{text:string, url:string}} hero.cta call-to-action
   * @returns {string} HTML output
   */
  xHero(hero) {
    let frag = Homepage.NAMED_TEMPLATES.xHero.cloneNode(true)
    frag.querySelector('.c-Hero').style.setProperty('background-image', `url('${hero.image}')`)
    frag.querySelector('slot[name="hero-caption"]').textContent = hero.caption
    frag.querySelector('a'                        ).href        = hero.cta.url
    frag.querySelector('a'                        ).textContent = hero.cta.text
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Timely Promo display.
   * @param   {!Object} promo the promotion to display
   * @param   {string} promo.title promo heading
   * @param   {string} promo.image url to promo image
   * @param   {string} promo.caption text caption
   * @param   {{text:string, url:string}} promo.cta call-to-action
   * @returns {string} HTML output
   */
  xPromo(promo) {
    let frag = Homepage.NAMED_TEMPLATES.xPromo.cloneNode(true)
    frag.querySelector('.c-Promotion').style.setProperty('background-image', `url('${promo.image}')`)
    frag.querySelector('.c-Promotion__Hn'  ).textContent = promo.title
    frag.querySelector('.c-Promotion__Text').textContent = promo.caption
    frag.querySelector('.c-Promotion__Cta' ).href        = promo.cta.url
    frag.querySelector('.c-Promotion__Cta' ).textContent = promo.cta.text
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Featured Publication display.
   * @param   {!Object} pub the publication data to display
   * @param   {string} pub.id the ID
   * @param   {string} pub.name the heading
   * @param   {string} pub.caption the caption
   * @param   {string} pub.image url to image
   * @param   {Array<{text:string, url:string}>} pub.links list of links
   * @param   {string} pub.body rich body text
   * @returns {string} HTML output
   */
  xPub(pub) {
    let frag = Homepage.NAMED_TEMPLATES.xPub.cloneNode(true)
    frag.querySelector('.c-Pub').id = pub.id
    frag.querySelector('[itemprop~="image"]'     ).src         = pub.image
    frag.querySelector('[itemprop="name"]'       ).textContent = pub.name
    frag.querySelector('[itemprop="description"]').textContent = pub.caption
    frag.querySelector('article'                 ).innerHTML   = pub.body
    pub.links.forEach(function (link) {
      let innerfrag = frag.querySelector('template').content.cloneNode(true)
      innerfrag.querySelector('[itemprop="url"]' ).href        = link.url
      innerfrag.querySelector('[itemprop="name"]').textContent = link.text
      frag.querySelector('template').parentNode.append(innerfrag)
    })
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Home Action display.
   * @param   {!Object} act the action data to display
   * @param   {string} act.id the ID
   * @param   {string} act.name the heading
   * @param   {string} act.caption the caption
   * @param   {string} act.image url to image
   * @param   {Array<{text:string, url:string}>} act.links list of links
   * @returns {string} HTML output
   */
  xHomeAction(act) {
    let frag = Homepage.NAMED_TEMPLATES.xHomeAction.cloneNode(true)
    frag.querySelector('.c-HomeAction').id = act.id
    frag.querySelector('.c-HomeAction__Head').style.setProperty('background-image', `url('${act.image}')`)
    frag.querySelector('.c-HomeAction__Hn'  ).textContent = act.name
    frag.querySelector('.c-HomeAction__Cap' ).textContent = act.caption
    act.links.forEach(function (link) {
      let innerfrag = frag.querySelector('template').content.cloneNode(true)
      innerfrag.querySelector('[itemprop="url"]' ).href        = link.url
      innerfrag.querySelector('[itemprop="name"]').textContent = link.text
      frag.querySelector('template').parentNode.append(innerfrag)
    })
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Job Listing display.
   * @param   {!Object} job the job data to display
   * @param   {string} job.title the job title
   * @param   {string} job.organization the hiring organization
   * @param   {string} job.location the location of the job (as text)
   * @param   {string} job.url the url to link to
   * @returns {string} HTML output
   */
  xJob(job) {
    let frag = Homepage.NAMED_TEMPLATES.xJob.cloneNode(true)
    frag.querySelector('[itemprop="url"]').href        = job.url
    frag.querySelector('[itemprop="url"]').textContent = job.title
    frag.querySelector('[itemprop="hiringOrganization"] > [itemprop="name"]').textContent = job.organization
    frag.querySelector('[itemprop="jobLocation"]        > [itemprop="name"]').textContent = job.location
    return new xjs.DocumentFragment(frag).innerHTML()
  }

  /**
   * @summary Article Teaser display.
   * @param   {!Object} article the article data to display
   * @param   {string} article.title the article title or headline
   * @param   {string} article.image url to a thumbnail
   * @param   {string} article.url the url to link to
   * @param   {string} article.datetime the publish date
   * @returns {string} HTML output
   */
  xArticle(article) {
    let frag = Homepage.NAMED_TEMPLATES.xArticle.cloneNode(true)
    frag.querySelector('[itemprop~="image"]'       ).src         = article.image
    frag.querySelector('[itemprop~="url"]'         ).href        = article.url
    frag.querySelector('[itemprop~="headline"]'    ).textContent = article.title
    frag.querySelector('[itemprop="datePublished"]').dateTime    = article.datetime
    frag.querySelector('[itemprop="datePublished"]').textContent = xjs.Date.format(new Date(article.datetime), 'F j, Y')
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
    const dom = new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/home.tpl.html'), 'utf8'))
    const document = dom.window.document

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
        container.append(frag)
      }, this)
    }

    // ++++ HARD-CODED DATA ++++ //
    populateList.call(this, '#we-represent > ul', Homepage.DATA.stats  , this.xStat  )
    populateList.call(this, '#portals      > ol', Homepage.DATA.portals, this.xPortal)
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
     */

    // ++++ USER-INPUT DATA ++++ //
    populateList.call(this, '#promotions             > ul', this._DATA['promotions'            ], this.xPromo     )
    populateList.call(this, '#publication-highlights > ul', this._DATA['publication-highlights'], this.xPub       )
    populateList.call(this, '#learn-contribute       > ul', this._DATA['learn-contribute'      ], this.xHomeAction)
    populateList.call(this, '#jobs                   > ul', this._DATA['jobs'                  ], this.xJob       )
    populateList.call(this, '#whats-happening        > ul', this._DATA['whats-happening'       ], this.xArticle   )
    populateList.call(this, '#member-stories         > ul', this._DATA['member-stories'        ], this.xMember    )
    /*
    ;[
      ['#promotions             > ul', this._DATA['promotions'            ], this.xPromo     ],
      ['#publication-highlights > ul', this._DATA['publication-highlights'], this.xPub       ],
      ['#learn-contribute       > ul', this._DATA['learn-contribute'      ], this.xHomeAction],
      ['#jobs                   > ul', this._DATA['jobs'                  ], this.xJob       ],
      ['#whats-happening        > ul', this._DATA['whats-happening'       ], this.xArticle   ],
      ['#member-stories         > ul', this._DATA['member-stories'        ], this.xMember    ],
    ].forEach((params) => populateList.call(this, ...params))
     */
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
      let container = document.querySelector('#publication-highlights > ul')
      let template = container.querySelector('template').content
      this._DATA['publication-highlights'].forEach(function (pub) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xPub(pub)
        container.append(frag)
      }, this)
    }).call(this)
    ;(function () {
      let container = document.querySelector('#learn-contribute > ul')
      let template = container.querySelector('template').content
      this._DATA['learn-contribute'].forEach(function (act) {
        let frag = template.cloneNode(true)
        frag.querySelector('li').innerHTML = this.xHomeAction(act)
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
    document.querySelector('main > header').innerHTML = this.xHero(this._DATA['hero'])
    ;(function (data) {
      let foundation = document.querySelector('#asce-foundation')
      foundation.querySelector('[itemprop="description"]').textContent = data.caption
      foundation.querySelector('[itemprop="potentialAction"] [itemprop="url"]' ).href        = data.cta.url
      foundation.querySelector('[itemprop="potentialAction"] [itemprop="name"]').textContent = data.cta.text
    })(this._DATA['asce-foundation'])

    return dom.serialize()
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
  xHero: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-hero.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Featured Statistic.
   * @const {DocumentFragment}
   */
  xStat: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-stat.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Timely Promo.
   * @const {DocumentFragment}
   */
  xPromo: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/x-promo.tpl.html'), 'utf8'))
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
 * @summary Hard-coded data for the markup.
 * @description This is *not* the user-input data, which is passed to the constructor.
 * @const {!Object}
 */
Homepage.DATA = {
  stats: [
    { icon: "group" , number: 150000, text: "Members"   , type: "JoinAction"  , cta: { text: "Join ASCE"          , url: "//www.asce.org/join/"                         } },
    { icon: "map"   , number: 177   , text: "Countries" , type: "SearchAction", cta: { text: "Find a Local Group" , url: "//www.asce.org/membership-communities/"       } },
    { icon: "shield", number: 9     , text: "Institutes", type: "JoinAction"  , cta: { text: "Select an Institute", url: "//www.asce.org/routing-page/technical-areas/" } },
  ],
  portals: [
    { id: 'membership'          , name: 'Membership'          , icon: 'nameplate'   , url: '//www.asce.org/membership_and_communities/' },
    { id: 'continuing-education', name: 'Continuing Education', icon: 'education'   , url: '//www.asce.org/continuing_education/'       },
    { id: 'publications'        , name: 'Publications'        , icon: 'book-open'   , url: '//www.asce.org/publications/'               },
    { id: 'conferences-events'  , name: 'Conferences & Events', icon: 'calendar'    , url: '//www.asce.org/conferences_events/'         },
    { id: 'initiatives'         , name: 'Initiatives'         , icon: 'address-book', url: '//www.asce.org/our_initiatives/'            },
    { id: 'careers'             , name: 'Careers'             , icon: 'briefcase'   , url: '//www.asce.org/careers/'                    },
  ],
}

module.exports = Homepage
