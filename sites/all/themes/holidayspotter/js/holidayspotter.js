(function ($) {

Drupal.Holidayspotter = Drupal.Holidayspotter || {};

Drupal.behaviors.actionHolidayspotter = {
  attach: function (context) {
	$('.to-top').click(function(){
		$('html, body').animate({scrollTop : 0},600);
		return false;
	});
	if (context == document) {
	if ($(".februari").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + (jQuery('.month').width()))
	}
	if ($(".maart").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*2)))
	}
	if ($(".april").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*3)))
	}
	if ($(".mei").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*4)))
	}
	if ($(".juni").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*5)))
	}
	if ($(".juli").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*6)))
	}
	if ($(".augustus").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*7)))
	}
	if ($(".september").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*8)))
	}
	if ($(".oktober").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*9)))
	}
	if ($(".november").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*10)))
	}
	if ($(".december").find('td.today').length != 0) {
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width()*11)))
	}
	$(".beschikbaarheid-en-prijzen-kalender .btn-prev").click(function(){
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() - (jQuery('.month').width()));
	});

	$(".beschikbaarheid-en-prijzen-kalender .btn-next").click(function(){
		$(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + (jQuery('.month').width()));
	});
	}
	$(".view a.accordion-toggle[href='#collapse0']").trigger("click");
    Drupal.Holidayspotter.flexsliderWithNav();
}
};

Drupal.Holidayspotter.flexsliderWithNav = function () {
  var mainSlider = $(".main-container .node .flexslider:first");
  if (mainSlider.length) {
    var flexsliderContent = mainSlider.html();
    var mainSliderId =  $(".main-container .flexslider:first").attr('id');

    var navigationId = mainSliderId + "-navigation";
    var navigation = $("<div class='flexslider'><ul class='slides'></ul></div>").html(flexsliderContent);
    navigation.attr("id", navigationId);
    mainSlider.after(navigation);

    $("#" + navigationId).flexslider({
      animation: "slide",
      controlNav: false,
      directionNav: false,
      animationLoop: true,
      slideshow: false,
      itemWidth: 146,
      maxItems: 5,
      asNavFor: "#" + mainSliderId
    });

    $("#" + mainSliderId).flexslider({
      slideshowSpeed: 3000,
      controlNav: false,
      sync: "#" + navigationId
    });
  }
}

})(jQuery);
