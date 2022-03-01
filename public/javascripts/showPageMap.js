mapboxgl.accessToken = 'pk.eyJ1Ijoic291bWlrc2Fya2FyMTIiLCJhIjoiY2wwMm9mNzRnMDFkdTNjbzN1NHJ6dDV2aCJ9.DF4JnhFnfYuui2e5V8pFig';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10', 
center: gym.geometry.coordinates, 
zoom: 7 
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(gym.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${gym.title}</h3><p>${gym.location}</p>`
    )
)
.addTo(map)