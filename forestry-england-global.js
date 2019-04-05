(function ($, Drupal) {

    Drupal.behaviors.forestryBurgerMenu = {
        attach: function (context, settings) {

            jQuery.ui.autocomplete.prototype._resizeMenu = function () {
                var ul = this.menu.element;
                ul.outerWidth(this.element.outerWidth());
            }

            var burgerMenuBlock = $('.block-burgermenu'),
                overlay = $('.bm-overlay');

            var openMenu = function () {
                if (!burgerMenuBlock.hasClass('active')) {
                    overlay.addClass('active');
                    $('body').addClass('no-overflow');
                    burgerMenuBlock.addClass('active');
                    burgerMenuBlock.stop().animate({ opacity: 1 }, 300);
                }

                $('.hs-close').trigger('click');
            }

            var closeMenu = function () {
                if (burgerMenuBlock.hasClass('active')) {
                    overlay.removeClass('active');
                    $('body').removeClass('no-overflow');
                    burgerMenuBlock.removeClass('active');
                    burgerMenuBlock.stop().animate({ opacity: 0 }, 300);
                }
            }

            $(context).on('keypress', '.bm-open', function (e) {
                if (e.which == 13) {
                    openMenu();
                }
            });

            $(context).on('keypress', '.bm-close, .bm-overlay', function (e) {
                if (e.which == 13) {
                    closeMenu();
                }
            });

            $(context).on('click', '.bm-open', openMenu);

            $(context).on('click', '.bm-close, .bm-overlay', closeMenu);
            }
        };  


        Drupal.behaviors.forestryHeaderSearch = {
        attach: function (context, settings) {

        // Header search

        var headerSearchOverlay = $('.hs-overlay'),
            overlay = $('.bm-overlay');

        var headerSearchField = $('input.form-text:first', headerSearchOverlay);


        var openSearch = function () {
            if (!headerSearchOverlay.hasClass('active')) {
                headerSearchOverlay.addClass('active');
                overlay.addClass('active');
                headerSearchOverlay.stop().animate({ opacity: 1 }, 300);
                headerSearchField.focus();
            }
            $('.bm-close').trigger('click');
        }

        var closeSearch = function () {
            if (headerSearchOverlay.hasClass('active')) {
                headerSearchOverlay.removeClass('active');
                overlay.removeClass('active');
                headerSearchOverlay.stop().animate({ opacity: 0 }, 300);
            }
        }

        $(context).on('keypress', '.hs-open', function (e) {
            if (e.which == 13) {
                openSearch();
            }
        });

        $(context).on('keypress', '.hs-close, .bm-overlay', function (e) {
            if (e.which == 13) {
                closeSearch();
            }
        });

        $(context).on('click', '.hs-open', function(e){
            e.preventDefault();
            e.stopPropagation();
            openSearch();
        });

        $(context).on('click', '.hs-close, .bm-overlay', closeSearch);


        }
};

}) (jQuery, Drupal);