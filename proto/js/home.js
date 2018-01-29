//////////////// GLOBALS ////////////////
/**
 * Global variables.
 * @type {!Object}
 */
let global = {
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



//////////////// CUSTOM ELEMENT DEFINITIONS ////////////////



//////////////// POPULATE ALL THE DATA ////////////////
//////// Jobs ////////
populateListWithData(document.querySelector('[data-list="jobs"]'), global.database.jobs, function (frag, datum) {
  frag.querySelector('.c-JobListing__Link').href        = datum.url
  frag.querySelector('.c-JobListing__Link').textContent = datum.title
  frag.querySelector('.c-JobListing__Org' ).textContent = datum.organization
  frag.querySelector('.c-JobListing__Loc' ).textContent = datum.location
  return frag
})
