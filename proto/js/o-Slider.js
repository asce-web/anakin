/**
 * Switch to a new tab.
 * // NOTE copied from xmeter/o-Tablist.js
 * @static
 * @param   {?HTMLElement} tab_old the tab currently expanded, or `null` if no tab is expanded (or it doesn’t matter which tab is expanded)
 * @param   {HTMLElement} tab_new the tab to expand
 */
function switchTabs(tab_old, tab_new) {
  tab_new.focus()
  tab_new.panel().open = true
  tab_new.panel().attributeChangedCallback('open', null, '')
}

/**
 * When pressing the "prev" button, switch to the previous panel.
 */
document.querySelectorAll('.o-Tablist--slider__Button[value="prev"]').forEach(function (button) {
  button.addEventListener('click', function (e) {
    let shownpanel = this.parentNode.querySelector('[role="tabpanel"][open]')

    // find the previous-available panel
    let prevpanel = shownpanel;
    do prevpanel = prevpanel.previousElementSibling || prevpanel.parentNode.lastElementChild
    while (!prevpanel.matches('[role="tabpanel"]'))

    switchTabs(shownpanel.tab(), prevpanel.tab())
  })
})

/**
 * When pressing the "next" button, switch to the next panel.
 */
document.querySelectorAll('.o-Tablist--slider__Button[value="next"]').forEach(function (button) {
  button.addEventListener('click', function (e) {
    let shownpanel = this.parentNode.querySelector('[role="tabpanel"][open]')

    // find the next available panel
    let nextpanel = shownpanel;
    do nextpanel = nextpanel.nextElementSibling || nextpanel.parentNode.firstElementChild
    while (!nextpanel.matches('[role="tabpanel"]'))

    switchTabs(shownpanel.tab(), nextpanel.tab())
  })
})
