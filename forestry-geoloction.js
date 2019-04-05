(function ($, Drupal) {

    Drupal.behaviors.triggerSubmitPlace = {
        attach: function (context, settings) {

            // $(".forestry-search-place", context).on("change paste keyup", function () {
            //     if(!$(this).val()){
            //         $(".forestry-search-place-submit", context).click();
            //     }
            // });

        }
    };


    Drupal.behaviors.triggerSubmitForest = {
        attach: function (context, settings) {

            var loaderElement = '<div class="loader-icon-wrapper" style="display:none" role="alert" aria-live="assertive"><img class="loader-icon" src="/themes/custom/forestry_england/dist/images/loader.svg" alt="loading" width="22px" height="22px"></div>';

            var autoCompleteOptions = {
                minLength: 0,
                select:function(event, ui) {
                    // submit the form on item selected.
                    $(".forestry-search-place-submit", context).click();
                },
                search: function(event, ui) {
                    $(this).parents('.input-outer-wrapper').find('.loader-icon-wrapper').show();
                    if(this.value != ""){
                        $(this).parents('.input-outer-wrapper').find('.clear-icon').show();
                    }else{
                        $(this).parents('.input-outer-wrapper').find('.clear-icon').hide();
                    }

                },
                response: function(event, ui) {
                    $(this).parents('.input-outer-wrapper').find('.loader-icon-wrapper').hide();
                },
                open: function() {
                    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                        $('.ui-autocomplete').off('menufocus hover mouseover');
                    }
                },
            };

            if(!$(".forestry-search-place").parents('.input-outer-wrapper').find('.loader-icon-wrapper').length){
                $(".forestry-search-place").parents('.input-outer-wrapper').append($(loaderElement));
            }

            if(!$(".forestry-search-forest").parents('.input-outer-wrapper').find('.loader-icon-wrapper').length){
                $(".forestry-search-forest").parents('.input-outer-wrapper').append($(loaderElement));
            }

            var clearIcon = $('.clear-icon', context);
            var clearTextInput = function(element){
                element.parents('.input-outer-wrapper').find('input').val('').autocomplete("search");
                element.hide();
            };

            clearIcon.on('click', function(){
                clearTextInput($(this));
            });


            $('.forestry-search-forest-wrapper .clear-icon', context).on('keypress', function (e) {
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    clearTextInput($(this));
                    $('.forestry-search-forest-wrapper input', context).focus();
                }
            });

            $('.forestry-search-place-wrapper .clear-icon', context).on('keypress', function (e) {
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    clearTextInput($(this));
                    $('.forestry-search-place-wrapper input', context).focus();
                }
            });

            $('.forestry-select-wrapper .forestry-select-close-icon .icon', context).on('keypress', function(evt) {
                if(evt.which === 13) {
                    $(this)[0].click();
                }
            });

            $('.forestry-select-wrapper .forestry-select-close-icon', context).on('keypress', function(evt) {
                if(evt.which === 32) {
                    evt.preventDefault();
                    $(this)[0].click();
                }
            });

            $('.forestry-select-all, .forestry-deselect-all', context).on('keypress', function(evt) {
                if(evt.which === 32) {
                    evt.preventDefault();
                    $(this)[0].click();
                }
            });

            // Escape key functionality

            $('.open-forestry-select-box, .forestry-select-wrapper', context).on('keyup', function (e) {
                if (e.keyCode === 27) {
                    var checkbox = $(this).parents('.forestry-select-outer-wrapper').find('.open-forestry-select-box');
                    checkbox.prop( "checked", false);
                    checkbox.focus();
                }
            });







            var searchPlaceInput = $(".forestry-search-place", context);
            var searchForestInput= $(".forestry-search-forest", context);

            searchPlaceInput.autocomplete(
                autoCompleteOptions
            );

            searchForestInput.autocomplete(
                autoCompleteOptions
            );

            if(searchPlaceInput.val()){
                searchPlaceInput.parents('.input-outer-wrapper').find('.clear-icon').show();
            }

            if(searchForestInput.val()){
                searchForestInput.parents('.input-outer-wrapper').find('.clear-icon').show();
            }
        }
    };

    Drupal.behaviors.clearPlaceSearch = {
        attach: function (context, settings) {
            $( ".forestry-search-forest", context).on( "autocompleteselect", function( event, ui ) {
                // Reset place search to empty to avoid confusion processing submit.
                $(this).val(ui.item.value);
                $( ".forestry-search-place", context).val('');
            });
        }
    };

    Drupal.behaviors.clearForestSearch = {
        attach: function (context, settings) {
            $( ".forestry-search-place", context).on( "autocompleteselect", function( event, ui ) {
                // Add a class to form item
                $(this).addClass('autocomplete-item-selected');
                $(this).val(ui.item.value);
                // Set hidden form element value to the place id
                $('#selected-place').val(ui.item.placeId);
                // Reset place search to empty to avoid confusion processing submit.
                $( ".forestry-search-forest", context).val('');
            });
        }
    };


    Drupal.behaviors.showAsMap = {
        attach: function (context, settings) {
            // Trigger submit on change.
            $("#edit-map-view").change(function(){
                // submit the form on item selected.
                $(".forestry-search-place-submit", context).click();
            });
        }
    };

})(jQuery, Drupal);