"use strict";

/* ======= Model ======= */

var model = {

    locations: [
        {
            name: 'Cohaesus Projects Ltd',
            lat: '51.524288',
            lng: '-0.096178',
            about: 'The office. You work here.',
        },
        {
            name: 'The Fountain',
            lat: '51.526938',
            lng: '-0.088713',
            about: 'Local pub. Good beer selection.',
        },
        {
            name: 'Old Street Market',
            lat: '51.523658',
            lng: '-0.093210',
            about: 'Great place for lunch.',
        },
        {
            name: 'Finsbury Leisure Centre',
            lat: '51.526212',
            lng: '-0.095253',
            about: 'Local gym / fitness centre.',
        },
        {
            name: 'Vibast Community Centre',
            lat: '51.525467',
            lng: '-0.092290',
            about: 'Conducts Salah',
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

        var locations = this.getMarkers();

        // Stores our model objects in an observable array
        this.items = ko.observableArray();

        // Track the user input of the search box (empty by default)
        this.currentSearch = ko.observable('');

        function matchesSearch(poi) {            
            // Return anything that exists in the name or about properties of the list view that matches the currentSearch.
            // RegExp uses the currentSearch as the expression for searching, then uses the exec() method to test for a match in our declared string.
            // the 'i' modifier is used to perform case-insenstive matching
            var searchRe = RegExp(self.currentSearch(), 'i');
            return searchRe.exec(poi.name) || searchRe.exec(poi.about)
        }

        // Since markerView.render is subscribed to the computed observable, it will return all  
        this.filteredItems = ko.computed(function () {
            return self.items().filter(matchesSearch);
        });

        this.currentSearch.notifySubscribers();

        // Tell our views to initialise
        markerView.init();
        mapView.init();
        this.items(locations);

    }
};

/* ======= View ======= */

var markerView = {

    init: function () {
        // store the DOM element for easy access later
        this.pointOfInterest = document.getElementById('poi-list');
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

        this.mapOldSt = {
            center: new google.maps.LatLng(51.524288, -0.096178),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Generates the map of Old Street
        this.mapElem = new google.maps.Map(document.getElementById('map'), this.mapOldSt);

        var markers = [];

        // The markers are now subscribed to the filterItems computed observable.
        // Whenever the user makes any changes to currentSearch, the markers will initially be removed, then re-added based on 
        viewModel.filteredItems.subscribe(function (poi) {
        
            // remove existing markers
            markers.forEach(function (marker) {
            marker.setMap(null);
            });
                    
            // add new ones
            // The map() method creates a new array with the results of calling a provided function on every element in this array.
            markers = poi.map(function (location) {

                var markerOptions = {
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(location.lat, location.lng)
                };

                var marker = new google.maps.Marker(markerOptions);

                // Displays the marker if it appears in the search listings.
                marker.setMap(self.mapElem);

                // Adds an infowindow above the location when the marker is clicked
                google.maps.event.addListener(marker, 'click', function () {
                    toggleBounce();
                    var markerInfoOptions = {content: location.about};
                    var markerInfo = new google.maps.InfoWindow(markerInfoOptions);
                    markerInfo.open(self.mapElem, marker);
                });

                // Staionary markers bounce when clicked, where bouncing animations will become inert.
                function toggleBounce() {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }
                
                return marker;
            });
        });
    }
};

// make it go! Weeeeeeeeeeeeee!
viewModel.init();
ko.applyBindings(viewModel);