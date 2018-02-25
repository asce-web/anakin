const ARIAPatterns = require('../index.js')

console.log(ARIAPatterns.xPermalink.render({ id: 'my_id' }).querySelector('a').outerHTML)

console.log(ARIAPatterns.xPermalink.render({
  id   : 'my_id',
  text : 'custom text',
  label: 'custom label',
}).querySelector('a').outerHTML)
