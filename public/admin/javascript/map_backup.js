function initMap() {
  var map = new google.maps.Map(document.getElementById('myMap'), {
    center: {lat: 19.118532, lng: 72.905048},
    zoom: 14
  });
  var input = document.getElementById('address');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  autocomplete.setOptions({strictBounds:true});
}