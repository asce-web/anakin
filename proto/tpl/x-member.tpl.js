/**
 * @summary Member Story display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the member data to display
 * @param   {string} data.name the name of the member (as a string)
 * @param   {string} data.grade type of member, title, or subheading
 * @param   {string} data.image url to a headshot photo
 * @param   {string} data.quote quote by the member
 */
function xMember(frag, data) {
  frag.querySelector('[itemprop="image"]'      ).src         = data.image
  frag.querySelector('[itemprop="name"]'       ).textContent = data.name
  frag.querySelector('[itemprop="description"]').textContent = data.grade
  frag.querySelector('blockquote'              ).textContent = data.quote
}

module.exports = xMember
