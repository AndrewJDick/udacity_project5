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

    init: function () {

        // Tell our views to initialise
        markerView.init();
        mapView.init();
    },

    // Retrieves the locations object, containing all hard-coded markers
    getMarkers: function () {
        return model.locations;
    },

    filter: function () {
        var self = this;

        var locations = viewModel.getMarkers();

        // Stores our model objects in an observable array
        this.items = ko.observableArray(locations);

        // Track the user input of the search box (empty by default)
        this.currentSearch = ko.observable('');

        function matchesSearch(poi) {
            // Return anything that exists in the name or about properties of the list view that matches the search.
            var currentSearch = self.currentSearch();
            return poi.name.indexOf(currentSearch) >= 0 || poi.about.indexOf(currentSearch) >= 0;
        }

        // Since currentSearch is initially blank, the function will return all objects in the model, generating an <li><a><p> for each of them.
        this.filteredItems = ko.computed(function () {
            return self.items().filter(matchesSearch);
        });

        // a combined observable that will trigger its subscribers whenever either the search OR the items are updated
        this.searchAndItems = ko.computed(function () {
            return {
                currentSearch: self.currentSearch(),
                items: self.items().map(function (poi) {
                    return Object.assign({}, poi, {
                        visible: matchesSearch(poi)
                    });
                })
            };
        });
    }
};

ko.applyBindings(new viewModel.filter());


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

        // Retrieves map marker co-ords from the ViewModel
        var poi = viewModel.getMarkers();

        // var test = viewModel.searchAndItems.subscribe(function(searchAndItems) {
        //     console.log(searchAndItems.currentSearch);
        //     // in here, searchAndItems.currentSearch === currentSearch
        //      // and searchAndItems.items === items with `visible` set properly
        // });

        this.mapOldSt = {
            center: new google.maps.LatLng(51.524288, -0.096178),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Generates the map of Old Street
        this.mapElem = new google.maps.Map(document.getElementById('map'), this.mapOldSt);

        poi.forEach(function (location) {

            var markerOptions = {
                position: new google.maps.LatLng(location.lat, location.lng)
            };

            var marker = new google.maps.Marker(markerOptions);
            
            // Displays the marker if it appears in the search listings.
            marker.setMap(self.mapElem);

            // Adds an infowindow above the location when the marker is clicked
            google.maps.event.addListener(marker, 'click', function () {
                var markerInfoOptions = {content: location.about};
                var markerInfo = new google.maps.InfoWindow(markerInfoOptions);
                markerInfo.open(self.mapElem, marker);
            });
        });
    }
};

// make it go! Weeeeeeeeeeeeee!
viewModel.init();



