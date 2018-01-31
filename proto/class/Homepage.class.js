const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')

const xjs = {
  Date: require('extrajs').Date,
}

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
  xHero() {
    let frag = Homepage.NAMED_TEMPLATES.xHero.cloneNode(true)
    frag.querySelector('.c-Hero').style.setProperty('background-image', `url('${this._DATA.hero.image}')`)
    frag.querySelector('slot[name="hero-caption"]').textContent = this._DATA.hero.caption
    frag.querySelector('a'                        ).href        = this._DATA.hero.cta.url
    frag.querySelector('a'                        ).textContent = this._DATA.hero.cta.text

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Featured Statistic display.
   * @param   {{icon:string, number:number, text:string, type:string, cta:{text:string, url:string}}} stat the statistic to display
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

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Portal display.
   * @param   {{name:string, icon:string, url:string, data:string}} port the portal data to display
   * @param   {string} port.id the identifier property of `portal` in the database (pointing to an array)
   * @param   {string} port.name the heading
   * @param   {string} port.icon the subclass of Glyphicon
   * @param   {string} port.url  the url the heading is linked to
   * @returns {string} HTML output
   */
  xPortal(port) {
    let frag = Homepage.NAMED_TEMPLATES.xPortal.cloneNode(true)
    frag.querySelector('.c-Portal').id = port.id
    frag.querySelector('[itemprop="url"]').href = port.url
    frag.querySelector('.glyphicons').className = frag.querySelector('.glyphicons').className.replace('{{ icon }}', port.icon)
    frag.querySelector('[itemprop="name"]').textContent = port.name
    this._DATA.portal[port.id].forEach(function (link) {
      let innerfrag = frag.querySelector('template').content.cloneNode(true)
      innerfrag.querySelector('[itemprop="significantLink"]').href        = link.url
      innerfrag.querySelector('[itemprop="significantLink"]').textContent = link.text
      frag.querySelector('template').parentNode.append(innerfrag)
    })

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Featured Publication display.
   * @param   {{id:string, name:string, caption:string}} pub the publication data to display
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
    frag.querySelector('[itemprop="description"]').innerHTML   = pub.caption
    frag.querySelector('article'                 ).innerHTML   = pub.body
    pub.links.forEach(function (link) {
      let innerfrag = frag.querySelector('template').content.cloneNode(true)
      innerfrag.querySelector('[itemprop="url"]' ).href        = link.url
      innerfrag.querySelector('[itemprop="name"]').textContent = link.text
      frag.querySelector('template').parentNode.append(innerfrag)
    })

    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(frag)
    return returned.innerHTML
  }

  /**
   * @summary Home Action display.
   * @param   {{id:string, name:string, caption:string}} act the action data to display
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
    frag.querySelector('.c-HomeAction__Cap' ).innerHTML   = act.caption
    act.links.forEach(function (link) {
      let innerfrag = frag.querySelector('template').content.cloneNode(true)
      innerfrag.querySelector('[itemprop="url"]' ).href        = link.url
      innerfrag.querySelector('[itemprop="name"]').textContent = link.text
      frag.querySelector('template').parentNode.append(innerfrag)
    })

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
   * Publication Highlights section display.
   * @returns {string} HTML output
   */
  publicationHighlights() {
    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(...this._DATA['publication-highlights'].map(function (pub) {
      let frag = Homepage.NAMED_TEMPLATES.publicationHighlights.cloneNode(true)
      frag.querySelector('li').innerHTML = this.xPub(pub)
      return frag
    }, this))
    return returned.innerHTML
  }

  /**
   * Publication Highlights section display.
   * @returns {string} HTML output
   */
  homeActions() {
    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(...this._DATA['home-actions'].map(function (act) {
      let frag = Homepage.NAMED_TEMPLATES.homeActions.cloneNode(true)
      frag.querySelector('li').innerHTML = this.xHomeAction(act)
      return frag
    }, this))
    return returned.innerHTML
  }

  /**
   * Jobs section display.
   * @returns {string} HTML output
   */
  jobs() {
    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(...this._DATA.jobs.map(function (job) {
      let frag = Homepage.NAMED_TEMPLATES.jobs.cloneNode(true)
      frag.querySelector('[itemprop="url"]').href        = job.url
      frag.querySelector('[itemprop="url"]').textContent = job.title
      frag.querySelector('[itemprop="hiringOrganization"] > [itemprop="name"]').textContent = job.organization
      frag.querySelector('[itemprop="jobLocation"]        > [itemprop="name"]').textContent = job.location
      return frag
    }))
    return returned.innerHTML
  }

  /**
   * What’s Happening section display.
   * @returns {string} HTML output
   */
  whatsHappening() {
    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(...this._DATA.whats_happening.map(function (article) {
      let frag = Homepage.NAMED_TEMPLATES.whatsHappening.cloneNode(true)
      frag.querySelector('[itemprop~="image"]'       ).src         = article.image
      frag.querySelector('[itemprop~="url"]'         ).href        = article.url
      frag.querySelector('[itemprop~="headline"]'    ).textContent = article.title
      frag.querySelector('[itemprop="datePublished"]').dateTime    = article.datetime
      frag.querySelector('[itemprop="datePublished"]').textContent = xjs.Date.format(new Date(article.datetime), 'F j, Y')
      return frag
    }))
    return returned.innerHTML
  }

  /**
   * Member Stories section display.
   * @returns {string} HTML output
   */
  memberStories() {
    let returned = new jsdom.JSDOM().window.document.createElement('div')
    returned.append(...this._DATA.member_stories.map(function (member) {
      let frag = Homepage.NAMED_TEMPLATES.memberStories.cloneNode(true)
      frag.querySelector('[itemprop="image"]'      ).src         = member.image
      frag.querySelector('[itemprop="name"]'       ).textContent = member.name
      frag.querySelector('[itemprop="description"]').textContent = member.grade
      frag.querySelector('blockquote'              ).textContent = member.quote
      return frag
    }))
    return returned.innerHTML
  }


  /**
   * @summary Compile HTML markup from a template file.
   * @description This method takes an entire HTML template file and compiles the static output.
   * @returns {string} compiled HTML output
   */
  compile() {
    const document = Homepage.NAMED_TEMPLATES.homeDocument
    document.querySelector('main > header').innerHTML = this.xHero()
    document.querySelectorAll('#we-represent > ul > li').forEach(function (item, n) {
      item.innerHTML = this.xStat(Homepage.DATA.stats[n])
    }, this)
    document.querySelector('#promotions > ul').innerHTML = this.timelyPromos()
    document.querySelectorAll('#portals > ol > li').forEach(function (item, n) {
      item.innerHTML = this.xPortal(Homepage.DATA.portals[n])
    }, this)
    document.querySelector('#publication-highlights > ul').innerHTML = this.publicationHighlights()
    document.querySelector('#learn-contribute > ul'      ).innerHTML = this.homeActions()
    document.querySelector('#jobs > ul'                  ).innerHTML = this.jobs()
    document.querySelector('#whats-happening > ul'       ).innerHTML = this.whatsHappening()
    document.querySelector('#member-stories > ul'        ).innerHTML = this.memberStories()
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
   * @summary Template for Promotions section.
   * @const {DocumentFragment}
   */
  timelyPromos: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/timely-promos.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Publication Highlights section.
   * @const {DocumentFragment}
   */
  publicationHighlights: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/publication-highlights.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Home Actions section.
   * @const {DocumentFragment}
   */
  homeActions: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/home-actions.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for Jobs section.
   * @const {DocumentFragment}
   */
  jobs: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/jobs.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for What’s Happening section.
   * @const {DocumentFragment}
   */
  whatsHappening: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/whats-happening.tpl.html'), 'utf8'))
    .window.document.querySelector('template').content,

  /**
   * @summary Template for What’s Happening section.
   * @const {DocumentFragment}
   */
  memberStories: new jsdom.JSDOM(fs.readFileSync(path.join(__dirname, '../tpl/member-stories.tpl.html'), 'utf8'))
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
