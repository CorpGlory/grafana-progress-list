import { PanelConfig } from './panel-config';
import { getFormattedValue } from './value_formatter';

import * as _ from 'lodash';


type KeyValue = [string, number];

export enum StatType {
  CURRENT = 'current',
  MIN = 'min',
  MAX = 'max',
  TOTAL = 'total'
};

export class ProgressItem {

  private _panelConfig: PanelConfig;

  private _key: string;
  private _aggregatedValue: number;
  private _maxAggregatedValue: number;
  private _currentValue: number;
  private _currentMaxValue: number;

  constructor(
    panelConfig: PanelConfig,
    key: string,
    aggregatedValue: number,
    maxAggregatedValue: number,
    currentValue: number,
    currentMaxValue: number
  ) {
    this._panelConfig = panelConfig;
    this._key = key;
    this._aggregatedValue = aggregatedValue;
    this._maxAggregatedValue = maxAggregatedValue;
    // TODO: currentValue and currentMaxValue is not the best idea
    this._currentValue = currentValue;
    this._currentMaxValue = currentMaxValue;
  }

  get title(): string {
    return this._key;
  }

  get aggregatedProgress(): number {
    return 100 * this._aggregatedValue / this._maxAggregatedValue;
  }

  get currentProgress(): number {
    return 100 * this._currentValue / this._currentMaxValue;
  }

  get maxValue(): number {
    return this._maxAggregatedValue;
  }

  get aggregatedValue(): number {
    return this._aggregatedValue;
  }

  get currentValue(): number {
    return this._currentValue;
  }

  get currentFormattedValue(): string {
    const value =
      this._panelConfig.getValue('valueLabelType') === 'percentage' ?
        this.currentProgress :
        this._currentValue;
    return getFormattedValue(
      value,
      this._panelConfig.getValue('prefix'),
      this._panelConfig.getValue('postfix'),
      this._panelConfig.getValue('decimals')
    );
  }

  get formattedValue(): string {
    const value =
      this._panelConfig.getValue('valueLabelType') === 'percentage' ?
      this.aggregatedProgress :
      this._aggregatedValue;
    return getFormattedValue(
      value,
      this._panelConfig.getValue('prefix'),
      this._panelConfig.getValue('postfix'),
      this._panelConfig.getValue('decimals')
    );
  }

  get color(): string {
    var colorType = this._panelConfig.getValue('coloringType');
    if(colorType === 'auto') {
      return 'auto'
    }
    if(colorType === 'thresholds') {
      var thresholdsStr = this._panelConfig.getValue('thresholds');
      var colors = this._panelConfig.getValue('colors');
      var value = this.aggregatedProgress;
      if(thresholdsStr === undefined) {
        return colors[0];
      }
      var thresholds = thresholdsStr.split(',').map(parseFloat);
      for(var i = thresholds.length; i > 0; i--) {
        if(value >= thresholds[i - 1]) {
          return colors[i];
        }
      }
      return colors[0];
    }
    if(colorType === 'key mapping') {
      var colorKeyMappings = this._panelConfig.getValue('colorKeyMappings') as any[];
      var keyColorMapping = _.find(colorKeyMappings, k => k.key === this._key);
      if(keyColorMapping === undefined) {
        return this._panelConfig.getValue('colorsKeyMappingDefault');
      }
      return keyColorMapping.color;
    }

    throw new Error('Unknown color type ' + colorType);
  }

}

export class Mapper {

  private _panelConfig: PanelConfig;
  private _templateSrv: any;

  constructor(panelConfig: PanelConfig, templateSrv: any) {
    this._panelConfig = panelConfig;
    this._templateSrv = templateSrv;
  }

