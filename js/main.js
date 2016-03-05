/* ======= Model ======= */

/* Requires at least 5 locations
- Old Street Market
- Old Street Underground
- Post Office
- The Fountain
- Office (The Space)
*/

// var API-key = "AIzaSyB5dcV4TdEim2ulfYwsN5jHZi-KsHA7UbI";
// var searchAPI-key = "AIzaSyC34G-7kGfJyqBIEi4wYC1aTFquoZyHnsI";

// var model {
// 	locations: [
//         {
//             name : 'Old Street Market',
//             address: '',
//             city: '', 
//             URL: '',
//             imgURL : '',

//         },
//         {
//             clickCount : 0,
//             name : 'Tiger',
//             imgSrc : 'img/cat2.jpg',
//             imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904'
//         },
//         {
//             clickCount : 0,
//             name : 'Scaredy',
//             imgSrc : 'img/cat3.jpg',
//             imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709'
//         },
//         {
//             clickCount : 0,
//             name : 'Shadow',
//             imgSrc : 'img/cat4.jpg',
//             imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559'
//         },
//         {
//             clickCount : 0,
//             name : 'Sleepy',
//             imgSrc : 'img/cat5.jpg',
//             imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288'
//         }
//     ]
// };



/* ======= ViewModel ======= */

// var ViewModel = {

// };



/* ======= View ======= */

// var listView = {

// };

// Generate Old Street Map
var mapOptions = {
    center: new google.maps.LatLng(51.524288,-0.096178),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map(document.getElementById('map'), mapOptions);

// Add Map Markers
var marker1Options = {
    position: new google.maps.LatLng(51.524288,-0.096178)
};

var marker1 = new google.maps.Marker(marker1Options);
marker1.setMap(map);

var infoWindowOptions = {
    content: 'Cohaesus Is Here!'
};

var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
google.maps.event.addListener(marker1,'click',function(e){
  
  infoWindow.open(map, marker1);
  
});


// Autocomplete
var acOptions = {
  types: ['establishment']
};

var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
autocomplete.bindTo('bounds',map);

var infoWindow = new google.maps.InfoWindow();

var marker = new google.maps.Marker({
  map: map
});

google.maps.event.addListener(autocomplete, 'place_changed', function() {
  infoWindow.close();
  var place = autocomplete.getPlace();
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }
  marker.setPosition(place.geometry.location);
  infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
  infoWindow.open(map, marker);
  google.maps.event.addListener(marker,'click',function(e){

    infoWindow.open(map, marker);

  });
});



