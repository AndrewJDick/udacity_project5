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
        listView.init();
        mapView.init();

        // Data is populated afterwards to trigger the filteredItems computed function for the first time.
        // If we populated where we initialised the array, no markers would appear until the user typed in the search bar (since subscribers of filteredItems would not be notified)
        this.items(locations);
    }
};

/* ======= View ======= */

var listView = {

    init: function () {

        // render the list view
        this.render();
    },

    render: function () {

        this.listClick = function(location) {

            // Searches for a specified property in an array's elements.
            function findMarker(array, attr, value) {
                for(var i = 0; i < array.length; i += 1) {
                    if(array[i][attr] === value) {
                        return i;
                    }
                }
            }

            // This will loop through the markers array and try to match location.name with the name property of markers elements (set in mapView.mapMarkers).
            var locateMapMarker = findMarker(mapView.markers, 'name', location.name);

            // Add the infoWindow and bounce animation to the respective map marker when the list <h4> is clicked.
            var marker = mapView.markers[locateMapMarker];
            mapView.toggleBounce(marker);
            mapView.infoWindow(location, marker);
        };
    }
};


var mapView = {

    init: function () {
        
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
        this.markers = [];

        // The markers are now subscribed to the viewModel.filterItems computed observable.
        // Whenever the user makes any changes to currentSearch, the previous markers will be cleared and replaced with the new values of viewModel.items.
        // 'poi' in this case contains all objects returned when viewModel.filteredItems executes.
        viewModel.filteredItems.subscribe(function (poi) {

            // Remove all markers from the OldSt map.
            self.markers.forEach(function (marker) {
               marker.setMap(null);
            });

            // Add new markers.
            // The map() method creates a new array with the results of calling a provided function on every element in the poi array.
            self.markers = poi.map(self.plotMarkers);
        });

        // Creates a marker for each item in viewModel.items
        this.mapMarkers = function (location) {
            var markerOptions = {
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(location.lat, location.lng)
            };

            var marker = new google.maps.Marker(markerOptions);

            // the name property is added so that the list view can calculate which marker to display the infoWindow above.
            marker.name = location.name;

            return marker;
        };

        // Plots the generated markers on the Old St map
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

        // Makes the selected map marker bounce when it is selected in either the map or list view.
        this.toggleBounce = function(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                self.markers.forEach(function (foo) {
                    foo.setAnimation(null);
                });
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        };

        // Creates an infoWindow above the map marker
        this.infoWindow = function(location, marker) {

            var markerInfo, markerInfoOptions;

            // Asynchronous request using FourSquare's API to retrieve the address of each location. It is then bound to each marker's infoWindow.
            $.ajax({
                type: 'GET',
                url: 'https://api.foursquare.com/v2/venues/search?ll=' + location.lat + ',' + location.lng + '&client_id=WX4CJA0TCWQ3MW0BBZI4XR1QSMOBMUE3ZCUMQJDGQSY4NQSR&client_secret=J3PRLH35JLIHEUITLLKRTY1JWNZIR2LB50ODVXTUFKYRJJEG&v=20160317',
                data: {
                    format: 'json'
                },
                timeout: 5000, 
                error: function() {
                    alert('An error has occurred. Sorry about that!');
                },
                dataType: 'jsonp',
                success: function(streetName) {

                    var infoWindowStyle = '<h3>' + location.name + '</h3>'+
                                          '<div id="bodyContent">'+
                                          '<h4>' + streetName.response.venues[0].location.address + '</h4>'+
                                          '<p>' + location.about + '</p>'
                                          '</div>';

                    markerInfoOptions = {content: infoWindowStyle};
                    markerInfo = new google.maps.InfoWindow(markerInfoOptions);

                    markerInfo.open(self.mapElem, marker);
                }
            });
        };
    }
};

// make it go! Weeeeeeeeeeeeee!
function initApp() {
    viewModel.init();
    ko.applyBindings(viewModel);
}

// Error alert if Google Maps fails to load
function mapFail() {
    alert('Google Maps failed to load. Please contact Larry.');
}