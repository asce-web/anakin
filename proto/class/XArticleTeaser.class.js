  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  function formatDate(date) { return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getFullYear()}` }
  export class XArticleTeaser extends HTMLElement {
    // sample: <x-articleteaser title="Emergency and Carryover Storage Project Earns OCEA" image="emergency.png" url="#0" datetime="2017-03-16"></x-articleteaser>
    constructor() {
      super()
      let returned = global.template.x_articleteaser.content.cloneNode(true)
      returned.querySelector('.c-ArticleTeaser__Img').setAttribute('src', this.getAttribute('image'))
      returned.querySelector('.c-ArticleTeaser__Link').setAttribute('href', this.getAttribute('url'))
      returned.querySelector('.c-ArticleTeaser__Link').innerHTML = this.getAttribute('title')
      returned.querySelector('.c-ArticleTeaser__Date').innerHTML = formatDate(new Date(this.getAttribute('datetime')))
      while (this.firstChild) { this.firstChild.remove() }
      if (global.ENABLE_WEB_COMPONENTS) {
      let shadowroot = this.attachShadow({ mode: 'closed' })
      shadowroot.appendChild(returned)
      } else {
        this.parentNode.replaceChild(returned, this)
      }
    }
  }
