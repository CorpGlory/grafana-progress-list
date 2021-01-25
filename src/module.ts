import { GraphTooltip } from './graph_tooltip';
import * as PanelConfig from './panel_config';
import { Mapper } from './mapper';
import { ProgressBar } from './progress_bar';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';

import * as _ from 'lodash';

export type HoverEvent = {
  index: number,
  event: any
}

const ERROR_MAPPING = `
  Can't map the received metrics, see 
  <strong>
    <a href="https://github.com/CorpGlory/grafana-progress-list/wiki">wiki</a>
  </strong>
`;
const ERROR_NO_DATA = "no data";

class Ctrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/template.html';

  public mapper: Mapper;

  // TODO: rename progressBars
  public progressBars: ProgressBar[];

  private _panelConfig: PanelConfig.PanelConfig;

  private _seriesList: any;

  private _tooltip: GraphTooltip;

  private statNameOptions = _.values(PanelConfig.StatType);
  // TODO: review these ooptions and make types in PanelConfig
  private statProgressTypeOptions = [ 'max value', 'shared' ];
  
  private coloringTypeOptions = _.values(PanelConfig.ColoringType);

  private titleViewTypeOptions = _.values(PanelConfig.TitleViewOptions);
  private sortingOrderOptions = [ 'none', 'increasing', 'decreasing' ];
  private valueLabelTypeOptions = _.values(PanelConfig.ValueLabelType);
  // TODO: change option names or add a tip in editor
  private tooltipModeOptions = _.values(PanelConfig.TooltipMode);

  // field for updating tooltip on rendering and storing previous state
  private _lastHoverEvent?: HoverEvent;

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

    _.defaults(this.panel, PanelConfig.DEFAULTS);

    this._panelConfig = new PanelConfig.PanelConfig(this.panel);
    this._initStyles();

    this.mapper = new Mapper(this._panelConfig, this.templateSrv);
    this.progressBars = [];
    this._tooltip = new GraphTooltip();

    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('render', this._onRender.bind(this));
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
      this.progressBars = this.mapper.mapMetricData(this._seriesList);
    } catch(e) {
      this._panelAlert.active = true;
      this._panelAlert.message = `${ERROR_MAPPING}<br/><p class="error">${e}</p>`;
      return;
    }
    if(this._panelConfig.getValue('sortingOrder') === 'increasing') {
      this.progressBars = _.sortBy(this.progressBars, i => i.aggregatedProgress);
    }
    if(this._panelConfig.getValue('sortingOrder') === 'decreasing') {
      this.progressBars = _.sortBy(this.progressBars, i => -i.aggregatedProgress);
    }

    if(this._tooltip.visible) {
      if(this._lastHoverEvent === undefined) {
        throw new Error(
          'Need to show tooltip because it`s visible, but don`t have previous state'
        );
      }
      this.onHover(this._lastHoverEvent);
    }
    this._panelAlert.active = false;
  }

  onValueLabelTypeChange(): void {
    this.updatePostfix();
    this._onRender();
  }

  onAddSkipColumnClick(): void {
    this.panel.skipColumns.push('');
  }

  onRemoveSkipColumnClick(index: number): void {
    this.panel.skipColumns.splice(index, 1);
    this.render();
  }

  updatePostfix(): void {
    const valueLabelType = this._panelConfig.getValue('valueLabelType');
    const postfixValue = this.panel.postfix;
    switch(valueLabelType) {
      case PanelConfig.ValueLabelType.ABSOLUTE:
        if(postfixValue === '%') {
          this.panel.postfix = '';
        }
        break;
      case PanelConfig.ValueLabelType.PERCENTAGE:
        if(postfixValue === '') {
          this.panel.postfix = '%';
        }
        break;
      default:
        throw new Error(`Unknown value label type: ${valueLabelType}`);
    }
  }

  onHover(event: HoverEvent) {
    this._clearActiveProgressBar();
    this._lastHoverEvent = event; // TODO: use it to unset active previous progressbar
    this.progressBars[event.index].active = true;
    this._tooltip.show(event.event, this.progressBars, this.panel.tooltipMode);
  }

  private _clearActiveProgressBar() {
    if(
      this._lastHoverEvent !== undefined &&
      this._lastHoverEvent.index < this.progressBars.length
    ) {
      this.progressBars[this._lastHoverEvent.index].active = false;
    }
  }

  onMouseLeave() {
    this._clearActiveProgressBar();
    this._tooltip.hide();
  }

  _onDataReceived(seriesList: any) {
    this._seriesList = seriesList;
    // we call apply here to update columns list used in the editor
    this.$scope.$apply();
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
    // TODO: reveiew this logic
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

  get isPanelAlert(): boolean {
    return this._panelAlert.active;
  }

  // the field will be rendered as html
  get panelAlertMessage(): string {
    return this._panelAlert.message;
  }

}

export { Ctrl as PanelCtrl }
