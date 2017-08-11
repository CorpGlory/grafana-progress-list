import coreModule from 'app/core/core_module';


export function initProgress(panelPath: string, directiveName: string = "progress") {
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: panelPath + '/directives/progress.html',
        restrict: 'E',
        scope: {
          item: "="
        }
      };
    });
}

