/**
 * @summary Timely Promo display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the promotion to display
 * @param   {string} data.image url to promo image
 * @param   {string} data.title promo heading
 * @param   {{text:string, url:string}} data.cta call-to-action
 */
function xPromo(frag, data) {
  frag.querySelector('.c-Promo').style.setProperty('background-image', `url('${data.image}')`)
  frag.querySelector('.c-Promo__Hn' ).textContent = data.title
  frag.querySelector('a'            ).href        = data.cta.url
  frag.querySelector('a'            ).textContent = data.cta.text
}

module.exports = xPromo
