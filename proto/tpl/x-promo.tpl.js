/**
 * @summary Timely Promo display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the promotion to display
 * @param   {string} data.title promo heading
 * @param   {string} data.image url to promo image
 * @param   {string} data.caption text caption
 * @param   {{text:string, url:string}} data.cta call-to-action
 * @returns {DocumentFragment} modified fragment
 */
function xPromo(frag, data) {
  frag.querySelector('.c-Promo').style.setProperty('background-image', `url('${data.image}')`)
  frag.querySelector('.c-Promo__Hn' ).textContent = data.title
  frag.querySelector('.c-Promo__Cap').textContent = data.caption
  frag.querySelector('.c-Promo__Cta').href        = data.cta.url
  frag.querySelector('.c-Promo__Cta').textContent = data.cta.text
  return frag
}

module.exports = xPromo
