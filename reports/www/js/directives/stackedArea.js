app.directive('stackedArea', function(){

  return {
    restrict: 'A',
    templateUrl: 'templates/shared/stackedArea.html',
    controller: function($scope) {
      function GetSomeDeferredStuff() {
        var deferreds = [];

        var i = 1;
        for (i = 1; i <= 10; i++) {
            var count = i;

            deferreds.push(
            $.post('/echo/html/', {
                html: "<p>Task #" + count + " complete.",
                delay: count
            }).success(function(data) {
                $("div").append(data);
            }));
        }
        
        return deferreds;
    }

    $(function() {
        $("a").click(function() {
            var deferreds = GetSomeDeferredStuff();

            $.when.apply(null, deferreds).done(function() {
                $("div").append("<p>All done!</p>");
            });
        });
    });  
    }
  }

});