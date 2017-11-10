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
 * @summary Fill an element with text.
 * @description If the text is plain, the element’s `.textContent` attribute is used.
 * If the text is rich (allowing HTML elements), the element’s `.innerHTML` attribute is used.
 * The text given can either be a string or an array of strings.
 * @param   {Element} element the element to modify
 * @param   {(string|Array<string>)} data the text to fill
 * @param   {boolean=} rich if `true`, use `innerHTML`; otherwise, use `textContent`
 * @returns {Element} the modified Element
 */
function setElementText(element, data, rich = false) {
  if (rich) {
    element.innerHTML = ((typeof data === 'string') ? data : data.join('')) // NOTE flow content
  } else {
    element.textContent = ((typeof data === 'string') ? data : data.join('')) // NOTE flow content
  }
  return element
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



//////////////// CUSTOM ELEMENT DEFINITIONS ////////////////
window.customElements.define('x-stat', class XStat extends HTMLElement {
  constructor() {
    super()
    let returned = document.querySelector('link[rel="import"][href$="x-stat.tpl.html"]').import.querySelector('template').content.cloneNode(true)
    returned.querySelector('.c-Stat__Icon').className = returned.querySelector('.c-Stat__Icon').className.replace('{{ icon }}', this.getAttribute('icon'))
    returned.querySelector('.c-Stat__Num' ).textContent = this.getAttribute('number')
    returned.querySelector('.c-Stat__Text').textContent = this.getAttribute('text')
    returned.querySelector('.c-Stat__Cta' ).setAttribute('href', this.getAttribute('ctaurl'))
    returned.querySelector('.c-Stat__Cta' ).textContent = this.getAttribute('ctatext')
    this.appendChild(returned)
  }
})
window.customElements.define('x-portal', class XPortal extends HTMLElement {
  constructor () {
    super()
    let returned = document.querySelector('link[rel="import"][href$="x-portal.tpl.html"]').import.querySelector('template').content.cloneNode(true)
    returned.querySelector('.c-Portal__Icon').className = returned.querySelector('.c-Portal__Icon').className.replace('{{ icon }}', this.getAttribute('icon'))
    returned.querySelector('.c-Portal__Hn'  ).textContent = this.getAttribute('name')
    returned.querySelector('.c-Portal__List').setAttribute('data-list', this.getAttribute('list'))
    this.appendChild(returned)
  }
})
window.customElements.define('x-pub', class XPub extends HTMLElement {
  constructor () {
    super()
    let returned = document.querySelector('link[rel="import"][href$="x-pub.tpl.html"]').import.querySelector('template').content.cloneNode(true)
    returned.querySelector('.c-Pub__Hn').textContent = this.getAttribute('name')
    returned.querySelector('.c-Pub__Cap').innerHTML = this.innerHTML // NOTE rich text
    returned.querySelector('.c-Pub__List').setAttribute('data-list', this.getAttribute('list'))
    returned.querySelector('.c-Pub__Body').setAttribute('data-text', this.getAttribute('body'))
    while (this.childNodes.length) { this.firstChild.remove() }
    this.appendChild(returned)
  }
})
window.customElements.define('x-learncontrib', class XLearnContrib extends HTMLElement {
  constructor () {
    super()
    let returned = document.querySelector('link[rel="import"][href$="x-learncontrib.tpl.html"]').import.querySelector('template').content.cloneNode(true)
    returned.querySelector('.c-LearnContrib__Hn').textContent = this.getAttribute('name')
    returned.querySelector('.c-LearnContrib__Cap').innerHTML = this.innerHTML // NOTE rich text
    returned.querySelector('.c-LearnContrib__List').setAttribute('data-list', this.getAttribute('list'))
    while (this.childNodes.length) { this.firstChild.remove() }
    this.appendChild(returned)
  }
})



//////////////// FILL IN ALL THE DATA ////////////////
//////// Hero ////////
document.querySelector('.c-Hero').style.setProperty('background-image', `url('${global.database.hero.image}')`)
document.querySelector('.c-Hero__Cap').textContent = global.database.hero.caption
document.querySelector('.c-Hero__Cta').setAttribute('href', global.database.hero.cta.url)
document.querySelector('.c-Hero__Cta').textContent = global.database.hero.cta.text


//////// Jobs ////////
populateListWithData(document.querySelector('[data-list="jobs"]'), global.database.jobs, function (frag, datum) {
  frag.querySelector('.c-JobListing__Link').setAttribute('href', datum.url)
  frag.querySelector('.c-JobListing__Link').textContent = datum.title
  frag.querySelector('.c-JobListing__Org' ).textContent = datum.organization
  frag.querySelector('.c-JobListing__Loc' ).textContent = datum.location
  return frag
})


//////// Timely Promos ////////
populateListWithData(document.querySelector('[data-list="promotions"]'), global.database.promotions, function (frag, datum) {
  frag.querySelector('.c-Promotion').style.setProperty('background-image', `url('${datum.image}')`)
  frag.querySelector('.c-Promotion__Hn'  ).textContent = datum.title
  frag.querySelector('.c-Promotion__Cta' ).setAttribute('href', datum.cta.url)
  frag.querySelector('.c-Promotion__Cta' ).textContent = datum.cta.text
  frag.querySelector('.c-Promotion__Text').textContent = datum.caption
  return frag
})


//////// Portals ////////
document.querySelectorAll('.c-Portal__List').forEach(function(list) {
  populateListWithData(list, global.database.portal[list.getAttribute('data-list')], function (innerfrag, link) {
    innerfrag.querySelector('.c-Portal__Link').setAttribute('href', link.url)
    innerfrag.querySelector('.c-Portal__Link').textContent = link.text
    return innerfrag
  })
})


//////// Foundation ////////
setElementText(document.querySelector('#asce-foundation > p'), global.database.foundation.caption)


//////// ASCE 7 ////////
document.querySelector('#asce7 .c-Pub__Img').setAttribute('src', global.database.asce7.image)
populateListWithData(document.querySelector('[data-list="asce7.links"]'), global.database.asce7.links, function (frag, datum) {
  frag.querySelector('.c-Pub__Link').setAttribute('href', datum.url)
  frag.querySelector('.c-Pub__Link').textContent = datum.text
  return frag
})
setElementText(document.querySelector('[data-text="asce7.body"]'), global.database.asce7.body, true)


//////// CE Magazine ////////
document.querySelector('#civil-engineering-magazine .c-Pub__Img').setAttribute('src', global.database.cemag.image)
populateListWithData(document.querySelector('[data-list="cemag.links"]'), global.database.cemag.links, function (frag, datum) {
  frag.querySelector('.c-Pub__Link').setAttribute('href', datum.url)
  frag.querySelector('.c-Pub__Link').textContent = datum.text
  return frag
})
setElementText(document.querySelector('[data-text="cemag.body"]'), global.database.cemag.body, true)


//////// Technical Information ////////
document.querySelector('#technical-information .c-LearnContrib__Head').style.setProperty('background-image', `url('${global.database.tech_info.image}')`)
populateListWithData(document.querySelector('[data-list="tech_info.links"]'), global.database.tech_info.links, function (frag, datum) {
  frag.querySelector('.c-LearnContrib__Link').setAttribute('href', datum.url)
  frag.querySelector('.c-LearnContrib__Link').textContent = datum.text
  return frag
})


//////// Get Involved ////////
document.querySelector('#get-involved .c-LearnContrib__Head').style.setProperty('background-image', `url('${global.database.get_involved.image}')`)
populateListWithData(document.querySelector('[data-list="get_involved.links"]'), global.database.get_involved.links, function (frag, datum) {
  frag.querySelector('.c-LearnContrib__Link').setAttribute('href', datum.url)
  frag.querySelector('.c-LearnContrib__Link').textContent = datum.text
  return frag
})


//////// What’s Happening ////////
populateListWithData(document.querySelector('[data-list="whats_happening"]'), global.database.whats_happening, function (frag, datum) {
  frag.querySelector('.c-ArticleTeaser__Img').setAttribute('src', datum.image)
  frag.querySelector('.c-ArticleTeaser__Link').setAttribute('href', datum.url)
  frag.querySelector('.c-ArticleTeaser__Link').textContent = datum.title
  frag.querySelector('.c-ArticleTeaser__Date > time').setAttribute('datetime', datum.datetime) // TODO use `HTMLTimeElement#dateTime` property
  frag.querySelector('.c-ArticleTeaser__Date > time').textContent = global.formatDate(new Date(datum.datetime))
  return frag
})


//////// Member Stories ////////
populateListWithData(document.querySelector('[data-list="member_stories"]'), global.database.member_stories, function (frag, datum) {
  frag.querySelector('.c-MemberStory__Img').setAttribute('src', datum.image)
  frag.querySelector('.c-MemberStory__Hn').textContent = datum.name
  frag.querySelector('.c-MemberStory__SubHn').textContent = datum.title
  frag.querySelector('.c-MemberStory__Quote').textContent = datum.quote
  return frag
})
