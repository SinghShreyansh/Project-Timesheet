function initMap() {
  var map;
  var marker;
  var myLatlng = new google.maps.LatLng();
  var geocoder = new google.maps.Geocoder();
  var markerIcon = {
    path: 'M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0',
    strokeOpacity: 0,
    strokeWeight: 1,
    fillColor: '#274abb',
    fillOpacity: 1,
    rotation: 0,
    scale: 1,
    anchor: new google.maps.Point(19, 50)
  }

  var mapOptions = {
    zoom: 18,
    center: {lat: 19.118532, lng: 72.905048},
  };
  // var map = new google.maps.Map(document.getElementById('map'), {
  //   center: {lat: -33.8688, lng: 151.2195},
  //   zoom: 13
  // });

  map = new google.maps.Map(document.getElementById("myMap"), mapOptions);

  var input = document.getElementById('address');
  var latInput = document.getElementById('latitude');
  var lngInput = document.getElementById('longitude');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  // autocomplete.setOptions({strictBounds: true});


  marker = new google.maps.Marker({
    map: map,
    position: myLatlng,
    icon: markerIcon,
    draggable: true
  });

  autocomplete.addListener('place_changed', function () {
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();


    // if someone hits the enter on the address field, dont submit the form
    $("#address").keypress(function (e) {
      // alert('hey');
      if (e.which === 13) {
        return false;
      }
    });

    $("#btn-submit").keypress(function (e) {
      // alert('hey');
      if (e.which === 13) {
        return false;
      }
    });

    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

  });

}
google.maps.event.addDomListener(window, 'load', initialize);