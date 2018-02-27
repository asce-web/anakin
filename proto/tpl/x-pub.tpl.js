const xjs = {
  HTMLTemplateElement: require('extrajs-dom').HTMLTemplateElement,
}

/**
 * @summary Featured Publication display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the publication data to display, with two components:
 * @param   {!Object} data.fixed static data
 * @param   {string} data.fixed.id the ID
 * @param   {string} data.fixed.name the heading
 * @param   {!Object} data.fluid user-input data, pulled from database
 * @param   {string} data.fluid.caption the caption
 * @param   {string} data.fluid.image url to image
 * @param   {Array<{text:string, url:string}>} data.fluid.links list of links
 * @param   {string} data.fluid.body rich body text
 */
function xPub(frag, data) {
  const [pub, pub_data] = [data.fixed, data.fluid]
  frag.querySelector('.c-Pub').id = pub.id
  frag.querySelector('[itemprop~="image"]'     ).src         = pub_data.image
  frag.querySelector('[itemprop="name"]'       ).textContent = pub.name
  frag.querySelector('[itemprop="description"]').textContent = pub_data.caption
  frag.querySelector('[itemprop="text"]'       ).innerHTML   = pub_data.body

  let list = frag.querySelector('.c-Pub__List')
  list.append(...pub_data.links.map((link) =>
    new xjs.HTMLTemplateElement(list.querySelector('template')).setRenderer(function (f, d) {
      f.querySelector('[itemprop="url"]' ).href        = d.url
      f.querySelector('[itemprop="name"]').textContent = d.text
    }).render(link)
  ))
}

module.exports = xPub