  mapMetricData(seriesList: any): ProgressItem[] {
    const statType: StatType = this._panelConfig.getValue('statNameOptionValue');
    const mappingType = this._panelConfig.getValue('mappingType');
    const statProgressType = this._panelConfig.getValue('statProgressType');
    const statProgressMaxValue = this._panelConfig.getValue('statProgressMaxValue');
    const alias = this._panelConfig.getValue('alias');
    const nullMapping = this._panelConfig.getValue('nullMapping');

    if(seriesList === undefined || seriesList.length == 0) {
      return [];
    }

    let kstat: KeyValue[] = [];
    let currentStat: KeyValue[] = [];
    if(mappingType === 'datapoint to datapoint') {
      if(statType === StatType.TOTAL && seriesList.length == 1) {
        kstat = this._mapKeysTotal(seriesList);
      } else {
        kstat = this._mapNumeric(seriesList, statType, nullMapping);
      }
      currentStat = this._mapNumeric(seriesList, StatType.CURRENT, nullMapping);
    } else {
      kstat = this._mapTargetToDatapoints(seriesList, statType);
      currentStat = this._mapTargetToDatapoints(seriesList, StatType.CURRENT);
    }

    const maxValue = this._getMaxValue(kstat, statProgressType, statProgressMaxValue);
    const currentMaxValue = this._getMaxValue(currentStat, statProgressType, statProgressMaxValue);

    if(alias !== '') {
      kstat.forEach(k => {
        const scopedVars = {
          __key: { value: k[0] }
        };
        k[0] = this._templateSrv.replace(alias, scopedVars);
      });
    }

    return _.map(
      kstat,
      (k: KeyValue, idx: number) => new ProgressItem(
        this._panelConfig,
        k[0],
        k[1],
        maxValue,
        currentStat[idx][1],
        currentMaxValue
      )
    );
  }

  // TODO: enum statProgressType
  _getMaxValue(
    kstat: KeyValue[],
    statProgressType: string,
    statProgressMaxValue: number | null
  ): number {
    if(statProgressType === 'shared') {
      let total = 0;
      for(let i = 0; i < kstat.length; i++) {
        total += kstat[i][1];
      }
      return total;
    }

    if(statProgressType === 'max value') {
      let max = -Infinity;
      if(statProgressMaxValue !== null) {
        max = statProgressMaxValue;
      } else {
        for(let i = 0; i < kstat.length; i++) {
          max = Math.max(kstat[i][1], max);
        }
      }
      return max;
    }

    return -1;
  }

  _mapKeysTotal(seriesList): KeyValue[] {
    if(seriesList.length !== 1) {
      throw new Error('Expecting list of keys: got more than one timeseries');
    }
    var kv = {};
    var datapointsLength = seriesList[0].datapoints.length;
    for(let i = 0; i < datapointsLength; i++) {
      let k = seriesList[0].datapoints[i][0].toString();
      if(kv[k] === undefined) {
        kv[k] = 0;
      }
      kv[k]++;
    }

    var res: KeyValue[] = [];
    for(let k in kv) {
      res.push([k, kv[k]]);
    }

    return res;

  }

  _mapNumeric(seriesList, statType: StatType, nullMapping): KeyValue[] {
    if(seriesList.length != 2) {
      throw new Error('Expecting timeseries in format (key, value). You can use keys only in total mode');
    }
    if(seriesList[0].datapoints.length !==  seriesList[1].datapoints.length) {
      throw new Error('Timeseries has different length');
    }

    var kv = {};
    var datapointsLength = seriesList[0].datapoints.length;

    for(let i = 0; i < datapointsLength; i++) {
      let k = seriesList[0].datapoints[i][0].toString();
      let v = seriesList[1].datapoints[i][0];
      let vn = parseFloat(v);
      if(v === null) {
        if(nullMapping === undefined || nullMapping === null) {
          throw new Error('Got null value. You set null value mapping in Options -> Mapping -> Null');
        }
        console.log('nullMapping ->' + nullMapping);
        vn = nullMapping;
      }
      if(isNaN(vn)) {
        throw new Error('Got non-numberic value: ' + v);
      }
      if(kv[k] === undefined) {
        kv[k] = [];
      }
      kv[k].push(vn);
    }

    var res: KeyValue[] = [];
    for(let k in kv) {
      res.push([k, this._flatSeries(kv[k], statType)]);
    }

    return res;
  }

  _mapTargetToDatapoints(seriesList, statType: StatType): KeyValue[] {
    return seriesList.map(serie => [
      serie.target,
      this._flatSeries(serie.datapoints.map(datapoint => datapoint[0]), statType)
    ]);
  }

  _flatSeries(values: number[], statType: StatType): number {
    if(values.length === 0) {
      return 0;
    }

    if(statType === StatType.TOTAL) {
      return _.sum(values);
    }

    if(statType === StatType.MAX) {
      return _.max(values) as number;
    }

    if(statType === StatType.MIN) {
      return _.min(values) as number;
    }

    if(statType === StatType.CURRENT) {
      return _.last(values) as number;
    }

    return 0;
  }
}
