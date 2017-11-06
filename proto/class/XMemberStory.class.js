  export class XMemberStory extends HTMLElement {
    // sample: <x-memberstory name="Katie Haslett" title="Student Member" image="Haslett.png">The impact of seeing successful...</x-memberstory>
    constructor() {
      super()
      let returned = global.template.x_memberstory.content.cloneNode(true)
      returned.querySelector('.c-MemberStory__Img').setAttribute('src', this.getAttribute('image'))
      returned.querySelector('.c-MemberStory__Hn').innerHTML = this.getAttribute('name')
      returned.querySelector('.c-MemberStory__SubHn').innerHTML = this.getAttribute('title')
      returned.querySelector('.c-MemberStory__Quote').innerHTML = this.innerHTML
      while (this.firstChild) { this.firstChild.remove() }
      if (global.ENABLE_WEB_COMPONENTS) {
      let shadowroot = this.attachShadow({ mode: 'closed' })
      shadowroot.appendChild(returned)
      } else {
        this.parentNode.replaceChild(returned, this)
      }
    }
  }
