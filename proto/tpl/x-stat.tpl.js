/**
 * @summary Featured Statistic display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the statistic to display
 * @param   {string} data.icon the classname of the glyphicon
 * @param   {number} data.number the featured numerical value
 * @param   {string} data.text the featured textual value
 * @param   {string} data.type a Schema.Org classname; should be a subclass of http://schema.org/Action
 * @param   {{text:string, url:string}} data.cta call-to-action
 */
function xStat(frag, data) {
  frag.querySelector('.glyphicons').className = frag.querySelector('.glyphicons').className.replace('{{ icon }}', data.icon)
  frag.querySelector('slot[name="stat-number"]').textContent = data.number.toLocaleString('en')
  frag.querySelector('slot[name="stat-text"]'  ).textContent = data.text
  let action = frag.querySelector('[itemprop="potentialAction"]')
  action.setAttribute('itemtype', `http://schema.org/${data.type || 'Action'}`)
  action.querySelector('[itemprop="url"]' ).href        = data.cta.url
  action.querySelector('[itemprop="name"]').textContent = data.cta.text
}

module.exports = xStat
