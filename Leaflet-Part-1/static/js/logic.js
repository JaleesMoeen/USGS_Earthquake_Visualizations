

//creating the map project
//We set the view to the Ontario, Canada coordinates
let myMap = L.map('map').setView([51.2538, -85.3232], 3);

//adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


//set our api urls based on what we want to display.
//We choose the dataset for Past 7 Days (Updated every minute)
const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



//call the api with d3 to get the data.
d3.json(url).then(function(data){
    console.log(data);

    //create a leaflet layer group
    let earthquakes = L.layerGroup();
    
    // Loop through the features in the data
    data.features.forEach(function (feature) {
    // Get the coordinates of the earthquake
    let coordinates = feature.geometry.coordinates;
    let lat = coordinates[1];
    let lng = coordinates[0];
    let depth = coordinates[2];
  
    // Get the magnitude of the earthquake
    let magnitude = feature.properties.mag;
  
    // Create a circle marker for the earthquake
    let marker = L.circleMarker([lat, lng], {
      radius: magnitude * 3, 
      color: '#000',      
      weight: 1,              
      fillColor: getColor(depth),  
      fillOpacity: 0.7        
    });
      
    //add a popup to the marker with information about the earthquake
    marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
        <strong>Magnitude:</strong> ${magnitude}<br>
        <strong>Depth:</strong> ${depth} km`);
      
      //add the marker to the layer group
      marker.addTo(earthquakes);
    });
    
    //add the layer group to the map
    earthquakes.addTo(myMap);
  
    //define a function to get the color based on the depth of the earthquake
    function getColor(d) {
        return d > 90 ? '#D73027' :
               d > 70 ? '#4575B4' :
               d > 50 ? '#91BFDB' :
               d > 30 ? '#313695' :
               d > 10 ? '#FEE08B' :
               d > -10 ? '#A6D96A' :
               '#1A9850';
      }
  
    //create a legend control
    let legend = L.control({position: 'bottomright'});

   //add the legend to the map
   legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        depths_intervals = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
    // loop through our depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depths_intervals.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(depths_intervals[i] + 1) + '"></i> ' +
          depths_intervals[i] + (depths_intervals[i + 1] ? '&ndash;' + depths_intervals[i + 1] + '<br>' : '+') + '<br>';
    }
  
    return div;





  };
  
  legend.addTo(myMap);
  
  });