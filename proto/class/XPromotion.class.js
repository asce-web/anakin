  export class XPromotion extends HTMLElement {
    // sample: <x-promotion title="Dream Big: subhead" image="dream-big.png" ctatext="Find a screen" ctaurl="#0">A giant-screen film...</x-promotion>
    constructor() {
      super()
      let returned = global.template.x_promotion.content.cloneNode(true)
      returned.querySelector('.c-Promotion').style.setProperty('background-image', `url('${this.getAttribute('image')}')`)
      returned.querySelector('.c-Promotion__Hn'  ).innerHTML = this.getAttribute('title')
      returned.querySelector('.c-Promotion__Text').innerHTML = this.innerHTML
      returned.querySelector('.c-Promotion__Cta' ).setAttribute('href', this.getAttribute('ctaurl'))
      returned.querySelector('.c-Promotion__Cta' ).textContent = this.getAttribute('ctatext')
      while (this.firstChild) { this.firstChild.remove() }
      if (global.ENABLE_WEB_COMPONENTS) {
      let shadowroot = this.attachShadow({ mode: 'closed' })
      shadowroot.appendChild(returned)
      } else {
        this.parentNode.replaceChild(returned, this)
      }
    }
  }
