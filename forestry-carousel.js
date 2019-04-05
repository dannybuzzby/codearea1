var forestryCarousel = (function ($, Drupal) {
    'use strict';

    var slider;
    var slideId;
    var namespace;

    var setup = function(context, sid, itemsPerPage, duration){

        var c = $(sid, context); //container
        slideId = sid;
        namespace = 'slider'+slideId;
        duration = duration ? duration : 300;

        if(c.length > 0 && !c.hasClass('forestry-carousel-init')){

            c.addClass('forestry-carousel-init');
            var slideWrapper = c.find('.slide-container'); //slides
            var slideCount = slideWrapper.length; // number of slides
            // show the next slides (progressive enhancement)
            slideWrapper.css("display","");


            var getPageCount = function(){
                if (typeof itemsPerPage === 'number') {
                    return slideCount - (itemsPerPage-1);
                }
                else if (typeof itemsPerPage === 'object') {
                    var pages = slideCount;
                    for (var viewport in itemsPerPage) {
                        if (window.innerWidth >= viewport) {
                            pages =   slideCount - (itemsPerPage[viewport]-1);
                        }
                    }
                    return pages;
                }
            };


            var initButtons = function(){
                // Show buttons if more than one slide
                if (getPageCount()>1 && $(slideId).hasClass('forestry-carousel-init')) {
                    // Check if this already loaded.
                    c.find('.controllers').css("display","");
                    disabledButtonCheck();
                } else{
                    c.find('.controllers').css("display","none");
                }
            };


            var disabledButtonCheck = function(){

                if(typeof slider !== 'undefined'){
                    c.find('.sl-previous, .sl-next').removeClass('disabled');

                    if(slider.currentSlide === 0){
                        c.find('.sl-previous').addClass('disabled');
                    }

                    if(slider.currentSlide === getPageCount()-1){
                        c.find('.sl-next').addClass('disabled');
                    }
                }
                else{
                    c.find('.sl-previous').addClass('disabled');
                }
            };

            if (getPageCount()>1 && $(slideId).hasClass('forestry-carousel-init')) {
                slider = new Siema({
                    selector: sid + ' .slider-inner',
                    duration: duration,
                    easing: 'linear',
                    perPage: itemsPerPage,
                    onInit: initButtons,
                    onChange: disabledButtonCheck
                });
            }


            $(window).on('resize.'+namespace, initButtons);

            slideWrapper.parent().addClass('fac-slide-parent-container');
            var parentContainer = $(c.find('.fac-slide-parent-container').parent()[0]);
            parentContainer.addClass('fac-slides-main-wrapper');

            var isDragging = false;
            var startingPos = [];
            var offset = 4;

            parentContainer.find('a').on('mousedown.' + namespace, function (evt) {
                isDragging = false;
                startingPos = [evt.pageX, evt.pageY];
            })

            .on('mousemove.' + namespace, function (evt) {
                isDragging = Math.abs(evt.pageX - startingPos[0]) > offset ||
                    Math.abs(evt.pageY - startingPos[1]) > offset;
            })
            .on('mouseup.' + namespace, function (evt) {
                if (!isDragging) {
                    window.location = $(this).attr("href");
                }
                isDragging = false;
                startingPos = [];
            })
            .on('click.' + namespace, function (evt) {
                evt.preventDefault();
            });


            $(sid+' .sl-previous', context).on('click.'+namespace, function () {
                slider.prev();
            });

            $(sid+' .sl-next', context).on('click.'+namespace, function () {
                slider.next();
            });

            $(sid+' .sl-previous', context).on('keypress.'+namespace, function (e) {
                if(e.which === 13){
                    slider.prev();
                }
            });

            $(sid+' .sl-next', context).on('keypress.'+namespace, function (e) {
                if(e.which === 13){
                    slider.next();
                }
            });

            $('.fac-info-wrapper .fac-info-link a').attr( 'tabIndex', 0 );

            $('.fac-slide-parent-container .fac-container', context).on('keyup', function(e) {
                if(e.keyCode === 39){
                    e.preventDefault();
                    //$('.field-hero-carousel .sl-next .icon_generic-chevron-right')[0].click();
                    slider.next();
                    var sliderid = slider.currentSlide;
                    console.log(sliderid);
                    //$(this).parent('.fac-slides-main-wrapper')[id].focus();
                    //console.log($(this));
                    //$(this)[sliderid].focus();
                }
            });

            $('.fac-slide-parent-container .fac-container', context).on('keyup', function(e) {
                if(e.keyCode === 37){
                    e.preventDefault();
                    //$('.field-hero-carousel .sl-previous .icon_generic-chevron-left')[0].click();
                    slider.prev();
                    var sliderid = slider.currentSlide;
                    console.log(sliderid);
                    //$(this).parent('.fac-slides-main-wrapper')[id].focus();
                    //console.log($(this));
                    //$(this)[sliderid].focus();
                }
            });
        }

    };

    var destroy = function(){
        if(slider){
            slider.destroy(true);
            slider = null;
            $(slideId).removeClass('forestry-carousel-init');
            $(window).off("resize."+namespace);
            $('body').off("click."+namespace);
        }
    };

    return {
        setup: setup,
        destroy: destroy,
    };



});