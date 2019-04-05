(function ($, Drupal) {

    Drupal.behaviors.visitorInformation = {
        attach: function (context, settings) {

            var viBlock = $('.vi-btn-block'),
                viOverlay  = $('.vi-overlay');
            


            var openVIOverlay = function(){
                if(!viOverlay.hasClass('active')){
                    viOverlay.addClass('active');
                    viBlock.addClass('active');
                    $('body').addClass('no-overflow');
                    $('.vi-overlay-link').blur();
                    $('.vi-overlay-row-menu-list li:first-of-type').focus();
                }

                if($('.vi-overlay-row-header').is(":visible")){
                    $('.vi-overlay-row-menu-list li:first-of-type', context).trigger('click');
                }

            };

            var closeVIOverlay = function(){
                if(viOverlay.hasClass('active')){
                    viOverlay.removeClass('active');
                    viBlock.removeClass('active');
                    $('body').removeClass('no-overflow');
                    $(".vi-overlay-row-menu-list li:first-of-type").focus();
                    $(".vi-overlay-link").focus();
                }
                closeSmallOverlay();
            };

            var clickOption = function(e){

                var clickedElement = $(e.target);

                if(!$(e.target).is('li')){
                    clickedElement = $(e.target).parents('.vi-overlay-row-menu-list li');
                }

                var container = $('.vi-content-' + $(clickedElement).attr("data-target"));
                closeSmallOverlay();

                if($('.vi-content-' + $(this).attr("data-target") + '.active').length === 0){
                    $('.vi-overlay-row-menu-list li').removeClass('active');
                    $('.vi-content').removeClass('active');
                    $('.vi-content').stop().animate({opacity: 0}, 0);
                    if(!container.hasClass('active')){
                        clickedElement.addClass('active');
                        $(this).addClass('active');
                        container.addClass('active');
                        container.stop().animate({opacity: 1}, 0);
                    } else {
                        $(this).removeClass('active');
                        container.removeClass('active');
                        clickedElement.removeClass('active');
                    }
                }
            };


            var closeSmallOverlay = function() {
                $('.vi-overlay-row-menu-list li').removeClass('active');
                $('.vi-content').removeClass('active');
                $('.vi-content').stop().animate({opacity: 0}, 0);
            };





            $(context).on('click', '.vi-btn-block:not(.active)', openVIOverlay);

            $(context).on('click', '.vi-btn-close, .vi-overlay-row-close', closeVIOverlay);

            $(context).on('click', '.vi-content-header-close', closeSmallOverlay);

            $(context).on('click', '.vi-overlay-row-menu-list li', clickOption);







            $('.vi-overlay',context).on('keyup',function(e) {
                if (e.keyCode === 27) {
                    closeVIOverlay();
                }
            });

            $('.vi-overlay-row-menu-list li', context).on('keypress', function(e) {
                if (e.which === 13) {
                    clickOption(e);
                }
            });

            $('.vi-overlay-row-menu-list li', context).on('keypress', function(e) {
                if (e.which === 32) {
                    e.preventDefault();
                    clickOption(e);
                }
            });

            $('.vi-content-header-close', context).on('keypress', function(e) {
                if (e.which === 13 || e.which === 32) {
                    e.preventDefault();
                    closeVIOverlay();
                    var target = $(e.target).data("target");
                    $('.vi-overlay-row-menu-list li[data-target="' + target + '"]').focus();
                }
            });

            $('.vi-content-header-close', context).on('click', function(e) {
                var target = $(e.target).data("target");
                $('.vi-overlay-row-menu-list li[data-target="' + target + '"]').focus();
            });

        }
    };

})(jQuery, Drupal);
