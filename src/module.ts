import { ModuleConfig } from './module-config';
import { Mapper } from './mapper';
import { ItemsSet } from './items-set';
import { ItemState } from './item-model';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';
import { initProgress } from './directives/progress';
import { initWaiting } from './directives/waiting';


class Ctrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";
  
  public mapper: Mapper;
  public itemSet: ItemsSet;
  
  private _panelPath?: string;
  

  constructor($scope, $injector) {
    super($scope, $injector);
    ModuleConfig.init(this.panel);
    this._initStyles();
    
    initProgress('progressListPluginProgress');
    initWaiting('progressListPluginWaiting');
    
    this.mapper = new Mapper();
    this.itemSet = new ItemsSet();
    
    this.$scope.ItemState = ItemState;
    
    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
  }

  link(scope, element) {
  }
  
  _initStyles() {
    // small hack to load base styles
    loadPluginCss({
      light: ModuleConfig.getInstance().pluginDirName + 'css/panel.base.css',
      dark: ModuleConfig.getInstance().pluginDirName + 'css/panel.base.css'
    });
    loadPluginCss({
      light: ModuleConfig.getInstance().pluginDirName + 'css/panel.light.css',
      dark: ModuleConfig.getInstance().pluginDirName + 'css/panel.dark.css'
    });
  }

  _onDataReceived(seriesList: any) {
    var items = this.itemSet.setItemStates(this.mapper.mapMetricData(seriesList));
    this.$scope.items = items;
  }

  _onInitEditMode() {
    var thisPartialPath = ModuleConfig.getInstance().pluginDirName + 'partials/';
    this.addEditorTab(
      'Data Mapping', thisPartialPath + 'editor.mapping.html', 2
    );
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }

}


export { Ctrl as PanelCtrl }
