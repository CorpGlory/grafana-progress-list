import coreModule from 'app/core/core_module';


export function initWaiting(panelPath: string, directiveName: string = "waiting") {
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: panelPath + '/directives/waiting.html',
        restrict: 'E'
      };
    });
}

