angular.module('ngBindPolymer', []).directive('bindPolymer', ['$parse', function($parse) {
    return {
        restrict: 'A',
        scope : false,
        compile: function(el, attr) {
            var attrMap = {};
            for (var prop in attr) {
                if (angular.isString(attr[prop])) {
                    var _match = attr[prop].match(/\{\{\s*([\.\w]+)\s*\}\}/);
                    if (_match) {
                        attrMap[prop] = $parse(_match[1]);
                    }
                }
            }

            return function(scope, element, attrs) {
                Object.keys(attrMap).forEach(function(key) {
                    // Convert the key to a key used in events (with dashes instead of cammelcase)
                    var eventKey = key.split(/(?=[A-Z])/).join('-').toLowerCase();

                    element.on(eventKey + '-changed', function(event) {
                        scope.$evalAsync(function() {
                            if (attrMap[key](scope) === event.originalEvent.detail.value) return;
                            attrMap[key].assign(scope, event.originalEvent.detail.value);
                        });
                    });
                });
            };
        }
    };
}]);