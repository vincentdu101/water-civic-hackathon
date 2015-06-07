app.directive('stackedArea', [
  '$q',
  function($q){

  return {
    restrict: 'A',
    templateUrl: 'templates/shared/stackedArea.html',
    controller: function($scope) {
      var allData = [];
      var sample = [];
      var orderedCategories = [];
      var categories = [];
      var allCategories = {};
//       function GetSomeDeferredStuff() {
//         var deferreds = [];
//         var files = ["ANT.,csv",  "BUC.csv",  "CCH.csv",  "CMN.csv",  "DNN.csv",  "ENG.csv",  "FRD.csv",  "ICH.csv",  "ISB.csv",  "LON.csv",  "NHG.csv",  "PAR.csv",  "PYM.csv",  "SNL.csv",  "TUL.csv",  "WRS.csv",
// ",BLB.csv",  "BUL.csv",  "CHV.csv",  "COY.csv",  "DNP.csv",  "EXC.csv",  "HID.csv",  "INP.csv",  "KES.csv",  "MIL.csv",  "NML.csv",  "PNF.csv",  "SCC.csv",  "STP.csv",  "UNV.csv",
// ",BRD.csv",  "CAS.csv",  "CLE.csv",  "DAV.csv",  "DON.csv",  "FOL.csv",  "HTH.csv",  "INV.csv",  "LEW.csv",  "NAT.csv",  "ORO.csv",  "PRR.csv",  "SHA.csv",  "TRM.csv",  "WHI.csv"]; 
//         var i = 1;
//         for (i = 1; i <= 10; i++) {
//             var count = i;

//             deferreds.push(
//               d3.csv('js/data/' + files"[i]", function(data){
//                 allData.push(data);
//                 $scope.$broadcast('')
//               })
//             );
//         }
        
//         return deferreds;
//       }
      function swap(index1, index2) {
        var temp = categories[index1];
        categories[index1] = categories[index2];
        categories[index2] = temp;
      }

      function sortByLargest(dataStore) {
        var num_elements = categories.length; 
        var temp;
        // for(var outer = num_elements; outer >= 2; --outer){
        //   for(var inner = 0; inner <= outer -1; ++inner){
        //     if(firstRow[categories[inner]] > firstRow[categories[inner + 1]]){
        //       swap(inner, inner + 1);
        //     }
        //   }
        // }
        for (var i = 0; i < categories.length; i++) {
          orderedCategories.push(allCategories[categories[i]]);
        }
      }

      function genChart() {
        console.log(allData);
        var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "light",
            "marginRight":30,
            "path": "http://www.amcharts.com/lib/3/",
            "legend": {
                "equalWidths": false,
                "periodValueText": "total: [[value.sum]]",
                "position": "top",
                "valueAlign": "left",
                "valueWidth": 100
            },
            "dataProvider": allData,
            "valueAxes": [{
                "stackType": "regular",
                "gridAlpha": 0.07,
                "position": "left",
                "title": "Water Reservoir Levels"
            }],
            "graphs": orderedCategories,
            "plotAreaBorderAlpha": 0,
            "marginTop": 10,
            "marginLeft": 0,
            "marginBottom": 0,
            "chartScrollbar": {},
            "chartCursor": {
                "cursorAlpha": 0
            },
            "categoryField": "date",
            "categoryAxis": {
                "startOnAxis": true,
                "axisColor": "#DADADA",
                "gridAlpha": 0.07,
                "guides": [{
                    category: "2001",
                    toCategory: "2003",
                    lineColor: "#CC0000",
                    lineAlpha: 1,
                    fillAlpha: 0.2,
                    fillColor: "#CC0000",
                    dashLength: 2,
                    inside: true,
                    labelRotation: 90,
                    label: "fines for speeding increased"
                }, {
                    category: "2007",
                    lineColor: "#CC0000",
                    lineAlpha: 1,
                    dashLength: 2,
                    inside: true,
                    labelRotation: 90,
                    label: "motorcycle fee introduced"
                }]
            },
            "export": {
              "enabled": true
             }
        });
      }
      // $(function() {
          // $("a").click(function() {
              // var deferreds = GetSomeDeferredStuff();

              // $.when.apply(null, deferreds).done(function() {
              //     console.log(allData);
              // });
          // });
      // });  
      var deferreds = [];
      var files = ["ANT.,csv",  "BUC.csv",  "CCH.csv",  "CMN.csv",  "DNN.csv",  "ENG.csv",  "FRD.csv",  "ICH.csv",  "ISB.csv",  "LON.csv",  "NHG.csv",  "PAR.csv",  "PYM.csv",  "SNL.csv",  "TUL.csv",  "WRS.csv",
",BLB.csv",  "BUL.csv",  "CHV.csv",  "COY.csv",  "DNP.csv",  "EXC.csv",  "HID.csv",  "INP.csv",  "KES.csv",  "MIL.csv",  "NML.csv",  "PNF.csv",  "SCC.csv",  "STP.csv",  "UNV.csv",
",BRD.csv",  "CAS.csv",  "CLE.csv",  "DAV.csv",  "DON.csv",  "FOL.csv",  "HTH.csv",  "INV.csv",  "LEW.csv",  "NAT.csv",  "ORO.csv",  "PRR.csv",  "SHA.csv",  "TRM.csv",  "WHI.csv"]; 

      var i = 1;
      // for (i = 1; i <= 10; i++) {
      //     var count = i;

      //     deferreds.push(
      //       d3.csv('js/data/' + files[i], function(data){
      //         allData = data;
      //         genChart();
      //       })
      //     );
      // }
      queue()
        .defer(d3.csv, 'js/data/all.csv')
        .defer(d3.json, 'js/data/categories.json')
        .await(init);
      
      function init(error, data, headers){
        allData = data;
        firstRow = allData[0];
        categories = Object.keys(headers);
        allCategories = headers;
        sortByLargest();
        genChart();
      }
    }
  }

}
]);