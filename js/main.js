/* ======= Model ======= */

var model = {

	locations: [
        {
            name : 'Cohaesus Projects Ltd',
            lat: '51.524288',
            lng: '-0.096178', 
            about: 'The office. You work here.',
            url: 'http://www.cohaesus.co.uk'
        },
        {
            name : 'The Fountain',
            lat: '51.526938',
            lng: '-0.088713', 
            about: 'Local pub. Good beer selection.',
            url: 'http://www.cohaesus.co.uk'
        },
        {
            name : 'Old Street Market',
            lat: '51.523658',
            lng: '-0.093210', 
            about: 'Great place for lunch.',
            url: 'http://www.cohaesus.co.uk'
        },
        {
            name : 'Finsbury Leisure Centre',
            lat: '51.526212',
            lng: '-0.095253', 
            about: 'Local gym / fitness centre.',
            url: 'http://www.cohaesus.co.uk'
        },
        {
            name : 'Vibast Community Centre',
            lat: '51.525467',
            lng: '-0.092290', 
            about: 'Conducts Salah',
            url: 'http://www.cohaesus.co.uk'
        },
    ]
};



/* ======= ViewModel ======= */

var viewModel = {

	init: function() {

		// Tell our views to initialise
		markerView.init();
		mapView.init();
	},

	// Retrieves the locations object, containing all hard-coded markers
	getMarkers: function() {
		return model.locations;
    },
};




/* ======= View ======= */

var markerView = {

	init: function() {
        // store the DOM element for easy access later
        this.pointOfInterest = document.getElementById('poi-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

	render: function() {
        var poi;
        
        // get the marker locations we'll be rendering from the viewModel
        var poi = viewModel.getMarkers();

        function filter(locations) {
			var self = this;

	    	this.items = ko.observableArray(locations);
	    	// Track the user input of the search box (empty by default)
	    	this.currentSearch = ko.observable('');

	    	// Since currentSearch is initially blank, the function will return all objects in the model, generating an <li><a><p> for each of them.
	    	this.filteredItems = ko.computed(function() {
	      	
	      		return self.items().filter(function(item) {

	        		return item.name.indexOf(self.currentSearch()) >= 0, item.about.indexOf(self.currentSearch()) >= 0;
	      		});
    		});
    	}

    	ko.applyBindings(new filter(poi));
    }
};



var mapView = {

	init: function() {
		// Store the DOM element for later use
		this.mapElem = document.getElementById('map');

		// render the map view
		this.render();
	},

	render: function() {

		var marker;

		// Store the context of this for our forEach loop
		var self = this;

		// Retrieves map marker co-ords from the ViewModel
		var poi = viewModel.getMarkers();

		this.mapOldSt = {
    		center: new google.maps.LatLng(51.524288,-0.096178),
    		zoom: 16,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		// Generates the map of Old Street
		this.mapElem = new google.maps.Map(document.getElementById('map'), this.mapOldSt);

		poi.forEach(function(location) {
			var markerOptions = {
		     	position: new google.maps.LatLng(location.lat,location.lng)
			};	

			var marker = new google.maps.Marker(markerOptions);
			marker.setMap(self.mapElem);

			google.maps.event.addListener(marker,'click',function(e) {
				var markerInfoOptions = { content: location.about };
				var markerInfo = new google.maps.InfoWindow(markerInfoOptions);
				markerInfo.open(self.mapElem, marker);
  			});
		});	
	}
};


// make it go! Weeeeeeeeeeeeee!
viewModel.init();



