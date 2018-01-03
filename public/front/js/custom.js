! function(e) {
    "use strict";

    function o() { t.removeClass("active") }

    function s(o) {
        o.each(function() {
            var o = e(this),
                s = o.data("delay"),
                i = "animated " + o.data("animation");
            o.css({ "animation-delay": s, "-webkit-animation-delay": s }), o.addClass(i).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() { o.removeClass(i) })
        })
    }

    function i() {
        var e = [{ featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#444444" }] }, { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] }, { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] }, { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }] }, { featureType: "road.highway", elementType: "all", stylers: [{ visibility: "simplified" }] }, { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] }, { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] }, { featureType: "water", elementType: "all", stylers: [{ color: "#46bcec" }, { visibility: "on" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#aad2e3" }] }],
            o = { lat: 40.759818, lng: -73.937554 },
            s = { zoom: 12, scrollwheel: !1, center: new google.maps.LatLng(40.759818, -73.937554), styles: e },
            i = new google.maps.Map(document.getElementById("googleMap"), s);
        new google.maps.Marker({ position: o, map: i, icon: "img/marker.png" })
    }
    setTimeout(function() { e("body").addClass("loaded") }, 3e3), e(window).on("load", function() {
        e("#body").each(function() {
            var o = e(".header"),
                s = o.find(".navbar"),
                i = (s.find(".site-logo"), s.find(".navigation")),
                t = { nav_top: i.css("margin-top") };
            e(window).scroll(function() { s.hasClass("navbar-sticky") && (e(this).scrollTop() <= 100 || e(this).width() <= 750) ? (s.removeClass("navbar-sticky").appendTo(o), i.animate({ "margin-top": t.nav_top }, { duration: 100, queue: !1, complete: function() { o.css("height", "auto") } })) : !s.hasClass("navbar-sticky") && e(this).width() > 750 && e(this).scrollTop() > 400 && (o.css("height", o.height()), s.css({ opacity: "0" }).addClass("navbar-sticky"), s.appendTo(e("body")).animate({ opacity: 1 }), i.css({ "margin-top": "0px" })) })
        }), e(window).trigger("resize"), e(window).trigger("scroll")
    }), e(".btn-cart").on("click", function(o) { o.preventDefault(), e(".cart_item-box").toggleClass("visible") });
    var t = e(".icon-toggle");
    e(".navbar-toggler").on("click", function(s) { e(this).toggleClass("clicked"), e(".icon-toggle").is(".active") ? o() : (o(), e(".icon-toggle").addClass("active")), s.preventDefault() }), e(".navbar a.dropdown-toggle").on("click", function(o) {
        var s = e(this).parent().parent();
        if (!s.hasClass("navbar-nav")) {
            var i = e(this).parent(),
                t = parseInt(s.css("height").replace("px", ""), 10) / 2,
                a = parseInt(s.css("width").replace("px", ""), 10) - 10;
            return i.hasClass("show") ? i.removeClass("show") : i.addClass("show"), e(this).next().css("top", t + "px"), e(this).next().css("left", a + "px"), !1
        }
    }), e(".navbar").width() > 750 && e(".navbar-nav .dropdown").hover(function() { e(this).addClass("show") }, function() { e(this).removeClass("show") }), e(window).scroll(function() { e(this).scrollTop() > 400 && e(this).width() > 750 ? e(".backToTop").fadeIn() : e(".backToTop").fadeOut() }), e(".backToTop").click(function() { return e("html, body").animate({ scrollTop: 0 }, 1e3), !1 });
    var a = e("#carousel-example-generic, #carousel-example-two"),
        l = a.find(".carousel-item:first").find('[data-animation ^= "animated"]');
    a.carousel(), s(l), a.carousel("pause"), a.on("slide.bs.carousel", function(o) { s(e(o.relatedTarget).find('[data-animation ^= "animated"]')) }), e(".main-slider .inner").on("init", function(o, i) { s(e(".slide1").find("[data-animation]")) }), e(".main-slider .inner").on("beforeChange", function(o, i, t, a) { s(e('div.slide[data-slick-index="' + a + '"]').find("[data-animation]")) });
    var n = e("#rev_slider_1");
    n.length && function(e) { jQuery(e).show().revolution({ delay: "6000", sliderLayout: "auto", responsiveLevels: [1400, 1366, 992, 480], gridwidth: [1400, 1366, 992, 480], gridheight: [900, 600, 550, 500], stopLoop: "on", stopAfterLoops: 0, stopAtSlide: 1, navigation: { arrows: { enable: !0, style: "arrow-icon", hide_onleave: !1 }, bullets: { enable: !1, style: "hesperiden", hide_onleave: !1, h_align: "center", v_align: "bottom", h_offset: 0, v_offset: 20, space: 5 } } }) }(n), e(".kit-testimonial-carousel").slick({ autoplay: !1, autoplaySpeed: 3e3, dots: !0, arrows: !1, slidesToShow: 1, slidesToScroll: 1 }), e("#project-carousel").slick({ autoplay: !1, autoplaySpeed: 3e3, dots: !1, arrows: !0, slidesToShow: 1, slidesToScroll: 1 }), e("#brands").slick({ autoplay: !0, infinite: !0, arrows: !1, slidesToShow: 3, slidesToScroll: 1, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2, infinite: !0, dots: !1 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2, infinite: !0, dots: !1 } }, { breakpoint: 768, settings: { dots: !1, arrows: !1, autoplay: !0, slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1, dots: !1, autoplay: !0, autoplaySpeed: 3e3 } }] }), e("#image-carousel").slick({ infinite: !0, slidesToShow: 3, slidesToScroll: 1, arrows: !0, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2, infinite: !0, dots: !1 } }, { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: !0, arrows: !0, dots: !1 } }, { breakpoint: 768, settings: { dots: !1, arrows: !1, autoplay: !0, slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1, dots: !1, autoplay: !0, autoplaySpeed: 3e3 } }] }), e("#card").slick({ slidesToShow: 4, slidesToScroll: 4, arrows: !1, dots: !0, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4, infinite: !0, dots: !0 } }, { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2, infinite: !0, dots: !0 } }, { breakpoint: 768, settings: { dots: !0, arrows: !1, autoplay: !0, slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1, dots: !1, autoplay: !0, autoplaySpeed: 2e3 } }] }), e("#testimonial").slick({ slidesToShow: 2, slidesToScroll: 2, arrows: !1, dots: !0, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: !0, dots: !1 } }, { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2, infinite: !0, dots: !1 } }, { breakpoint: 768, settings: { dots: !1, arrows: !1, autoplay: !0, slidesToShow: 1, slidesToScroll: 1 } }, { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1, dots: !1, autoplay: !0, autoplaySpeed: 3e3 } }] }), e(".slick_brands").slick({ infinite: !0, slidesToShow: 4, autoplay: !0, slidesToScroll: 1, dots: !1, arrows: !1, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2, infinite: !0, dots: !1 } }, { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: !0, dots: !1 } }, { breakpoint: 768, settings: { dots: !1, arrows: !1, autoplay: !0, slidesToShow: 2, slidesToScroll: 2 } }, { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !1, dots: !1, autoplay: !0, autoplaySpeed: 3e3 } }] }), e(".event_carousel").slick({ infinite: !0, slidesToShow: 1, slidesToScroll: 1, arrows: !1, fade: !0, autoplay: !0, autoplaySpeed: 3e3 }), e(".progress-bar").each(function() {
        e('[data-toggle="tooltip"]').tooltip({ trigger: "manual" }).tooltip("show");
        var o = e(this).attr("aria-valuenow");
        e(this).width(o + "%")
    });
    var r = e(".circle1"),
        d = !1;
    r.appear({ force_process: !0 }), r.on("appear", function() { d || (r.circleProgress({ size: 150 }), d = !0) }), e(".video-box i").on("click", function() {
        e(".hide").css("display", "none");
        var o = '<iframe class="embed-responsive-item"  allowfullscreen src="' + e(this).attr("data-video") + '"></iframe>';
        e(this).replaceWith(o)
    }), e(".select-drop").selectbox(), e(".box-video").click(function() { e("iframe", this)[0].src += "&amp;autoplay=1", e(this).addClass("open") }), e(".simple_timer").syotimer({ year: 2018, month: 5, day: 9, hour: 20, minute: 30 }), e(".counter").counterUp({ delay: 10, time: 2e3 }), e("#googleMap").length && google.maps.event.addDomListener(window, "load", i);
    var c = e(".portfolio_grid");
    c.length && (c.isotope({ itemSelector: ".element", layoutMode: "fitRows" }), e("#filters .button").on("click", function() { e("#filters .button").removeClass("active"), e(this).addClass("active"); var o = e(this).attr("data-filter"); return e(".portfolio_grid").isotope({ filter: o }), !1 })), e(".quick_view").fancybox({
        baseClass: "quick-view-container",
        infobar: !1,
        buttons: !1,
        thumbs: !1,
        margin: 0,
        touch: { vertical: !1 },
        animationEffect: !1,
        transitionEffect: "slide",
        transitionDuration: 500,
        baseTpl: '<div class="fancybox-container" role="dialog"><div class="quick-view-content"><div class="quick-view-carousel"><div class="fancybox-stage"></div></div><div class="quick-view-aside"></div><button data-fancybox-close class="quick-view-close">X</button></div></div>',
        onInit: function(o) {
            for (var s = '<ul class="quick-view-bullets">', i = 0; i < o.group.length; i++) s += '<li><a data-index="' + i + '" href="javascript:;"><span>' + (i + 1) + "</span></a></li>";
            s += "</ul>", e(s).on("click touchstart", "a", function() {
                var o = e(this).data("index");
                e.fancybox.getInstance(function() { this.jumpTo(o) })
            }).appendTo(o.$refs.container.find(".quick-view-carousel"));
            var t = o.group[o.currIndex].opts.$orig,
                a = t.data("qw-form");
            o.$refs.container.find(".quick-view-aside").append(e("#" + a).clone(!0).removeClass("hidden"))
        },
        beforeShow: function(e) { e.$refs.container.find(".quick-view-bullets").children().removeClass("active").eq(e.currIndex).addClass("active") }
    })
}(jQuery);