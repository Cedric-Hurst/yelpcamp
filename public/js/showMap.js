const camp = JSON.parse(campCoords);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker({
color: "#DB8C15"
}).setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h5>${camp.title}</h5><p>${camp.location}</p>`)
)
.addTo(map);