// ASCE Week section ommission -- Dae Clarke 10/14/2015
$(document).ready(function () {
  var spec_url = "/event/2016/asce-week";
  $(function () {
    if (location.pathname.indexOf(spec_url) === 0) {
      $('.highlight-box-blue, .content-right .section').hide();
    }
  });
});

// Chat link button addition
$(window).load(function () {
  $('#header-icon-livechat a, #footer-icon-livechat a').prepend('<span class="icon-livechat"></span>');
});

// // Publications Maintenance updates
// var pathArray = window.location.pathname.split('/');
// var secondLevelLocation = pathArray[1];
// if ((secondLevelLocation === "publications") || (secondLevelLocation === "booksandjournals")) {
//   $('body').prepend('<div class="secondary-alert"><p><strong>Attention ASCE Customers</strong>: Due to ASCE\'s annual year - end inventory count, all Print Book, DVD, CD ROM and Video orders submitted after 5:00 pm EST, Monday, September 7th, will begin shipping on Monday, September 14th. E-books will continue to be available for purchase through the <em>ASCE Bookstore</em>.</p></div>');
// }

// $('body').prepend('<div class="secondary-alert"><p>We are experiencing temporary issues with Access Engineering, 10 free PDHs and Salary Survey. We are working to get these fixed as soon as possible.</p></div>');
$('body').prepend('<div class="site-alert"><p><a class="black-link" href="/covid-19">COVID-19 OUTBREAK: ASCE Event Cancellations and Updates</a></p></div>');

// $('body').prepend('<div class="site-alert"><p>Due to system upgrades, online transactions will not be available from <strong>Thursday, February 7 at 5 p.m. EST through Monday, February 11</strong>. This includes registrations, purchases and changes to member records. If you need immediate assistance, please contact Customer Service at 1-800-548-2723 or 703-295-6300 (Mon–Fri 9 a.m.–6 p.m. EST) or email <a href="mailto:customercare@asce.org">customercare@asce.org</a>. Thank you for your patience.</p></div>');

// Personify Maintenance updates -- DC 7.29.16
// also modified:
// - features.less
// last modified -- DC 9.9.16
// removed -- CH 9.10.16
// added -- DC 7.28.17
// removed -- DC 7.29.17
// ASCE Convention status message added -- DC 10.6.17
// Personify down status message -- DC 12.01.17
// $('body').prepend('<div class="site-alert"><p><strong>Attention ASCE Customers</strong>: Due to ASCE&#39;s annual year-end inventory count, all Print Book, DVD, CD ROM and Video <strong>orders submitted after 1:00 p.m. EST, Monday, September 10<sup>th</sup>, will begin shipping on Monday, September 17<sup>th</sup></strong>.  E-books will continue to be available for purchase through the <a href="//www.asce.org/booksandjournals/">ASCE Bookstore</a>.</p></div>');





// var pathArray = window.location.pathname.split('/');
// var secondLevelLocation = pathArray[1];
// if (secondLevelLocation === "booksandjournals") {
//   $('body').prepend('<div class="site-alert"><p><strong>Attention ASCE Customers</strong> Due to ASCE\'s annual year - end inventory count, all Print Book, DVD, CD ROM and Video orders submitted after 1:00 pm EST, Monday, September 9th, will begin shipping on Monday, September 16th. E-books will continue to be available for purchase through the ASCE Bookstore.</p></div>');
// }

// Temporary Fix for broken HTTP link
// $("a[href]").each(function(){
//     if( this.protocol === "http:")
//         this.protocol = "https:"
// });
// $(".shooju-msearch a[href]").each(function(){
//     if( this.protocol === "http:")
//         this.protocol = "https:"
// });


// Script that will ensure non-secure anchors on asce.org are now secure.
$("a[href*='www.asce.org']").each(function () {
  if (this.protocol === "http:")
    this.protocol = "https:"
});
