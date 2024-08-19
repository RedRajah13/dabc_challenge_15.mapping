
// Helper Functions
function markerSize(mag) {
    let radius = 1;
    if (mag > 0) {
        radius = mag ** 7;
    }
    return radius
}

function markerColor(depth) {
    if (depth >= 90) {
        color = "#722F37";
    } else if (depth >= 70) {
        color =  "#7C0902";
     } else if (depth >= 50) {
        color =  "#AB274F";
     } else if (depth >= 30) {
        color =  "#BF4F51";
     } else if (depth >= 10) {
        color =  "#F88379";
     } else {
        color =  "#FFC0CB";
    }
    return color
}

// Map Function
function createMap(data, geo_data) {
    
    // Initialize the Base Layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create the Overlay layers
    let heatArray = [];
    let circleArray = [];
  
    for (let i = 0; i < data.length; i++){
        let row = data[i];
        let location = row.geometry;
  
        // create marker
        if (location) {
            
            let point = [location.coordinates[1], location.coordinates[0]];
            let depth = location.coordinates[2];
            let color = markerColor(depth);
            let mag = row.properties.mag;
            let place = row.properties.place;
        
            let marker = L.marker(point, {icon: L.divIcon({className: 'custom-marker', html: '<div style="background-color: '+ color +'"></div>'})});
            let popup = `<h3>Magnitude: ${mag}<br/>Location: ${place}<br/>Depth: ${depth}km</h3>`;
            marker.bindPopup(popup);
        
            // add to heatmap
            heatArray.push(point);

            // create circle
            let circleMarker = L.circle(point, {
                fillOpacity: 0.5,
                color: color,
                fillColor: color,
                radius: markerSize(mag)
            }).bindPopup(popup);

            circleArray.push(circleMarker);
        }
    }
    
    // create layers
    let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 10
    });

    let circleLayer = L.layerGroup(circleArray);

    let geoLayer = L.geoJSON(geo_data, {
        style: {
            color: "grey",
            weight: 3
        }
        });

    // Build the Layer Controls

    let baseLayers = {
        Street: street,
        Topography: topo
    };

    let overlayLayers = {
        Heatmap: heatLayer,
        Circles: circleLayer,
        "Tectonic Plates": geoLayer
    }

    // Initialize the Map

    // Destroy the old map
    d3.select("#map-container").html("");

    // rebuild the map
    d3.select("#map-container").html("<div id='map'></div>");

    let myMap = L.map("map", {
        center: [39.50, -98.35],
        zoom: 3,
        layers: [street, geoLayer]
    });


    // Add the Layer Control filter + legends
    L.control.layers(baseLayers, overlayLayers).addTo(myMap);
    circleLayer.addTo(myMap);

    // Legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        
        let legendInfo = "<h4>Earthquake<br/>Magnitude</h4><br/>"
        legendInfo += "<i style='background: #FFC0CB'></i><=10<br/>";
        legendInfo += "<i style='background: #F88379'></i>10-30<br/>";
        legendInfo += "<i style='background: #BF4F51'></i>30-50<br/>";
        legendInfo += "<i style='background: #AB274F'></i>50-70<br/>";
        legendInfo += "<i style='background: #7C0902'></i>70-90<br/>";
        legendInfo += "<i style='background: #722F37'></i>90+";

        div.innerHTML = legendInfo;
        return div;
    };
    legend.addTo(myMap);
}

function map_earthquakes() {

    let url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
    let url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

    d3.json(url1).then(function (data) {
        d3.json(url2).then(function (geo_data) {
            let data_rows = data.features;
            createMap(data_rows, geo_data);
        });       
    });
}

map_earthquakes();
