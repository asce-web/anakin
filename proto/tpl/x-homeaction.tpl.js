const xjs = {
  HTMLUListElement: require('extrajs-dom').HTMLUListElement,
  HTMLTemplateElement: require('extrajs-dom').HTMLTemplateElement,
}

/**
 * @summary Home Action display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the action data to display, with two components:
 * @param   {!Object} data.fixed static data
 * @param   {string} data.fixed.id the ID
 * @param   {string} data.fixed.name the heading
 * @param   {!Object} data.fluid user-input data, pulled from database
 * @param   {string} data.fluid.caption the caption
 * @param   {string} data.fluid.image url to image
 * @param   {Array<{text:string, url:string}>} data.fluid.links list of links
 */
function xHomeAction(frag, data) {
  const [act, act_data] = [data.fixed, data.fluid]
  frag.querySelector('.c-HomeAction').id = act.id
  frag.querySelector('.c-HomeAction__Img' ).src         = act_data.image
  frag.querySelector('.c-HomeAction__Hn'  ).textContent = act.name
  frag.querySelector('.c-HomeAction__Cap' ).textContent = act_data.caption

  new xjs.HTMLUListElement(frag.querySelector('.c-HomeAction__List')).populate(act_data.links, function (f, d) {
      f.querySelector('[itemprop="url"]' ).href        = d.url
      f.querySelector('[itemprop="name"]').textContent = d.text
  })
}

module.exports = xHomeAction
