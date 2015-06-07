app.directive('barGraph', [
  'Population',
  '$q',
  function(Population, $q){

    return {
      restrict: "E",
      scope: {
        target: "@"
      },
      templateUrl: "templates/shared/barGraph.html",
      controller: function($scope) {

        var years = [2010, 2011, 2012, 2013, 2014];
        var allCategories = {};
        // margins are used to assume the spacing of the axes
        var margin = {top: 20, right: 80, bottom: 30, left: 80};

        // calculate width and height with axes margins in mind
        var width = 500 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;
        var padding = 10;        
        var defaultCategory = "Total Population";

        $scope.allData = [];
        $scope.currentCategory = [];
        $scope.region = "United States";
        $scope.key = "POPESTIMATE";
        $scope.categories = [];

        function calculateHeight(height, pop) {
          var length = height - pop;
          return length >= 0 ? length : 0;          
        }

        function removeChart() {
          $($scope.target).find('.tooltip').remove();
          $($scope.target).find('.bar-chart').empty();
        }

        // x scale to be used in x-axis
        function generateXScale(years, width) {          
          return d3.scale.linear()
                  // species min and max value of x axis
                  .domain([d3.min(years), d3.max(years)])
                  // calculates the spacing and width based on the 
                  // domain and width of graph
                  .range([0, width]);          
        }

        function generateYScale(populations, height) {
          var range = d3.max(populations) - d3.min(populations);
          return d3.scale.linear()
                  // y-axis min and max value
                  .domain([d3.min(populations) - range, d3.max(populations)])
                  // has to be height first other wise it is negative
                  .range([height, 0]);
        }

        function findSelectedKey(key) {
          for(var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].name == key) {
              $scope.categories[i].ticked = true;
            } else {
              $scope.categories[i].ticked = false;
            }
          } 
        }

        $scope.loadSelect = function() {
          var deferred = $q.defer();
          Population.getKeys().success(function(data){
            var keys = Object.keys(data);
            allCategories = data;
            for(var i = 0; i < keys.length; i++) {
              var keyName = data[keys[i]].name;
              if (keyName) {
                data[keys[i]].ticked = keyName == defaultCategory;
                data[keys[i]].key = keys[i];
                $scope.categories.push(data[keys[i]]);
                $scope.currentCategory.push(data[keys[i]]);
              }
            }
            deferred.resolve();
          });   
          return deferred.promise;
        };

        $scope.selectCategory = function(data) {
          $scope.currentCategory = data;
          $scope.key = data.key;
          findSelectedKey($scope.currentCategory.name);
          removeChart();
          if (data.key == 'NRANK_POPEST' && $scope.region == 'United States') {
            $scope.error = "Not Applicable";
          } else {
            $scope.error = "";
            $scope.createPopulationBar({
              data: $scope.loadCategory($scope.allData),
              key: $scope.key,
              target: $scope.target
            }); 
          }          
        };

        $scope.loadCategory = function(data) {
          var output = [];
          var category = data[$scope.region];
          $scope.currentCategory = allCategories[$scope.key];
          var keys = Object.keys(category);
          for(var i = 0; i < keys.length; i++) {
            if (keys[i].match($scope.key)) {
              output.push({
                era: years[output.length],
                pop: parseFloat(category[keys[i]])
              });
            }
          }
          return output;
        };

        $scope.createPopulationBar = function(options) {
          // var data = options.data;
          var target = options.target;
          var dataset = options.data;
          var message = '<b>Hover a time period<br /> to see data</b>';

          // width of a bar
          var barWidth = width / dataset.length;      

          // x values for the years
          var years = dataset.map(function(d){ return d.era; });

          // y values for the population
          var populations = dataset.map(function(d){ return d.pop; });
          
          // x and y scales to be used in axes
          var xScale = generateXScale(years, width);
          var yScale = generateYScale(populations, height);

          var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom')
                        // sets the tick format
                        .tickFormat(function(data){ return data; })
                        .ticks(5)
                        .tickPadding(10);

          var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient('left')
                        .ticks(10);

          var tooltip = d3.select('body').select(target)
                          .select(".col-50")
                          .append('div')
                          .attr('class', 'tooltip')
                          .html(message)
                          .style('opacity', 0.85);

          // appends svg with axis margins in mind
          var svg = d3.select(target).select('.bar-chart').append('svg')
                      .attr('width', width + margin.left + margin.right)
                      .attr('height', height + margin.top + margin.bottom)
                      .append('g')
                        .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");
          
          svg.append('g')
              .attr('class', 'x axis')
              // moves tick value to center of bar
              .attr('transform', 'translate(' + barWidth / 2 + ', ' + height + ")")
              .call(xAxis);
          
          // rotates the label and other tick values
          svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
              .append('text')
                .attr('y', -20)
                .attr('x', 10)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text($scope.currentCategory.unit);
          // todo fix bar padding between each value 
          var bars = svg.selectAll('.bar')
              .data(dataset)
              .enter()
              .append('rect');

          bars.attr('class', 'bar')           
            .attr('x', function(d){ return xScale(d.era); })
            .attr('width', barWidth)
            // .transition()
            //   .delay(function(d, i) { return i * 100; })
            //   .duration(700)              
            .attr('y', function(d){ return yScale(d.pop); })
            .transition()
              .delay(function(d, i) { return i * 100; })
              .duration(700)                        
            .attr('height', function(d){ return calculateHeight(height, yScale(d.pop)); })             

              
          bars.on('mouseover', function(d){
            // tooltip.transition()
            //   .duration(500)
            //   .style('opacity', '.85');
            tooltip.html('<b>' + d.era + ' <br />' + d.pop + "</b>");
              // .style('left', 95 + xScale(d.era) + "px")
              // .style('top', 120 + 28 + "px");  
          })
          .on('mouseout', function(d){
            // tooltip.transition()
            //   .duration(300)
            //   .style('opacity', 0);
            tooltip.html(message);
          });

          $(target).find('.bar-chart').append("<h5 class='bar-title'>" + $scope.currentCategory.description + "</h5>");
        };  

        $scope.$on('selectState', function(event, data){
          removeChart();
          $scope.region = data.state;
          $scope.createPopulationBar({
            data: $scope.loadCategory($scope.allData),
            key: $scope.key,
            target: $scope.target
          });          
        });

      },
      link: function($scope) {
        Population.init().then(function(data){
          $scope.loadSelect().then(function(){
            $scope.allData = data.allData;
            $scope.createPopulationBar({
              data: $scope.loadCategory($scope.allData),
              key: $scope.key,
              target: $scope.target
            });             
          });
        }); 
      }      
    };

  }
]);