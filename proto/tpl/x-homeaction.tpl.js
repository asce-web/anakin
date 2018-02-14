const xjs = {
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

  let list = frag.querySelector('.c-HomeAction__List')
  list.append(...act_data.links.map((link) =>
    new xjs.HTMLTemplateElement(list.querySelector('template')).setRenderer(function (f, d) {
      f.querySelector('[itemprop="url"]' ).href        = d.url
      f.querySelector('[itemprop="name"]').textContent = d.text
    }).render(link)
  ))
}

module.exports = xHomeAction
