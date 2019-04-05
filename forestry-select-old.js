(function ($, Drupal) {

    Drupal.behaviors.forestrySelectBoc = {
        attach: function (context, settings) {

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
                if(e.which == 13){
                    selectAll($(this));
                }
            });

            $('.forestry-deselect-all', context).on('click',function () {
                deselectAll($(this));
            });

            $('.forestry-deselect-all', context).on('keypress', function (e) {
                if(e.which == 13){
                    deselectAll($(this));
                }
            });

            $('.open-forestry-select-box', context).on('change',function () {
                $('.open-forestry-select-box').not(this).prop( "checked", false );
            });

            $(context).on('keypress', '.forestry-select-button, .open-forestry-select-box, .forestry-select-option, .forestry-select-close-icon, .map-view-select', function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });
        }
    };

})(jQuery, Drupal);
