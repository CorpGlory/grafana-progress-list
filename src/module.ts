import { GraphTooltip, Serie } from './graph_tooltip';
import { PanelConfig } from './panel-config';
import { Mapper, ProgressItem, StatType } from './mapper';
import { initProgress } from './directives/progress';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';

import * as _ from 'lodash';


const DEFAULTS = {
  statNameOptionValue: 'current',
  statProgressType: 'shared',
  statProgressMaxValue: null,
  coloringType: 'auto',
  sortingOrder: 'none',
  valueLabelType: 'percentage',
  mappingType: 'datapoint to datapoint',
  alias: '',
  prefix: '',
  postfix: '',
  thresholds: '10, 30',
  // https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts#L57
  colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
  colorsKeyMappingDefault: 'rgba(245, 54, 54, 0.9)',
  colorKeyMappings: [],
  nullMapping: undefined,
  tooltipMode: 'all series'
};

class Ctrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/template.html';

  public mapper: Mapper;
  public items: ProgressItem[];

  private _panelConfig: PanelConfig;
  private _element: any;

  private _seriesList: any;

  private _tooltip: GraphTooltip;

  private statNameOptions = _.values(StatType);
  private statProgressTypeOptions = [ 'max value', 'shared' ];
  private coloringTypeOptions = [ 'auto', 'thresholds', 'key mapping' ];
  private sortingOrderOptions = [ 'none', 'increasing', 'decreasing' ];
  private valueLabelTypeOptions = [ 'absolute', 'percentage' ];
  // TODO: change option names or add a tip in editor
  private mappingTypeOptions = ['datapoint to datapoint', 'target to datapoint'];
  private tooltipModeOptions = ['all series', 'single'];

  constructor($scope: any, $injector: any, public templateSrv: any) {
    super($scope, $injector);

    _.defaults(this.panel, DEFAULTS);

    this._panelConfig = new PanelConfig(this.panel);
    this._initStyles();

    initProgress(this._panelConfig, 'progressListPluginProgress');

    this.mapper = new Mapper(this._panelConfig, this.templateSrv);
    this.items = [];

    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('render', this._onRender.bind(this));
  }

  link(scope, element) {
    this._element = element;
  }

  _initStyles() {
    // small hack to load base styles
    const cssPath = this._panelConfig.pluginDirName.replace('public/', '');
    loadPluginCss({
      light: cssPath + 'css/panel.base.css',
      dark: cssPath + 'css/panel.base.css'
    });
    loadPluginCss({
      light: cssPath + 'css/panel.light.css',
      dark: cssPath + 'css/panel.dark.css'
    });
  }

  _onRender() {
    var items = this.mapper.mapMetricData(this._seriesList);
    if(this._panelConfig.getValue('sortingOrder') === 'increasing') {
      items = _.sortBy(items, i => i.progress);
    }
    if(this._panelConfig.getValue('sortingOrder') === 'decreasing') {
      items = _.sortBy(items, i => -i.progress);
    }
    this.$scope.items = items;
    this._element.find('.table-panel-scroll').css({
      'height': `${this.height}px`,
      'max-height': `${this.height}px`
    });

    this.$timeout(() => {
      const jqueryElement: JQuery<HTMLElement> = this._element.find('.tooltip-item');
      if(this._tooltip !== undefined) {
        this._tooltip.destroy();
      }

      this._tooltip = new GraphTooltip(
        this._panelConfig, () => this._seriesList, this.$scope.items
      );
      jqueryElement.hover((event) => {
        this._tooltip.show(event);
      });
      jqueryElement.mouseleave(() => {
        this._tooltip.clear();
      });
    }, 1000);
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
      color: 'rgba(50, 172, 45, 0.97)'
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
