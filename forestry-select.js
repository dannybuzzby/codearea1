(function ($, Drupal) {

    Drupal.behaviors.forestrySelectBoc = {
        attach: function (context, settings) {


            // Both textfields processes

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


            // Selection and Deselection of options


            var selectAll = function(element){
                element.parents('.forestry-select-wrapper').find('.select-option-input').prop( "checked", true );
            };

            var deselectAll = function(element){
                element.parents('.forestry-select-wrapper').find('.select-option-input').prop( "checked", false );
            };

            $('.forestry-select-all', context).on('click',function () {
                selectAll($(this));
            });

            $('.forestry-select-all', context).on('keypress', function (e) {
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    selectAll($(this));
                }
            });

            $('.forestry-deselect-all', context).on('click',function () {
                deselectAll($(this));
            });

            $('.forestry-deselect-all', context).on('keypress', function (e) {
                if(e.which === 13 || e.which === 32){
                    e.preventDefault();
                    deselectAll($(this));
                }
            });



            // Close button functionality


            $(context).on('keypress', '.forestry-select-close-icon', function (e) {
                if (e.which === 13 || e.which === 32) {
                    var checkbox = $(this).parents('.forestry-select-outer-wrapper').find('.open-forestry-select-box');
                    checkbox.prop( "checked", false);
                    checkbox.focus();
                    e.preventDefault();
                    return false;
                }
            });


            // Enter key functionality

            $(context).on('keypress', '.open-forestry-select-box', function (e) {
                if (e.which === 13) {
                    var checkbox = $(this).parents('.forestry-select-outer-wrapper').find('.open-forestry-select-box');
                    checkbox.prop( "checked", true);
                    checkbox.focus();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        }
    };

})(jQuery, Drupal);
