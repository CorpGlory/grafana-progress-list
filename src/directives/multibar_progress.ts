import { PanelConfig } from '../panel-config';

import { coreModule } from 'grafana/app/core/core';


var directiveInited = false;
export function initMultibarProgress(panelConfig: PanelConfig, directiveName: string = 'multibar_progress') {
  if(directiveInited) {
    return;
  }
  directiveInited = true;
  coreModule
    .directive(directiveName, function() {
      return {
        templateUrl: panelConfig.pluginDirName + 'directives/multibar_progress.html',
        restrict: 'E',
        scope: {
          item: '=',
          onHover: '&',
          onMouseLeave: '&'
        }
      };
    });
}
