import { PanelConfig, TitleViewOptions } from './panel_config';
import { getFormattedValue } from './value_formatter';

import * as _ from 'lodash';


type ProgressBarTitle = {
  barHeight: number,
  titleTopMargin: number,
  valueTopMargin: number
};

export class ProgressBar {
  constructor(
    private _panelConfig: PanelConfig,
    private _title: string,
    private _keys: string[],
    private _values: number[],
    private _maxValue: number
  ) {
    if(this._keys.length !== this._values.length) {
      throw new Error('keys amount should be equal to values amount');
    }
  }

  get title(): string {
    return this._title;
  }

  get keys(): string[] {
    return this._keys;
  }

  get values(): number[] {
    return this._values;
  }

  get sumOfValues(): number {
    return _.sum(this.values);
  }

  get percentValues(): number[] {
    // TODO: this.sumOfValues * 1.1 is a hack to make sure bars don't wrap
    // (they are wrapped when total width > 98%)
    return this.values.map(
      value => Math.floor(value / (this.sumOfValues * 1.1) * 100)
    );
  }

  get colors(): string[] {
    // TODO: customize colors
    return ['green', 'yellow', 'red'];
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

  get titleParams(): ProgressBarTitle {
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
