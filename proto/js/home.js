//////////////// GLOBALS ////////////////
/**
 * Global variables.
 * @type {!Object}
 */
let global = {
  formatDate(date) {
    const MONTHS = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getFullYear()}`
  },
  database: JSON.parse(document.querySelector('script#database').textContent),
}
/**
 * @summary Append to an element a document fragment, filled in with data.
 * @description The element must have a single <template> element child.
 * @param   {Element} element the element to modify
 * @param   {!Object} data any non-nullible object
 * @param   {?(function(DocumentFragment,!Object):DocumentFragment)=} generator a function that fills in a document fragment with data
 * @returns {Element} the modified Element
 */
function populateElementWithData(element, data, generator = null) {
  let documentfragment;
  try {
    documentfragment = element.querySelector('template').content
  } catch (e) {
    throw new ReferenceError('The selected element does not have a <template> child.')
  }
  element.append((generator) ? generator.call(null, documentfragment.cloneNode(true), data) : data.toString())
  return element
}
/**
 * @summary Append to an element one or more document fragments, filled with data.
 * @description The element must have a single <template> element child.
 * @param   {Element} element the element to modify
 * @param   {Array<!Object>} data any array of non-nullible objects
 * @param   {?(function(DocumentFragment,!Object):DocumentFragment)=} generator a function that fills in a document fragment with data
 * @returns {Element} the modified Element
 */
function populateListWithData(element, data, generator = null) {
  let documentfragment;
  try {
    documentfragment = element.querySelector('template').content
  } catch (e) {
    throw new ReferenceError('The selected element does not have a <template> child.')
  }
  element.append(...data.map((d) => (generator) ? generator.call(null, documentfragment.cloneNode(true), d) : d.toString()))
  return element
}



//////////////// DATA TYPE DEFINITIONS ////////////////
// NOTE: Data Types serve as an API for many different custom elements.
// Data Types are de-coupled from their display (i.e., custom elements),
// so we can instantiate a data type once with the data we need, and then
// render it with any display we want.
//
// When a custom element is constructed, it automatically instantiates a data type,
// and then uses the fields and methods available to that instance to render HTML.
// This technique may seem more complicated than simply rendering HTML with
// the custom element’s attributes and content; indeed, it does have more steps.
// However, the benefit of using data types is that it has a more structured API,
// which standardizes its usage for different custom elements using the same data type.
//
// For example, a `DateRange` data type (with a start date, end date, name, etc.)
// could be used in the definition of both `<x-importantdate>` and `<x-session>` custom elements,
// even though those custom elements might have different markup structures and styles.
// When we make a `<x-session startdate="2017-11-20T17:29:41.162Z">` element,
// the value of the `[startdate]` attribute would be sent into a `new DateRange()` instance.
// Then our `XSession` class would access the start date via some `instance.getStartDate()` method,
// rather than `this.getAttribute('startdate')`.
// The `DateRange#getStartDate()` method would standardize the formatting and output
// of the start date, so we don’t have to do it multiple times in each custom element.
////////////////  ////////////////
/**
 * A Featured Publication.
 */
class Pub {
  constructor({name, caption, image, links, body}) {
    this._name    = name
    this._caption = caption
    this._image   = image
    this._links   = links
    this._body    = body
  }
  get name()    { return this._name }
  get caption() { return this._caption }
  get image()   { return this._image }
  get links()   { return this._links.slice() }
  get body()    { return (typeof this._body === 'string') ? this._body : this._body.join('') }
}
/**
 * An item in the Actions section.
 */
class HomeAction {
  constructor({name, caption, image, links, body}) {
    this._name    = name
    this._caption = caption
    this._image   = image
    this._links   = links
    this._body    = body
  }
  get name()    { return this._name }
  get caption() { return this._caption }
  get image()   { return `url('${this._image}')` }
  get links()   { return this._links.slice() }
  get body()    { return (typeof this._body === 'string') ? this._body : this._body.join('') }
}



//////////////// CUSTOM ELEMENT DEFINITIONS ////////////////
window.customElements.define('x-pub', class XPub extends HTMLElement {
  constructor () {
    super()
    let data = global.database[this.getAttribute('data')]
    let instance = new Pub({
      name   : this.getAttribute('name'),
      caption: this.innerHTML,
      image  : data.image,
      links  : data.links,
      body   : data.body,
    })
    let frag = XPub.TEMPLATE.content.cloneNode(true)
    frag.querySelector('.c-Pub__Hn > cite').textContent = instance.name
    frag.querySelector('.c-Pub__Cap' ).innerHTML = instance.caption
    frag.querySelector('.c-Pub__Img' ).src       = instance.image
    frag.querySelector('.c-Pub__Body').innerHTML = instance.body
    populateListWithData(frag.querySelector('.c-Pub__List'), instance.links, function (frag, datum) {
      frag.querySelector('.c-Pub__Link'       ).href        = datum.url
      frag.querySelector('.c-Pub__Link > span').textContent = datum.text
      return frag
    })
    while (this.childNodes.length) { this.firstChild.remove() }
    this.appendChild(frag)
  }
  static get TEMPLATE() {
    return document.querySelector('link[rel="import"][href$="x-pub.tpl.html"]').import.querySelector('template')
  }
})
window.customElements.define('x-homeaction', class XHomeAction extends HTMLElement {
  constructor () {
    super()
    let data = global.database[this.getAttribute('data')]
    let instance = new HomeAction({
      name   : this.getAttribute('name'),
      caption: this.innerHTML,
      image  : data.image,
      links  : data.links,
    })
    let frag = XHomeAction.TEMPLATE.content.cloneNode(true)
    frag.querySelector('.c-HomeAction__Hn'  ).textContent = instance.name
    frag.querySelector('.c-HomeAction__Cap' ).innerHTML   = instance.caption
    frag.querySelector('.c-HomeAction__Head').style.setProperty('background-image', instance.image)
    populateListWithData(frag.querySelector('.c-HomeAction__List'), instance.links, function (frag, datum) {
      frag.querySelector('.c-HomeAction__Link'       ).href        = datum.url
      frag.querySelector('.c-HomeAction__Link > span').textContent = datum.text
      return frag
    })
    while (this.childNodes.length) { this.firstChild.remove() }
    this.appendChild(frag)
  }
  static get TEMPLATE() {
    return document.querySelector('link[rel="import"][href$="x-homeaction.tpl.html"]').import.querySelector('template')
  }
})



//////////////// POPULATE ALL THE DATA ////////////////
//////// Jobs ////////
populateListWithData(document.querySelector('[data-list="jobs"]'), global.database.jobs, function (frag, datum) {
  frag.querySelector('.c-JobListing__Link').href        = datum.url
  frag.querySelector('.c-JobListing__Link').textContent = datum.title
  frag.querySelector('.c-JobListing__Org' ).textContent = datum.organization
  frag.querySelector('.c-JobListing__Loc' ).textContent = datum.location
  return frag
})


//////// What’s Happening ////////
populateListWithData(document.querySelector('[data-list="whats_happening"]'), global.database.whats_happening, function (frag, datum) {
  frag.querySelector('.c-ArticleTeaser__Img'        ).src         = datum.image
  frag.querySelector('.c-ArticleTeaser__Link'       ).href        = datum.url
  frag.querySelector('.c-ArticleTeaser__Link > cite').textContent = datum.title
  frag.querySelector('.c-ArticleTeaser__Date > time').dateTime    = datum.datetime
  frag.querySelector('.c-ArticleTeaser__Date > time').textContent = global.formatDate(new Date(datum.datetime))
  return frag
})


//////// Member Stories ////////
populateListWithData(document.querySelector('[data-list="member_stories"]'), global.database.member_stories, function (frag, datum) {
  frag.querySelector('.c-MemberStory__Img'  ).src         = datum.image
  frag.querySelector('.c-MemberStory__Hn'   ).textContent = datum.name
  frag.querySelector('.c-MemberStory__SubHn').textContent = datum.grade
  frag.querySelector('.c-MemberStory__Quote').textContent = datum.quote
  return frag
})
