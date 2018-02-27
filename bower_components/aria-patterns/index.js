/**
 * @summary A set of component builders.
 * @namespace
 */
const ARIAPatterns = {
  /**
   * @summary A permalink for sections of a webpage.
   * @description An `<a.c-Permlink>` element. Best inside an `<h1>`.
   * @example
   * const ARIAPatterns = require('aria-pattrens')
   * document.querySelector('#section-title > h1').append(
   *   ARIAPatterns.xPermalink.render({id: 'section-title'})
   * )
   * @see xPermalink_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPermalink: require('./tpl/x-permalink.tpl.js'),
  /**
   * @summary A webpage’s directory, in the form of a document outline.
   * @description An `<ol role="directory">` with link list items to subpages. Best inside a `<nav>`.
   * @example
   * const ARIAPatterns = require('aria-pattrens')
   * let webpage = {
   *   "@type": "WebPage",
   *   "name": "A 2016 Event",
   *   "url": "https://2016.asce-event.org/",
   *   "hasPart": [
   *     { "@type": "WebPage", "name": "Registration | A 2016 Event", "url": "https://2016.asce-event.org/registration/" },
   *     { "@type": "WebPage", "name": "Program | A 2016 Event"     , "url": "https://2016.asce-event.org/program/"      },
   *     { "@type": "WebPage", "name": "Location | A 2016 Event"    , "url": "https://2016.asce-event.org/location/"     },
   *     { "@type": "WebPage", "name": "Speakers | A 2016 Event"    , "url": "https://2016.asce-event.org/speakers/"     },
   *     { "@type": "WebPage", "name": "Sponsor | A 2016 Event"     , "url": "https://2016.asce-event.org/sponsor/"      },
   *     { "@type": "WebPage", "name": "Exhibit | A 2016 Event"     , "url": "https://2016.asce-event.org/exhibit/"      },
   *     { "@type": "WebPage", "name": "About | A 2016 Event"       , "url": "https://2016.asce-event.org/about/"        },
   *     {
   *       "@type": "WebPage",
   *       "name": "Contact | A 2016 Event",
   *       "url": "https://2016.asce-event.org/contact/",
   *       "hasPart": [
   *         { "@type": "WebPage", "name": "Submit Feedback | Contact | A 2016 Event"         , "url": "https://2016.asce-event.org/contact/submit-feedback"     },
   *         { "@type": "WebPage", "name": "Talk to a Representative | Contact | A 2016 Event", "url": "https://2016.asce-event.org/contact/talk-representative" }
   *       ]
   *     }
   *   ]
   * }
   * document.querySelector('header').append(
   *   ARIAPatterns.xDirectory.render(webpage)
   * )
   * @see xDirectory_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xDirectory: require('./tpl/x-directory.tpl.js'),
}

module.exports = ARIAPatterns
