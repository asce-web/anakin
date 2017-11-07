  export class XStat extends HTMLElement {
    // sample: <x-stat icon="group" number="150000" text="Members" ctatext="Join ASCE" ctaurl="#0"></x-stat>
    constructor() {
      super()
      let returned = global.template.x_stat.content.cloneNode(true)
      returned.querySelector('.c-Stat__Icon').className = returned.querySelector('.c-Stat__Icon').className.replace('{{ icon }}', this.getAttribute('icon'))
      returned.querySelector('.c-Stat__Num' ).innerHTML = this.getAttribute('number')
      returned.querySelector('.c-Stat__Text').innerHTML = this.getAttribute('text')
      returned.querySelector('.c-Stat__Cta' ).setAttribute('href', this.getAttribute('ctaurl'))
      returned.querySelector('.c-Stat__Cta' ).innerHTML = this.getAttribute('ctatext')
      while (this.firstChild) { this.firstChild.remove() }
      if (global.ENABLE_WEB_COMPONENTS) {
      let shadowroot = this.attachShadow({ mode: 'closed' })
      shadowroot.appendChild(returned)
      } else {
        this.parentNode.replaceChild(returned, this)
      }
    }
  }
