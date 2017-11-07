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
    // /**
    //  * Blurb used for ASCE Foundation section.
    //  * @type {string}
    //  */
    // data.foundation_blurb = `` // NOTE may need this later
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
