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
 * @returns {DocumentFragment} modified fragment
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
  portal_data.forEach(function (link) {
    let innerfrag = list.querySelector('template').content.cloneNode(true)
    innerfrag.querySelector('[itemprop="significantLink"]').href        = link.url
    innerfrag.querySelector('[itemprop="significantLink"] slot').textContent = link.text
    list.append(innerfrag)
  })

  /**
   * Duplicate, for mobile view.
   * @type {HTMLElement}
   */
  let dupe = frag.querySelectorAll('.c-Portal')[1]
  dupe.append(list.cloneNode(true))
  dupe.querySelector('.c-Portal__Head').append(...Array.from(orig.querySelector('.c-Portal__Head').childNodes).map((n) => n.cloneNode(true)))
  dupe.querySelector('.glyphicons').classList.remove('c-BigAssIcon', 'h-Block')

  return frag
}

module.exports = xPortal
