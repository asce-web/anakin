$(document).ready(function(){$(function(){0===location.pathname.indexOf("/event/2016/asce-week")&&$(".highlight-box-blue, .content-right .section").hide()})}),$(window).load(function(){$("#header-icon-livechat a, #footer-icon-livechat a").prepend('<span class="icon-livechat"></span>')}),$("body").prepend('<div class="site-alert"><p><a class="black-link" href="/covid-19">COVID-19 OUTBREAK: ASCE Event Cancellations and Updates</a></p></div>');var pathArray=window.location.pathname.split("/"),secondLevelLocation=pathArray[1];"continuing-education"===secondLevelLocation&&$(".site-alert").append('<div class="secondary-alert"><p><strong>Attention ASCE Customers</strong> Due to ASCE\'s annual year - end inventory count, all Print Book, DVD, CD ROM and Video orders submitted after 1:00 pm EST, Monday, September 9th, will begin shipping on Monday, September 16th. E-books will continue to be available for purchase through the ASCE Bookstore.</p></div>'),$("a[href*='www.asce.org']").each(function(){"http:"===this.protocol&&(this.protocol="https:")});