import { PanelConfig } from '../panel-config';

import coreModule from 'grafana/app/core/core_module';


var directiveInited = false;
export function initWaiting(panelConfig: PanelConfig, directiveName: string = "waiting") {
  if(directiveInited) {
    return;
  }
  directiveInited = true;
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: panelConfig.pluginDirName + '/directives/waiting.html',
        restrict: 'E',
        scope: {
          item: "="
        }
      };
    });
}

