"use strict";

/* ======= Model ======= */

var model = {

    locations: [
        {
            name: 'Cohaesus Projects Ltd',
            lat: '51.524288',
            lng: '-0.096178',
            about: 'The office. You work here.'
        },
        {
            name: 'The Fountain',
            lat: '51.526938',
            lng: '-0.088713',
            about: 'Local pub. Good beer selection.'
        },
        {
            name: 'Old Street Market',
            lat: '51.523658',
            lng: '-0.093210',
            about: 'Great place for lunch.'
        },
        {
            name: 'Finsbury Leisure Centre',
            lat: '51.526212',
            lng: '-0.095253',
            about: 'Local gym / fitness centre.'
        },
        {
            name: 'Vibast Community Centre',
            lat: '51.525467',
            lng: '-0.092290',
            about: 'Conducts Salah'
        }
    ]
};



/* ======= ViewModel ======= */

var viewModel = {

    // Retrieves the locations object, containing all hard-coded markers
    getMarkers: function () {
        return model.locations;
    },

    init: function () {

        var self = this;

        // Retrieve the objects stored in the model and store them in the locations variable.
        var locations = this.getMarkers();

        // This will store our search results in an observable array via this.filteredItems.
        // For now we only initialise the observableArray. We will populate this.items with location data afterwards.
        this.items = ko.observableArray();

        // Track the user input of the search box (empty by default)
        this.currentSearch = ko.observable('');

        // Return anything in either locations.name or locations.about that matches the user's currentSearch.
        function matchesSearch(poi) {
            // RegExp uses self.currentSearch as the expression for searching, then uses the exec() method to test for a match in our declared string.
            // The 'i' modifier is used to perform case-insenstive matching.
            var searchResults = new RegExp(self.currentSearch(), 'i');
            return searchResults.exec(poi.name) || searchResults.exec(poi.about);
        }

        // Whenever a user updates the search bar, the computed function will re-run matchesSearch() to generate any matching locations.
        // This in turn will generate an <li> & <a> for each location via the forEach data-bind in index.html.
        this.filteredItems = ko.computed(function () {
            return self.items().filter(matchesSearch);
        });

        // Tell our views to initialise
        markerView.init();
        mapView.init();

        // Data is populated afterwards to trigger the filteredItems computed function for the first time.
        // If we populated where we initialised the array, no markers would appear until the user typed in the search bar (since subscribers of filteredItems would not be notified)
        this.items(locations);
    }
};

/* ======= View ======= */

var markerView = {

    init: function () {
        // store the DOM element for easy access later
        this.pointOfInterest = document.getElementById('poi-list');
    },

    render: function () {

    }    
};


var mapView = {

    init: function () {
        // Store the DOM element for later use
        this.mapElem = document.getElementById('map');

        // render the map view
        this.render();
    },

    render: function () {

        // Store the context of this for our forEach loop
        var self = this;

        // Sets the parameters for the map that will display when the user loads the page.
        this.mapOldSt = {
            center: new google.maps.LatLng(51.524288, -0.096178),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Generates the map of Old Street using the paramters set previously.
        this.mapElem = new google.maps.Map(document.getElementById('map'), this.mapOldSt);

        // Items stored in this array will display as a marker on the OldSt map.
        var markers = [];

        // The markers are now subscribed to the viewModel.filterItems computed observable.
        // Whenever the user makes any changes to currentSearch, the previous markers will be cleared and replaced with the new values of viewModel.items.
        // 'poi' in this case contains all objects returned when viewModel.filteredItems executes.
        viewModel.filteredItems.subscribe(function (poi) {

            // Remove existing markers from the OldSt map.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });

            // Add new markers.
            // The map() method creates a new array with the results of calling a provided function on every element in the poi array.
            markers = poi.map(self.plotMarkers); 
        });

        this.mapMarkers = function (location) {
            var markerOptions = {
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(location.lat, location.lng)
            };

            var marker = new google.maps.Marker(markerOptions);

            marker.name = location.name;

            return marker;
        };

        this.plotMarkers = function(location) {
            
            var marker = self.mapMarkers(location);

            // Displays the marker if it appears in the search listings.
            marker.setMap(self.mapElem);

            // Adds an infowindow above the location when the marker is clicked
            google.maps.event.addListener(marker, 'click', function () {
                self.toggleBounce(marker);
                self.infoWindow(location, marker);
            });

            return marker;
        };

        this.toggleBounce = function(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        };

        this.infoWindow = function(location, marker) {
            var markerInfoOptions = {content: location.about};
            var markerInfo = new google.maps.InfoWindow(markerInfoOptions);
            markerInfo.open(self.mapElem, marker);
        };

        this.listClick = function(location) {

            function findMarker(array, attr, value) {
                for(var i = 0; i < array.length; i += 1) {
                    if(array[i][attr] === value) {
                        return i;
                    }
                }
            }

            // This will loop through the markers array and try to match location.name with the name property of markers elements (set in mapView.mapMarkers).  
            var locateMapMarker = findMarker(markers, 'name', location.name);

            // Add the infoWindow and bounce animation to the respective map marker when the list <h4> is clicked.
            var marker = markers[locateMapMarker];
            self.toggleBounce(marker);
            self.infoWindow(location, marker);
        }; 
    }
};

// make it go! Weeeeeeeeeeeeee!
viewModel.init();
ko.applyBindings(viewModel);