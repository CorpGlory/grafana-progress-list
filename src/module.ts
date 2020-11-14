import { GraphTooltip, TooltipMode } from './graph_tooltip';
import { PanelConfig } from './panel-config';
import { Mapper, ProgressItem, StatType } from './mapper';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';

import * as _ from 'lodash';


export enum TitleViewOptions {
  SEPARATE_TITLE_LINE = 'Separate title line',
  INLINE = 'Inline'
};

const ERROR_MAPPING = `
  Can't map the received metrics, 
  see <strong> <a href="https://github.com/CorpGlory/grafana-progress-list/wiki">wiki</a> </strong>
`;
const ERROR_NO_DATA = "no data";

const DEFAULTS = {
  keyColumn: '',
  // TODO: skip multiple columns
  skipColumn: '',
  statNameOptionValue: StatType.CURRENT,
  statProgressType: 'shared',
  statProgressMaxValue: null,
  coloringType: 'auto',
  titleViewType: TitleViewOptions.SEPARATE_TITLE_LINE,
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
  tooltipMode: TooltipMode.ALL_SERIES,
  opacity: 0.5
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
  private titleViewTypeOptions = _.values(TitleViewOptions);
  private sortingOrderOptions = [ 'none', 'increasing', 'decreasing' ];
  private valueLabelTypeOptions = [ 'absolute', 'percentage' ];
  // TODO: change option names or add a tip in editor
  private mappingTypeOptions = ['datapoint to datapoint', 'target to datapoint'];
  private tooltipModeOptions = _.values(TooltipMode);
  // used to show status messages replacing rendered graphics
  // see isPanelAlert and panelAlertMessage
  private _panelAlert = {
    active: true,
    // message prop can be formatted with html, 
    message: '<strong>loading...</strong>' // loading will be showed only once at the beginning

    // would be nice to add `type` property with values ['info', 'warning', 'error']
    // and then move it https://github.com/chartwerk/grafana-panel-base/issues/1
  };

  constructor($scope: any, $injector: any, public templateSrv: any) {
    super($scope, $injector);

    _.defaults(this.panel, DEFAULTS);

    this._panelConfig = new PanelConfig(this.panel);
    this._initStyles();

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
    // maybe we want to make a config "last value" instead of ERROR_NO_DATA
    // see https://github.com/chartwerk/grafana-panel-base/issues/3
    if(this._seriesList === undefined || this._seriesList.length === 0) {
      this._panelAlert.active = true;
      this._panelAlert.message = ERROR_NO_DATA;
      return;
    }
    try {
      // TODO: set this.items also
      var items = this.mapper.mapMetricData(this._seriesList);
    } catch(e) {
      this._panelAlert.active = true;
      this._panelAlert.message = ERROR_MAPPING;
      return;
    }
    if(this._panelConfig.getValue('sortingOrder') === 'increasing') {
      items = _.sortBy(items, i => i.aggregatedProgress);
    }
    if(this._panelConfig.getValue('sortingOrder') === 'decreasing') {
      items = _.sortBy(items, i => -i.aggregatedProgress);
    }
    this.$scope.items = items;

    if(this._tooltip !== undefined) {
      this._tooltip.destroy();
    }
    this._tooltip = new GraphTooltip(this.panel.tooltipMode);
    this._panelAlert.active = false;

  }

  onHover(event: any, title?: any, value?: any) {
    // if(title == undefined) {
    //   title = this.items[index].title;
    // }
    // if(value == undefined) {
    //   value = this.items[index].to;
    // }
    this._tooltip.show(event);
  }

  onMouseLeave() {
    this._tooltip.clear();
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
    console.log('got data error');
    console.log(err);
    this.$scope.data = [];
    this.$scope.dataError = err;
  }

  get columns(): string[] {
    if(
      this._seriesList === undefined ||
      this._seriesList.length === 0 ||
      this._seriesList[0].columns === undefined
    ) {
      return [];
    }
    return this._seriesList[0].columns.map(col => col.text);
  }

  get skipColumns(): string[] {
    return ['', ...this.columns];
  }

  get isPanelAlert(): boolean {
    return this._panelAlert.active;
  }

  // the field will be rendered as html
  get panelAlertMessage(): string {
    return this._panelAlert.message;
  }

}

export { Ctrl as PanelCtrl }
