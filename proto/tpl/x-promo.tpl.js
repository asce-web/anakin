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
  frag.querySelector('.c-Promotion').style.setProperty('background-image', `url('${data.image}')`)
  frag.querySelector('.c-Promotion__Hn'  ).textContent = data.title
  frag.querySelector('.c-Promotion__Text').textContent = data.caption
  frag.querySelector('.c-Promotion__Cta' ).href        = data.cta.url
  frag.querySelector('.c-Promotion__Cta' ).textContent = data.cta.text
  return frag
}

module.exports = xPromo
