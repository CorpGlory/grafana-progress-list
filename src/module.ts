import { PanelConfig } from './panel-config';
import { Mapper } from './mapper';
import { ItemsSet } from './items-set';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';
import { initProgress } from './directives/progress';


class Ctrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";

  public mapper: Mapper;
  public itemSet: ItemsSet;

  private _panelConfig: PanelConfig;


  constructor($scope, $injector) {
    super($scope, $injector);
    this._panelConfig = new PanelConfig(this.panel);
    this._initStyles();

    initProgress(this._panelConfig, 'progressListPluginProgress');

    this.mapper = new Mapper(this._panelConfig);
    this.itemSet = new ItemsSet();

    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
  }

  link(scope, element) {
  }

  _initStyles() {
    // small hack to load base styles
    loadPluginCss({
      light: this._panelConfig.pluginDirName + 'css/panel.base.css',
      dark: this._panelConfig.pluginDirName + 'css/panel.base.css'
    });
    loadPluginCss({
      light: this._panelConfig.pluginDirName + 'css/panel.light.css',
      dark: this._panelConfig.pluginDirName + 'css/panel.dark.css'
    });
  }

  _onDataReceived(seriesList: any) {
    var items = this.itemSet.setItemStates(this.mapper.mapMetricData(seriesList));
    this.$scope.items = items;
  }

  _onInitEditMode() {
    var thisPartialPath = this._panelConfig.pluginDirName + 'partials/';
    this.addEditorTab(
      'Options', thisPartialPath + 'editor.mapping.html', 2
    );
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }

}


export { Ctrl as PanelCtrl }
