  export class XPortal extends HTMLElement {
    // sample: <x-portal title="Membership" icon="nameplate">
    //   <item text="Manage My Membership" url="#0"></item>
    //   <item text="Join ASCE" url="#0"></item>
    // </x-portal>
    constructor() {
      super()
      let returned = global.template.x_portal.content.cloneNode(true)
      returned.querySelector('.c-Portal__Icon').className = returned.querySelector('.c-Portal__Icon').className.replace('{{ icon }}', this.getAttribute('icon'))
      returned.querySelector('.c-Portal__Hn'  ).innerHTML = this.getAttribute('title')
      this.querySelectorAll('item').forEach(function (item) {
        let listitem = returned.querySelector('.c-Portal__List__Item').cloneNode(true)
        listitem.querySelector('a').setAttribute('href', item.getAttribute('url'))
        listitem.querySelector('a').innerHTML = item.getAttribute('text')
        returned.querySelector('.c-Portal__List').appendChild(listitem)
      })
      returned.querySelector('.c-Portal__List').firstElementChild.remove() // remove the empty template list item
      while (this.firstChild) { this.firstChild.remove() }
      if (global.ENABLE_WEB_COMPONENTS) {
      let shadowroot = this.attachShadow({ mode: 'closed' })
      shadowroot.appendChild(returned)
      } else {
        this.parentNode.replaceChild(returned, this)
      }
    }
  }
