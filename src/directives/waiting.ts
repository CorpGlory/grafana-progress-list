import { ModuleConfig } from '../module-config';

import coreModule from 'grafana/app/core/core_module';


export function initWaiting(directiveName: string = "waiting") {
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: ModuleConfig.getInstance().pluginDirName + '/directives/waiting.html',
        restrict: 'E',
        scope: {
          item: "="
        }
      };
    });
}

