app.directive('californiaBubble', [
  function(){

    return {
      restrict: "A",
      templateUrl: "templates/shared/californiaBubble.html",
      controller: function($scope) {
        // var width = 960,
        //     height = 500;

        // var radius = d3.scale.sqrt()
        //     .domain([0, 1e6])
        //     .range([0, 10]);

        // var path = d3.geo.path();

        // var svg = d3.select("body").append("svg")
        //     .attr("width", width)
        //     .attr("height", height);

        // $scope.map = "js/data/us_ca_all_geo.svg";

        // queue()
        //     .defer(d3.json, "js/data/us-ca-all.geo.json")
        //     .await(ready);
        // function ready(error, california) {
        //   svg.append("path")
        //       .attr("class", "states")
        //       .datum(topojson.feature(california, california.features))
        //       .attr("d", path);

        //   // svg.selectAll(".symbol")
        //   //     .data(centroid.features.sort(function(a, b) { return b.properties.population - a.properties.population; }))
        //   //   .enter().append("path")
        //   //     .attr("class", "symbol")
        //   //     .attr("d", path.pointRadius(function(d) { return radius(d.properties.population); }));
        // }
        function distanceBetween(slave, master) {
            // default miles
            var unit = "M";
            var lat1 = slave[0],
                lon1 = slave[1],
                lat2 = master[0],
                lon2 = master[1];

            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var radlon1 = Math.PI * lon1/180;
            var radlon2 = Math.PI * lon2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }        
      }      
    };

  }
]);