// ASCE Week section ommission -- Dae Clarke 10/14/2015
$( document ).ready(function() {
  var spec_url = "/event/2016/asce-week";
  $(function(){
    if (location.pathname.indexOf(spec_url)===0){
      $('.highlight-box-blue, .content-right .section').hide();
    }
  });
});

// 
$('body').prepend('<div class="site-alert"><p>Online purchases and updates to personal profiles will be unavailable on Friday, July 29, 2016 at 6 p.m. EDT through Sunday, July 31, 2016 at 12:00 p.m. EDT.</p></div>');