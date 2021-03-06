const path = require('path')

const xjs = {
  HTMLUListElement: require('extrajs-dom').HTMLUListElement,
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

  new xjs.HTMLUListElement(frag.querySelector('.c-Pub__List')).populate(pub_data.links, function (f, d) {
      f.querySelector('[itemprop="url"]' ).href        = d.url
      f.querySelector('[itemprop="name"]').textContent = d.text
  })
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-pub.tpl.html'))
  .setRenderer(xPub)
