import { ColoringType, PanelConfig, TitleViewOptions } from './panel_config';
import { getFormattedValue } from './value_formatter';

import * as _ from 'lodash';


type ProgressTitle = {
  barHeight: number,
  titleTopMargin: number,
  valueTopMargin: number
};

/**
 * It's model for rendering bars in view (partial) and tooltip
 */
export type Bar = {
  name: string,
  value: number,
  color: string
}

/**
 * Model for the main component of the app -- bars, but it's not just a Bar,
 * it also keeps all small "bars", title and metainfo
 */
export class ProgressBar {

  private _bars: Bar[];
  private _active: boolean;

  constructor(
    private _panelConfig: PanelConfig,
    private _title: string,
    private _keys: string[], // maybe "_names" is better than "_keys"
    private _values: number[],
    private _maxValue: number
  ) {
    if(this._keys.length !== this._values.length) {
      throw new Error('keys amount should be equal to values amount');
    }
    this._bars = [];
    for(let i = 0; i < _keys.length; ++i) {
      this._bars.push({
        name: this._keys[i],
        value: this._values[i],
        color: mapValue2Color(this._values[i], i, this._panelConfig)
      });
    }

    // bad code starts:

  }

  get active(): boolean { return this._active; }
  set active(value: boolean) { this._active = value;}

  get title(): string { return this._title; }

  get keys(): string[] { return this._keys; }

  get values(): number[] { return this._values; }

  get bars(): Bar[] { return this._bars; }

  get sumOfValues(): number { return _.sum(this.values); }

  get percentValues(): number[] {
    // TODO: this.sumOfValues * 1.1 is a hack to make sure bars don't wrap
    // (they are wrapped when total width > 98%)
    return this.values.map(
      value => Math.floor(value / (this.sumOfValues * 1.1) * 100)
    );
  }

  get aggregatedProgress(): number {
    return (_.sum(this.values) / this._maxValue) * 100;
  }

  get formattedValue(): string {
    return getFormattedValue(
      this.sumOfValues,
      this._panelConfig.getValue('prefix'),
      this._panelConfig.getValue('postfix'),
      this._panelConfig.getValue('decimals')
    );
  }

  // it should go somewhere to view
  get titleParams(): ProgressTitle {
    const titleType = this._panelConfig.getValue('titleViewType');
    switch(titleType) {
      case TitleViewOptions.SEPARATE_TITLE_LINE:
        return {
          barHeight: 8,
          titleTopMargin: 0,
          valueTopMargin: -12
        };
      case TitleViewOptions.INLINE:
        return {
          barHeight: 20,
          titleTopMargin: -20,
          valueTopMargin: -18
        };
      default:
        throw new Error(`Wrong titleType: ${titleType}`);
    }
  }

  get opacity(): string {
    return this._panelConfig.getValue('opacity');
  }

}

/** VIEW **/

function mapValue2Color(value: number, index: number, _panelConfig: any): string {
  var colorType: ColoringType = _panelConfig.getValue('coloringType');
  var colors: string[] = _panelConfig.getValue('colors');

  if(colorType === ColoringType.PALLETE) {
    return colors[index % colors.length];
  }
  if(colorType === ColoringType.THRESHOLDS) {
    // TODO: parse only once
    var thresholds = _panelConfig.getValue('thresholds').split(',').map(parseFloat);
    if(colors.length <= thresholds.length) {
      // we add one because a threshold is a cut of the range of values
      throw new Error('Number of colors must be at least as number as threasholds + 1');
    }
    for(var i = thresholds.length; i > 0; i--) {
      if(value >= thresholds[i - 1]) {
        return colors[i];
      }
    }
    return colors[0];
  }
  if(colorType === ColoringType.KEY_MAPPING) {
    var colorKeyMappings = _panelConfig.getValue('colorKeyMappings') as any[];
    var keyColorMapping = _.find(colorKeyMappings, k => k.key === this._key);
    if(keyColorMapping === undefined) {
      return _panelConfig.getValue('colorsKeyMappingDefault');
    }
    return keyColorMapping.color;
  }
  throw new Error('Unknown color type ' + colorType);
}
