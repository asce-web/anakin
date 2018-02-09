/**
 * @summary Hero section display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the hero image and contents
 * @param   {string} data.image url to hero image
 * @param   {string=} data.title hero heading
 * @param   {string} data.caption text caption
 * @param   {{text:string, url:string}} data.cta call-to-action
 * @returns {DocumentFragment} modified fragment
 */
function xHero(frag, data) {
  frag.querySelector('.c-Hero').style.setProperty('background-image', `url('${data.image}')`)
  frag.querySelector('slot[name="hero-caption"]').textContent = data.caption
  frag.querySelector('a'                        ).href        = data.cta.url
  frag.querySelector('a'                        ).textContent = data.cta.text
  return frag
}

module.exports = xHero
