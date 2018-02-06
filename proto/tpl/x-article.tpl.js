const xjs = require('extrajs')

/**
 * @summary Article Teaser display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the article data to display
 * @param   {string} data.title the article title or headline
 * @param   {string} data.image url to a thumbnail
 * @param   {string} data.url the url to link to
 * @param   {string} data.datetime the publish date
 * @returns {DocumentFragment} modified fragment
 */
function xArticle(frag, data) {
  frag.querySelector('[itemprop~="image"]'       ).src         = data.image
  frag.querySelector('[itemprop~="url"]'         ).href        = data.url
  frag.querySelector('[itemprop~="headline"]'    ).textContent = data.title
  frag.querySelector('[itemprop="datePublished"]').dateTime    = data.datetime
  frag.querySelector('[itemprop="datePublished"]').textContent = xjs.Date.format(new Date(data.datetime), 'F j, Y')
  return frag
}

module.exports = xArticle
