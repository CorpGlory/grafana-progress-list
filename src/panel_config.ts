export enum StatType {
  CURRENT = 'current',
  MIN = 'min',
  MAX = 'max',
  TOTAL = 'total'
};

export enum TitleViewOptions {
  SEPARATE_TITLE_LINE = 'Separate title line',
  INLINE = 'Inline'
};

export enum ColoringType {
  PALLETE = 'pallete',
  THRESHOLDS = 'thresholds',
  KEY_MAPPING = 'key mapping'
}

export enum ValueLabelType {
  PERCENTAGE = 'percentage',
  ABSOLUTE = 'absolute'
}

export enum TooltipMode {
  NONE = 'none',
  SINGLE = 'single',
  ALL_SERIES = 'all series'
};

export const DEFAULTS = {
  keyColumn: '',
  skipColumns: [],
  statNameOptionValue: StatType.CURRENT,
  statProgressMaxValue: null,
  coloringType: ColoringType.PALLETE,
  titleViewType: TitleViewOptions.SEPARATE_TITLE_LINE,
  sortingOrder: 'none',
  valueLabelType: ValueLabelType.ABSOLUTE,
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
  opacity: 0.5,
  limit: 50
};


export class PanelConfig {
  private _panel: any;
  public constructor(panel: any) {
    this._panel = panel;

    // migrations
    if(this.getValue('coloringType') === 'auto') {
      this.setValue('coloringType', ColoringType.PALLETE);
    }

    const skipColumn = this.getValue('skipColumn');
    if(skipColumn !== undefined && skipColumn !== '') {
      this.setValue('skipColumn', undefined);
      this.setValue('skipColumns', [skipColumn]);
    }
  }

  public getValue(key: string): any {
    return this._panel[key];
  }

  public setValue(key: string, value: any): void {
    this._panel[key] = value;
  }

  private _pluginDirName: string;
  public get pluginDirName(): string {
    if(!this._pluginDirName) {
      var panels = window['grafanaBootData'].settings.panels;
      var thisPanel = panels[this._panel.type];
      // the system loader preprends publib to the url,
      // add a .. to go back one level
      this._pluginDirName = thisPanel.baseUrl + '/';
    }
    return this._pluginDirName;
  }
}
