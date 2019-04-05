(function ($, Drupal) {

    Drupal.behaviors.forestActivitiesReveal = {
        attach: function (context, settings) {

            var clickAction = function(){
                $('.alb-search-container-close').trigger('click');
                $(".alb-list", context).animate({
                    opacity: "toggle"
                }, "300");
                $('.alb-forest-search', context).toggleClass('faded');

            };


            $('.alb-dropdown-ui, .alb-list-close', context).on('click',function () {
                clickAction();
            });

            $('.alb-desktop-background .image-wrapper', context).on('click', function(){
                $(".alb-list", context).animate({
                    opacity: "hide"
                }, "300");
                $('.alb-forest-search', context).removeClass('faded');
            });


            $('.alb-dropdown-ui, .alb-list-close', context).on('keypress', function (e) {
                if(e.which === 13){
                    clickAction();
                    $('.alb-dropdown-ui-arrow', context).focus();
                }
            });


            $('.alb-list-activity a.alb-activity-item-link', context).on('keypress', function(evt) {
                if(evt.which === 32) {
                    evt.preventDefault();
                    $(this)[0].click();
                }
            });



            $('.alb-dropdown, .alb-list', context).on('keyup', function(e) {
                if (e.keyCode === 27) {
                    $(".alb-list").css("display", "none");
                    //$('.alb-search-select-ui', context).blur();
                    $('.alb-dropdown-ui-arrow', context).focus();
                }
            });

            $('.alb-search-forest, .forestry-search-place', context).on('keyup', function(evt) {
                if (evt.keyCode === 27) {
                    $(".alb-search-list").css("display", "none");
                    $(".alb-search-container").css("display", "none");
                    $(".alb-search-select-ui").css("display", "block");
                    $('.alb-search-select-ui', context).focus();
                }
            });

            $('.alb-list .alb-list-close-icon', context).on('keypress', function(e) {
                if (e.which === 32) {
                    e.preventDefault();
                    $(this)[0].click();
                    $('.alb-dropdown-ui-arrow', context).focus();
                }
            });

            $('.alb-search-list .alb-list-close-icon', context).on('keypress', function(e) {
                if (e.which === 32) {
                    e.preventDefault();
                    $(this)[0].click();
                    $('.alb-search-select-ui', context).focus();
                }
            });

            $('.alb-search-list .alb-list-close-icon', context).on('keypress', function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                    $(this)[0].click();
                    $('.alb-search-select-ui', context).focus();
                }
            });


        }
    };

})(jQuery, Drupal);
