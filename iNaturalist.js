(function ($, Drupal) {

    Drupal.behaviors.inaturalist = {
        // iNaturalist Endpoint URLs.
        apiBaseUrl: 'https://api.inaturalist.org/v1',
        kmlBaseUrl: 'https://www.inaturalist.org/observations/project',

        /**
         * Behaviour attachment point. Called by Drupal core.
         */
        attach: function (context, settings) {
            try {
                // Find all the inaturalist projects.
                $('div[data-inaturalist-project]', context).each(function() {
                    var container = $(this);

                    // Fetch the project ID
                    var projectId = container.data('inaturalist-project');
                    if (!projectId) {
                        return;
                    }

                    // Lookup the project data through the iNaturalist API.
                    var projectUrl = Drupal.behaviors.inaturalist.apiBaseUrl + '/projects/' + projectId;
                    $.getJSON(projectUrl, '', function(response) {
                        Drupal.behaviors.inaturalist.processProject(container, response);
                    });
                });
            }
            catch (e) { }
        },

        /**
         * Callback for processing project data loaded via the iNaturalist API.
         *
         * @param container
         *   A jQuery object representing the element which should contain the iNaturalist content.
         *
         * @param response
         *   A JSON object containing the loaded project data from the iNaturalist API.
         */
        processProject: function(container, response) {
            // Confirm we have a valid result set.
            if (!response || response.total_results < 1 || !response.results[0]) {
                return;
            }
            // The iNaturalist project data.
            var project = response.results[0];

            // Create the map display.
            var map = this.createMap(container);

            // Load the project stats.
            this.processData(container, project, map);
        },

        /**
         * Process the project statistics and attach KML layers.
         *
         * @param container
         *   A jQuery object representing the element which should contain the iNaturalist content.
         *
         * @param project
         *   The project data. Stats will be added to this object.
         *
         * @param map
         *   An instantiated Google maps object which will receive the KML data layer.
         */
        processData: function(container, project, map) {
            project.stats = project.stats || {}

            // Process the tabs. Each tab has an endpoint and title data attribute.
            var tabs = $('.component-inaturalist__tabs > .component-inaturalist__tab', container);
            tabs.each(function() {
                // Load the API endpoint.
                var tab = $(this);
                var endpoint = Drupal.behaviors.inaturalist.apiBaseUrl + '/' + tab.data('endpoint') + '?per_page=0&project_id=' + project.id;
                $.getJSON(endpoint, '', function(response) {
                    // Confirm we have a valid result set.
                    if (!response || response.total_results < 1) {
                        return;
                    }

                    var title = tab.data('title');
                    var index = title.toLowerCase();
                    project.stats[index] = response.total_results;
                    // We need the number of observations so we can attach the appropriate KML layers.
                    if (index === 'observations' && !project.kmlLoaded) {
                        // Attach KML data.
                        Drupal.behaviors.inaturalist.attachProjectKml(container, project.id, project.stats[index], map);
                        project.kmlLoaded = true;
                    }
                    // Replace the tab content with the project data.
                    tab[0].innerHTML = '';
                    tab.append('<div class="component-inaturalist__tab-value">' + project.stats[index] + '</div>');
                    tab.append('<h2 class="component-inaturalist__tab-title">' + title + '</h2>');
                });
            });
        },

        /**
         * Callback for opening an info window and displaying observation data.
         *
         * @param container
         *   A jQuery object representing the element which should contain the iNaturalist content.
         *
         * @param observation
         *   The observation data to render in the info window.
         */
        infoOpenListener: function(container, observation) {
            var infoElement = $('.component-inaturalist__info:first', container);
            var content = '';

            content += '<h2>' + observation.name + '</h2>';

            if (observation.description) {
                content += observation.description;
            }

            infoElement.css("display", "block");
            infoElement.html('').fadeIn(5);
            infoElement.css("left", "-500px");
            infoElement.html(content).animate({left: '0px'}, 400, "swing");

            // Create a close button for hiding the info window.

            if (content) {
                var close = $('<a href="#" class="component-inaturalist__close" tabindex="0">Close</a>');
                close.on('click keypress', this.infoCloseListener);
                infoElement.append(close);
            }
        },



        /**
         * Callback for closing the info window.
         *
         * @param event
         *   The triggered event.
         */
        infoCloseListener: function(event) {
            var infoElement = $(event.target).parent();

            // Respond to Enter / Space / Mouse-click

            if (event.which === 13 || event.which === 32 || event.which === 1 || !event.which) {

                // Clear the content from the parent container.

                infoElement.animate({left: '-500px'}, 400, "swing");
                infoElement.fadeOut(5);
                return false;
            }
        },

        /**
         * Helper function to create a Google map
         *
         * @param container
         *   A jQuery object representing the element which should contain the iNaturalist content.
         *
         * @returns {*}
         *   An instantiated Google maps object.
         */
        createMap: function(container) {
            // Find the map container.
            var mapElement = $('.component-inaturalist__map:first', container);

            // Create the Google map.
            return new google.maps.Map(mapElement[0], {
                center: new google.maps.LatLng(52.4814, -1.89983),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        },

        /**
         * Fetch the project data as KML and attach it to a Google Map as a KML data layer.
         *
         * @param container
         *   A jQuery object representing the element which should contain the iNaturalist content.
         *
         * @param projectId
         *   The project ID number.
         *
         * @param observationCount
         *   The total number of observations to be loaded.
         *
         * @param map
         *   An instantiated Google maps object which will receive the KML data layer.
         */
        attachProjectKml: function(container, projectId, observationCount, map) {
            // iNaturalist supports up to 200 results per page so we need to split results
            var per_page = 200;
            for (var i = 0; i < Math.ceil((observationCount * 1.0) / per_page); i++) {
                // Fix loop variable scoping with an anonymous function: i => page.
                (function(page) {
                    // Stagger loading of layers.
                    setTimeout(function() {
                        // Load the KML data from iNaturalist.
                        var kmlUrl = Drupal.behaviors.inaturalist.kmlBaseUrl + '/' + projectId + '.kml?per_page=' + per_page + '&page=' + page;
                        Drupal.behaviors.inaturalist.attachKmlLayer(container, kmlUrl, map);
                    }, 100 * page);
                })(i);
            }
        },

        attachKmlLayer: function(container, kmlUrl, map) {
            var kmlLayer = new google.maps.KmlLayer(kmlUrl, {
                suppressInfoWindows: true,
                preserveViewport: false,
                map: map,
            });

            // Add an event listener so we can display observation data.
            kmlLayer.addListener('click', function (event) {
                if (event.featureData) {
                    Drupal.behaviors.inaturalist.infoOpenListener(container, event.featureData);
                }
            });
        }
    };

})(jQuery, Drupal);
