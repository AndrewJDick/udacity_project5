/* ======= Model ======= */

var model = {
	locations: [
        {
            name : 'Cohaesus Projects Ltd',
            lat: '51.524288',
            lon: '-0.096178', 
        },
        {
            name : 'The Fountain',
            lat: '51.526938',
            lon: '-0.088713', 
        },
        {
            name : 'Old Street Market',
            lat: '51.523658',
            lon: '-0.093210', 
        },
        {
            name : 'Finsbury Leisure Centre',
            lat: '51.526212',
            lon: '-0.095253', 
        },
        {
            name : 'Vibast Community Centre',
            lat: '51.525467',
            lon: '-0.092290', 
        },
    ]
};



/* ======= ViewModel ======= */

var viewModel = {
	init: function() {

		// Tell our views to initialise
		markerView.init();
		// mapView.init();
	},
	

	// Retrieves the locations object, containing all hard-coded markers
	getMarkers: function() {
		return model.locations;
    }
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
        var poi, elem, i;
        // get the marker locations we'll be rendering from the viewModel
        var poi = viewModel.getMarkers();

        // empty the marker list
        this.pointOfInterest.innerHTML = '';

        // loop over the marker locations
        for (i = 0; i < poi.length; i++) {
        	// this is the location we're currently looping over
            var location = poi[i];
         	console.log(location);
      	
			// make a new location list item and set its text
        	elem = document.createElement('li');
        	elem.textContent = location.name;
        	console.log(elem);

        	// finally, add the element to the list
        	this.pointOfInterest.appendChild(elem);
        	console.log(elem);
        }
    }
};


// var mapView = {

// };


// make it go!
viewModel.init();


// // Generate Old Street Map

// var map = new google.maps.Map(document.getElementById('map'), mapOptions);

// // Add Map Markers
// var marker1Options = {
//     position: new google.maps.LatLng(51.524288,-0.096178)
// };

// var marker1 = new google.maps.Marker(marker1Options);
// marker1.setMap(map);

// var infoWindowOptions = {
//     content: 'Cohaesus Is Here!'
// };

// var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
// google.maps.event.addListener(marker1,'click',function(e){
  
//   infoWindow.open(map, marker1);
  
// });


// // Autocomplete
// var acOptions = {
//   types: ['establishment']
// };

// var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
// autocomplete.bindTo('bounds',map);

// var infoWindow = new google.maps.InfoWindow();

// var marker = new google.maps.Marker({
//   map: map
// });

// google.maps.event.addListener(autocomplete, 'place_changed', function() {
//   infoWindow.close();
//   var place = autocomplete.getPlace();
//   if (place.geometry.viewport) {
//     map.fitBounds(place.geometry.viewport);
//   } else {
//     map.setCenter(place.geometry.location);
//     map.setZoom(17);
//   }
//   marker.setPosition(place.geometry.location);
//   infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
//   infoWindow.open(map, marker);
//   google.maps.event.addListener(marker,'click',function(e){

//     infoWindow.open(map, marker);

//   });
// });



