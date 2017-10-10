import { PanelConfig } from '../panel-config';

import coreModule from 'grafana/app/core/core_module';


var directiveInited = false;
export function initProgress(panelConfig: PanelConfig, directiveName: string = "progress") {
  if(directiveInited) {
    return;
  }
  directiveInited = true;
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: panelConfig.pluginDirName + 'directives/progress.html',
        restrict: 'E',
        scope: {
          item: "="
        }
      };
    });
}

