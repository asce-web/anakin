const path = require('path')

const xjs = {
  HTMLUListElement: require('extrajs-dom').HTMLUListElement,
  HTMLTemplateElement: require('extrajs-dom').HTMLTemplateElement,
}


/**
 * @summary Portal display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the portal data to display, with two components:
 * @param   {!Object} data.fixed static data
 * @param   {string} port.fixed.id the identifier property of `portal` in the database (pointing to an array)
 * @param   {string} port.fixed.name the heading
 * @param   {string} port.fixed.icon the subclass of Glyphicon
 * @param   {string} port.fixed.url the url the heading is linked to
 * @param   {Array<{text:string, url:string}>} data.fluid user-input data, pulled from database
 */
function xPortal(frag, data) {
  const [port, portal_data] = [data.fixed, data.fluid]

  /**
   * Original element, for desktop view.
   * @type {HTMLElement}
   */
  let orig = frag.querySelectorAll('.c-Portal')[0]
  orig.id = port.id
  orig.querySelector('[itemprop="url"]').href = port.url
  orig.querySelector('.glyphicons').className = frag.querySelector('.glyphicons').className.replace('{{ icon }}', port.icon)
  orig.querySelector('[itemprop="name"]').textContent = port.name

  let list = orig.querySelector('.c-Portal__List')
  new xjs.HTMLUListElement(list).populate(portal_data, function (f, d) {
      f.querySelector('[itemprop="significantLink"]'       ).href        = d.url
      f.querySelector('[itemprop="significantLink"] > slot').textContent = d.text
  })

  /**
   * Duplicate, for mobile view.
   * @type {HTMLElement}
   */
  let dupe = frag.querySelectorAll('.c-Portal')[1]
  dupe.append(list.cloneNode(true))
  dupe.querySelector('.c-Portal__Head').append(...Array.from(orig.querySelector('.c-Portal__Head').childNodes).map((n) => n.cloneNode(true)))
  dupe.querySelector('.glyphicons').classList.remove('c-BigAssIcon', 'h-Block')
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-portal.tpl.html'))
  .setRenderer(xPortal)
