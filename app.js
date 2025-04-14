// Initialize the map
const map = L.map('map').setView([-23.5505, -46.6333], 13); // Default to São Paulo

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Initialize variables
let drawnPolygon;
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Add drawing control
const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: {
            allowIntersection: false, // Restrict to simple shapes
            showArea: true
        },
        rectangle: false,
        circle: false,
        marker: false,
        polyline: false
    }
});
map.addControl(drawControl);

// Handle polygon drawing
map.on(L.Draw.Event.CREATED, function (event) {
    drawnPolygon = event.layer;
    drawnItems.addLayer(drawnPolygon);
});

// Check if point is inside polygon
function isPointInPolygon(lat, lng) {
    const point = L.latLng(lat, lng);
    return drawnPolygon.getLatLngs()[0].some(latlng => latlng.equals(point));
}

// Handle check location button
document.getElementById('check-location').addEventListener('click', function () {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
    
    if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid coordinates.');
        return;
    }

    if (drawnPolygon) {
        const inside = isPointInPolygon(lat, lng);
        const statusDiv = document.getElementById('status');
        if (inside) {
            statusDiv.innerHTML = 'The point is inside the polygon.';
            L.marker([lat, lng]).addTo(map).bindPopup('Inside').openPopup();
        } else {
            statusDiv.innerHTML = 'The point is outside the polygon.';
            L.marker([lat, lng]).addTo(map).bindPopup('Outside').openPopup();
        }
    } else {
        alert('Please draw a polygon first.');
    }
});

// Handle draw polygon button
document.getElementById('draw-polygon').addEventListener('click', function () {
    map.addControl(drawControl);
});
