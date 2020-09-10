// code for creating Basic Map (Level 1)
const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// Initialize Layer Groups
const layers = {
    earthquake: new L.LayerGroup()
};

// Create the map with our layers
const map = L.map("map", {
    center: [36.5, -117.5],
    zoom: 4,
    layers: [layers.earthquake]
});

// Add our 'darkmap' tile layer to the map
darkmap.addTo(map);

// Create a legend to display information about our map
const legend = L.control({
    position: "bottomright"
});

// Insert div with legend class
legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend"),
        grades = [0, 250, 500, 750, 1000]

    // Create legend header    
    div.innerHTML = '<div class="header"><strong>EQ Significance</strong></br></br></div>';
    // Create legend information
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorSig(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br><br>' : '+');
    }
    return div;
};
// Add the legend to the map
legend.addTo(map);

// Color for significance
function colorSig(sig) {
    if (sig > 1000) {
        return '#ff6666';
    } else if (sig > 750) {
        return '#ff9999';
    } else if (sig > 500) {
        return '#ffcccc';
    } else if (sig > 250) {
        return '#ffe6e6';
    } else {
        return '#ffffff';
    }
}


// Load magnitude and significance

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson').then(
    eqData => {
        const features = eqData.features;
        features.forEach((feature, i) => {
            let location = (feature.geometry.coordinates.slice(0, 2)).reverse();
            let place = feature.properties.place;
            let mag = feature.properties.mag;
            let sig = feature.properties.sig;
            let date = new Date(feature.properties.time);
           
            let radius = 0;
                if (mag >4) {radius = mag * 10000}
                else if (mag >3) {radius = mag * 5000}
                else if (mag >2) {radius = mag * 1000}
                else {radius = mag * 100}

            const pinPoint = L.circle(location, {
                weight: .7,
                color: colorSig(sig),
                fillOpacity: 0.8,
                radius: radius
            });

            // Add Popup
            pinPoint.bindPopup(`<h3>Earthquake: ${place}</h3><hr>
            <h4>Time: ${date}</h4><hr>
            <h4>Magnitude: ${mag}</h4><hr>
            <h4>Significance: ${sig}</h4>`) 
            .addTo(map)
        })
    })