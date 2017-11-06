const fs = require('fs')

/**
 * Generates a function based on a given template.
 * @param   {string} template the filename of a template file to use
 * @returns {function(?Object):string} a function that takes data and returns a string
 */
function compile(template) {
  /**
   * A rendering function, which takes an object of data and returns a string.
   * @function
   * @param   {?Object} data a (nullible) object encapsulating any data
   * @returns {string} a string generated from the given template
   */
  return new Function("data", "return `" +
    fs.readFileSync(template, 'utf8')
      .replace(/\\/g, '\\\\') // double-escape any escaped backslashes in the original string
      .replace(/`/g, '\\`')   // escape any backtick literals in the original string
      .replace(/{{/g, '${').replace(/}}/g, '}') // convert mustaches (`{{}}`) into template literals (`${}`)
    + "`")
}


    /**
     * Assume the `data` object is imported from user input
     * @type {object}
     */
    let data = {}
    data.Promotion     = class { constructor(opts) { this.opts = opts } toString() { return compile('./templates/c-Promotion.html.twig').call(null, this.opts) } }
    data.Portal        = class { constructor(opts) { this.opts = opts } toString() { return compile('./templates/c-Portal.html.twig').call(null, this.opts) } }
    data.ArticleTeaser = class { constructor(opts) { this.opts = opts } toString() { return compile('./templates/c-ArticleTeaser.html.twig').call(null, this.opts) } }
    data.MemberStory   = class { constructor(opts) { this.opts = opts } toString() { return compile('./templates/c-MemberStory.html.twig').call(null, this.opts) } }
    /**
     * Promotional sections.
     * @type {Array<Object{title:string, text:string, cta:{text:string, url:string}, image:string}>}
     */
    data.promotions = [
      {
        title: 'Dream Big: Engineering Our World',
        text : `A giant-screen film about engineering will take viewers on a journey
          of discovery from the world’s tallest building to a bridge higher than the clouds.`,
        cta  : { text: 'Find a screen', url: '#0' },
        image: 'dream-big.png',
      },
    ]
    /**
     * Object containing links for each portal.
     * Each array should have no more than 4 items.
     * Each object in the array should have a text (string) and a url (string).
     * @type {Object<Array<{text:string, url:string>>}}
     */
    data.portal_links = {
      membership  : [{text:'Manage My Membership', url:'#0'}, {text:'Join ASCE', url:'#0'}, {text:'', url:''}, {text:'', url:''}],
      cont_ed     : [{text:'', url:''}, {text:'', url:''}, {text:'', url:''}, {text:'', url:''}],
      pubs        : [{text:'', url:''}, {text:'', url:''}, {text:'', url:''}, {text:'', url:''}],
      confs_events: [{text:'', url:''}, {text:'', url:''}, {text:'', url:''}, {text:'', url:''}],
      professional: [{text:'', url:''}, {text:'', url:''}, {text:'', url:''}, {text:'', url:''}],
      careers     : [{text:'', url:''}, {text:'', url:''}, {text:'', url:''}, {text:'', url:''}],
    }
    // /**
    //  * Blurb used for ASCE Foundation section.
    //  * @type {string}
    //  */
    // data.foundation_blurb = `` // NOTE may need this later
    /**
     * ASCE7 section content.
     * @type {string}
     */
    data.asce7_body = `
      <h2>ASCE 7 Online</h2>
      <p>Digital access to both ASCE/SEI 7-16 and 7-10.</p>
      <a clas="c-Button" href="#0">Learn More</a>
      <h2>ASCE 7 Hazard Tool</h2>
      <p>Look up key design parameters as specified by ASCE 7.</p>
      <a clas="c-Button" href="#0">Learn More</a>
    `
    /**
     * Civil Engineering Magazine section content.
     * @type {string}
     */
    data.cemag_body = `
      <h2>Featured this Month</h2>
      <article>
        <h3>Topographic Transformation</h3>
        <p><time datetime="2017-06">June 2017</time></p>
        <p>The formerly flat Governors Island, in New York City harbor, is home to...</p>
        <p><a>Read more</a></p>
      </article>
    `
    /**
     * Links for Technical Information section.
     * This array should have no more than 4 items.
     * Each object in the array should have a text (string) and a url (string).
     * @type {Array<{text:string, url:string>}}
     */
    data.tech_info_links = [
      { text: 'Find a local group'   , url: '#0' },
      { text: 'Browse publications'  , url: '#0' },
      { text: 'Register for a course', url: '#0' },
      { text: 'Find a conference'    , url: '#0' },
    ]
    /**
     * Links for Get Involved section.
     * This array should have no more than 4 items.
     * Each object in the array should have a text (string) and a url (string).
     * @type {Array<{text:string, url:string>}}
     */
    data.get_involved_links = [
      { text: 'View volunteer opportunities'       , url: '#0' },
      { text: 'Find a Section or Branch'           , url: '#0' },
      { text: 'Visit <cite>ASCE Collaborate</cite>', url: '#0' },
      { text: 'Find a committee'                   , url: '#0' },
    ]
    /**
     * Articles for What’s Happening section.
     * This array should have no more than 3 items.
     * Each object in the array should have a title (string), url (string), image (string), and date (Date).
     * @type {Array<{title:string, url:string, image:string, date:Date>}}
     */
    data.news = [
      { title: 'ASCE’s New Infrastructure Report Card: Another D+, But Solutions Available', url: '#0', image: '', date: new Date('2017-03-09') },
      { title: 'Emergency and Carryover Storage Project Earns OCEA'                        , url: '#0', image: '', date: new Date('2017-03-16') },
      { title: 'Former Corps Chief Bostick Honored with OPAL Award'                        , url: '#0', image: '', date: new Date('2017-03-16') },
    ]
    /**
     * Stories for Member Stories section.
     * This array should have no more than 3 items.
     * Each object in the array should have a name (string), title (string), image (string), and quote (string).
     * @type {Array<{name:string, title:string, image:string, quote:string>}}
     */
    data.member_stories = [
      { name: 'Katie Haslett', title: 'Student Member', image: '', quote: `The impact of seeing successful...` },
      { name: 'Nakeia Jackson', title: '2017 New Faces of Civil Engineering', image: '', quote: `When you become an engineer...` },
      { name: 'Damani Nkeiruka', title: 'Distinguished Member', image: '', quote: `There are so many infrastructure and...` },
    ]



fs.writeFileSync('./build/home.html', compile('./templates/home.html.twig').call(null, data), 'utf8')
