(function ($) {
    Drupal.behaviors.myBehavior = {
        attach: function (context, settings) {
			$('.current-search-item-reset a').addClass("btn btn-primary");
			$('#date-popup-calendar-form-1').attr("placeholder", "Aankomstdatum");
			$('#facetapi_select_facet_form_2').children('[value="0"]').html('Verblijfsduur');
			$('#facetapi_select_facet_form_1').children('[value="0"]').html('Aantal personen');
			
            $(".februari").once('once-februari', function () {
                if ($(".februari").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + (jQuery('.month').width()))
                }
            });
            $(".maart").once('once-maart', function () {
                if ($(".maart").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 2)))
                }
            });
            $(".april").once('once-april', function () {
                if ($(".april").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 3)))
                }
            });
            $(".mei").once('once-mei', function () {
                if ($(".mei").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 4)))
                }
            });
            $(".juni").once('once-juni', function () {
                if ($(".juni").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 5)))
                }
            });
            $(".juli").once('once-juli', function () {
                if ($(".juli").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 6)))
                }
            });
            $(".augustus").once('once-augustus', function () {
                if ($(".augustus").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 7)))
                }
            });
            $(".september").once('once-september', function () {
                if ($(".september").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 8)))
                }
            });
            $(".oktober").once('once-oktober', function () {
                if ($(".oktober").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 9)))
                }
            });
            $(".november").once('once-november', function () {
                if ($(".november").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 10)))
                }
            });
            $(".december").once('once-december', function () {
                if ($(".december").find('td.today').length != 0) {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + ((jQuery('.month').width() * 11)))
                }
            });

            $(".beschikbaarheid-en-prijzen-kalender .btn-prev").once('once-btn-prev', function () {
                $(".beschikbaarheid-en-prijzen-kalender .btn-prev").click(function () {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() - (jQuery('.month-width').width()));
                });
            });

            $(".beschikbaarheid-en-prijzen-kalender .btn-next").once('once-btn-next', function () {
                $(".beschikbaarheid-en-prijzen-kalender .btn-next").click(function () {
                    $(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft($(".beschikbaarheid-en-prijzen-kalender .view-content").scrollLeft() + (jQuery('.month-width').width()));
                });
            });
        }
    };

    Drupal.behaviors.myBehavior2 = {
        attach: function (context, settings) {

            if (context == document) {

                var mainSlider = $(".main-container .node .flexslider:first");
                if (mainSlider.length) {
                    var flexsliderContent = mainSlider.html();
                    var mainSliderId = $(".main-container .flexslider:first").attr('id');

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
        }
    };
})(jQuery);
