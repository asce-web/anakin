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



fs.writeFileSync('./build/home.html', compile('./templates/home.html.twig').call(null, data), 'utf8')
