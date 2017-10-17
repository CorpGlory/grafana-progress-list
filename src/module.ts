import { PanelConfig } from './panel-config';
import { Mapper, ProgressItem } from './mapper';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';
import { initProgress } from './directives/progress';

import * as _ from 'lodash';

const defaults = {
  statNameOptionValue: 'current',
  statProgressType: 'shared',
  statProgressMaxValue: null,
  coloringType: 'none',
  sortingOrder: 'none',
  valueLabelType: 'percentage',
  prefix: '',
  postfix: '',
  thresholds: '10, 30',
  // https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts#L57
  colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
  colorsKeyMappingDefault: "rgba(245, 54, 54, 0.9)",
  colorKeyMappings: [],
  nullMapping: undefined
};

class Ctrl extends MetricsPanelCtrl {
  static templateUrl = "partials/template.html";

  public mapper: Mapper;
  public items: ProgressItem[];

  private _panelConfig: PanelConfig;

  private _seriesList: any;

  private statNameOptions = [ 'current', 'min', 'max', 'total' ];
  private statProgressTypeOptions = [ 'max value', 'shared' ];
  private coloringTypeOptions = [ 'none', 'thresholds', 'key mapping' ];
  private sortingOrderOptions = [ 'none', 'increasing', 'decreasing' ];
  private valueLabelTypeOptions = [ 'absolute', 'percentage' ]


  constructor($scope: any, $injector) {
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
    if(this._panelConfig.getValue('sortingOrder') === 'increasing') {
      items = _.sortBy(items, i => i.progress);
    }
    if(this._panelConfig.getValue('sortingOrder') === 'decreasing') {
      items = _.sortBy(items, i => -i.progress);
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

  invertColorOrder() {
    var tmp = this.panel.colors[0];
    this.panel.colors[0] = this.panel.colors[2];
    this.panel.colors[2] = tmp;
    this.render();
  }

  addColorKeyMapping() {
    this.panel.colorKeyMappings.push({
      key: 'KEY_NAME',
      color: "rgba(50, 172, 45, 0.97)"
    });
  }

  removeColorKeyMapping(index) {
    this.panel.colorKeyMappings.splice(index, 1);
    this.render();
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }

}


export { Ctrl as PanelCtrl }
