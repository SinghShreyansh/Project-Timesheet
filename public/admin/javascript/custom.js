import Axios from "axios";

function fetchStores(lat = 18.98, lng = 72.84) {
  Axios.get(`/api/store/near?lat=${lat}&lng=${lng}`)
    .then(res => console.log(res));
}

fetchStores();