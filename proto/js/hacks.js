///////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE: This script contains hacks and bugfixes.
// This code is dirty and unstable, and is in no way whatsoever worth cleaning up.
// Do not use this code as an example of anything.
// This script should not be relied upon. It may break at any time without warning. It may also cause unexpected things to happen.
// Edit with caution.
///////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelectorAll('#civil-engineering-magazine .c-LinkList__Link').forEach(function (link) {
  link.querySelector('i.glyphicons-chevron-right').remove()
  link.classList.add('c-Button')
  link.classList.remove('c-LinkList__Link')
})
