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
$('body').prepend('<div class="site-alert"><p><strong>Notice</strong>: Maintenance Notice: ASCE will be performing system updates this Friday from 9pm &ndash; Saturday 12pm EST. Online transactions, including payment processing, will be unavailable during this time period.</p></div>');
