const toiletSearcher = document.getElementById('toiletSearch')
const toiletSubmitter = document.getElementById('toiletSubmit')
const toiletForm = document.getElementById('toiletForm')
const resultsDiv = document.getElementsByClassName('results')
const myLocation = document.getElementById('location')

document.addEventListener("DOMContentLoaded", function() {
  console.log("loaded")
  addAllListeners()
  getLocation()

})

function addAllListeners() {
  toiletForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let value = toiletSearcher.value
    value = value.charAt(0).toUpperCase() + value.slice(1)
    toiletSearcher.value = ""
    getToilets(value)
  })
}

function addLinkListeners() {
  let linkArray = Array.from(document.getElementsByClassName('link'))
  linkArray.forEach(link => link.addEventListener('click', e => {
    value = e.target.text
    searchValue = value.split(" ").join("+")
    console.log(searchValue)
    getDirections(e.target.text)
  }))
}

function getDirections(e) {

}



function getToilets(value) {
  fetch(`https://data.cityofnewyork.us/resource/r27e-u3sy.json?borough=${value}`)
    .then(res => res.json())
    .then(json => appendToilets(json));
}

function appendToilets(json){
  while (resultsDiv[0].firstChild) {
    resultsDiv[0].removeChild(resultsDiv[0].firstChild);
}

  const a = document.createElement('div')
  resultsDiv[0].appendChild(a)

  for(i = 0; i <= 10; i++){
    const b = document.createElement('div')
    b.setAttribute("id", `div${[i]}`)
    a.appendChild(b)

    b.innerHTML =
    `<p><strong><a href="#" class="link">${json[i]["name"]}</a></strong></p>
    <p>${json[i]["location"]}</p>
    <p>Open Year Around? ${json[i]["open_year_round"]}</p>`
  }
  addLinkListeners()
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMyLocation);
    } else {
        myLocation.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function showMyLocation(position){
  const [x, y] = [position.coords.latitude, position.coords.longitude]
  const a = document.createElement('div')
  geocodeLatLng(x, y)
  myLocation.appendChild(a)

  a.innerHTML=
  `<iframe
    width="600"
    height="450"
    frameborder="0"
    style="border:0"
    src="https://www.google.com/maps/embed/v1/search?key=AIzaSyAWnsetGgKObgID_mvXlbLLjS2ZgUwJips&q=${x},${y}&zoom=18"
    allowfullscreen>
  </iframe>`
}
// "https://www.google.com/maps/embed/v1/search?key=AIzaSyAWnsetGgKObgID_mvXlbLLjS2ZgUwJips&q=${x},${y}&zoom=18"
function initMap(){
  console.log("sup")
}

function geocodeLatLng(x, y) {

        var geocoder = new google.maps.Geocoder;
        var input = `${x}, ${y}`
        var latlngStr = input.split(',', 2);
        var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
          const boroughResults = results[0].address_components[3].long_name
          getToilets(boroughResults)
          // if (status === 'OK') {
          //   if (results[0]) {
          //     map.setZoom(11);
          //     var marker = new google.maps.Marker({
          //       position: latlng,
          //       map: map
          //     });
          //     infowindow.setContent(results[0].formatted_address);
          //     infowindow.open(map, marker);
          //   } else {
          //     window.alert('No results found');
          //   }
          // } else {
          //   window.alert('Geocoder failed due to: ' + status);
          // }
        });
      }
