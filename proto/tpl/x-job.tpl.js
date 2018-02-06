/**
 * @summary Job Listing display.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the job data to display
 * @param   {string} data.title the job title
 * @param   {string} data.organization the hiring organization
 * @param   {string} data.location the location of the job (as text)
 * @param   {string} data.url the url to link to
 * @returns {DocumentFragment} modified fragment
 */
function xJob(frag, data) {
  frag.querySelector('[itemprop="url"]').href        = data.url
  frag.querySelector('[itemprop="url"]').textContent = data.title
  frag.querySelector('[itemprop="hiringOrganization"] > [itemprop="name"]').textContent = data.organization
  frag.querySelector('[itemprop="jobLocation"]        > [itemprop="name"]').textContent = data.location
  return frag
}

module.exports = xJob
