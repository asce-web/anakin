// ASCE Week section ommission -- Dae Clarke 10/14/2015
$( document ).ready(function() {
  var spec_url = "/event/2016/asce-week";
  $(function(){
    if (location.pathname.indexOf(spec_url)===0){
      $('.highlight-box-blue, .content-right .section').hide();
    }
  });
});

// Chat link button addition
$(window).load(function(){
  $('#header-icon-livechat a, #footer-icon-livechat a').prepend('<span class="icon-livechat"></span>');
});

// Personify Maintenance updates -- DC 7.29.16
// also modified:
// - features.less
// last modified -- DC 9.9.16
// removed -- CH 9.10.16
// added -- DC 7.28.17
// removed -- DC 7.29.17
// ASCE Convention status message added -- DC 10.6.17
// $('body').prepend('<div class="site-alert"><p>Due to weather and travel conditions, all Sunday activities for the ASCE Convention are cancelled. The ASCE Convention will begin Monday, Oct. 9, 2017. <a href="http://www.asceconvention.org/program" style="color: #000;text-decoration: underline;">More details</a>.</p></div>');


// // Publications Maintenance updates -- DC 8.18.17
// var pathArray = window.location.pathname.split( '/' );
// var secondLevelLocation = pathArray[1];
// if (secondLevelLocation === "publications") {
//   $('body').prepend('<div class="site-alert"><p><strong>Attention ASCE Customers</strong>: Due to ASCE&#39;s annual year-end inventory count, all Print Book, DVD, CD ROM and Video orders submitted after 1:00 pm EST, Monday, September 11th, will begin shipping on Friday, September 15th. E-books will continue to be available for purchase through the ASCE Bookstore.</p></div>');
// }
