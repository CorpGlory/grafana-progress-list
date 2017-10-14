import { PanelConfig } from './panel-config';
import { Mapper, KeyValue } from './mapper';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';
import { initProgress } from './directives/progress';

import * as _ from 'lodash';

const defaults = {
  statNameOptionValue: 'current',
  statProgressType: 'shared',
  sorting: false,
  prefix: '',
  postfix: ''
};


class Ctrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";

  public mapper: Mapper;
  public items: KeyValue[];

  private _panelConfig: PanelConfig;
  
  private _seriesList: any;

  private statNameOptions = [ 'current', 'min', 'max', 'total' ];
  private statProgressTypeOptions = [ 'max Value', 'shared' ];

  constructor($scope, $injector) {
    super($scope, $injector);
    
    _.defaults(this.panel, defaults);

    this._panelConfig = new PanelConfig(this.panel);
    this._initStyles();

    initProgress(this._panelConfig, 'progressListPluginProgress');

    this.mapper = new Mapper(this._panelConfig);
    this.items = [];

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
  
  render() {
    var items = this.mapper.mapMetricData(this._seriesList);
    
    if(this._panelConfig.getValue('sorting') === true) {
      items = _.sortBy(items, i => -i[1]);
    }
    
    this.$scope.items = items;
  }

  _onDataReceived(seriesList: any) {
    this._seriesList = seriesList;
    this.render();
  }

  _onInitEditMode() {
    var thisPartialPath = this._panelConfig.pluginDirName + 'partials/';
    this.addEditorTab('Options', thisPartialPath + 'options.html', 2);
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }

}


export { Ctrl as PanelCtrl }
