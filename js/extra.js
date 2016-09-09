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
$('body').prepend('<div class="site-alert"><p>Online purchases and updates to personal profiles will be unavailable on Saturday, September 10, from 9:00 AM – 4:00 PM Eastern.</p></div>');