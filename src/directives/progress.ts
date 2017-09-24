import { ModuleConfig } from '../module-config';

import coreModule from 'grafana/app/core/core_module';


export function initProgress(directiveName: string = "progress") {
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: ModuleConfig.getInstance().pluginDirName + 'directives/progress.html',
        restrict: 'E',
        scope: {
          item: "="
        }
      };
    });
}

