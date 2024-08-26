# dabc_challenge_15.mapping
Module 15 - Interactive Visualizations

In this challenge, I created an interactive world map of earthquakes as recorded by the US Geological Survey: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php. The map shows all the recorded earthquakes from the last 30 days, up to the date of user interaction.

In the logic.js file in the js folder, I created functions for the different pieces of the map. Base layers include street and topography views. Overlay layers include markerclusters, a heatmap, circles as informative markers, and tectonic plates. Each marker pulls the location, depth, and magnitude of the quake from the JSON metadata, all of which are used for map placement, as well as size and color coding relative to magnitude. When clicked, each marker includes a popup with text showing location, depth, and magnitude. The map also includes a legend in the bottom right-hand corner, showing the different depth ranges for each color of circle marker.

The js folder also includes the JavaScript file for the plugin for Leaflet heatmaps. The css folder contains the stylesheet which sets up the info and legend classes Leaflet uses to create the map legend and also tells the map to fill the browser window.

The index.html file includes the library plugins for the Leaflet heatmap and JS code, the D3 library, Marker Cluster code and CSS, and additional styling CSS. Lastly, it connects the function of the web page to my logic.js file. 

The interactive web page is hosted by GitHub Pages and can be reached here: https://redrajah13.github.io/dabc_challenge_15.mapping/.
