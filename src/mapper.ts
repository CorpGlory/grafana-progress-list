import { PanelConfig } from './panel-config';

import * as _ from 'lodash';

type KeyValue = [string, number];

export class ProgressItem {
  
  private _panelConfig: PanelConfig;
  
  private _key: string;
  private _value: number;
  
  public constructor(panelConfig: PanelConfig, keyValue: KeyValue) {
    this._panelConfig = panelConfig;
    this._key = keyValue[0];
    this._value = keyValue[1];
  }
  
  get title(): string {
    return this._key;
  }
  
  get progress(): number {
    return this._value;
  }
  
  get formattedProgress(): string {
    var value = this._value;
    var res = this._panelConfig.getValue('prefix');
    res += this._getFormattedFloat();
    
    res += this._panelConfig.getValue('postfix');
    return res;
  }
  
  _getFormattedFloat(): string {
    var value = this._value;
    
    var dm = this._getDecimalsForValue().decimals;
    
    if(dm === 0) {
      return Math.round(value).toString();
    }
    
    var fv = value;
    for(var i = 0; i < dm; i++) {
      fv *= 10;
    };
    var fvs = Math.round(fv).toString();
    return fvs.substr(0, fvs.length - dm) + '.' + fvs.substr(fvs.length - dm);
  }
  
  _getDecimalsForValue() {
    var value = this._value;
    // based on https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts
    if(_.isNumber(this._panelConfig.getValue('decimals'))) {
      return { 
        decimals: this._panelConfig.getValue('decimals'), 
        scaledDecimals: null
      };
    }

    var delta = value / 2;
    var dec = -Math.floor(Math.log(delta) / Math.LN10);

    var magn = Math.pow(10, -dec),
      norm = delta / magn, // norm is between 1.0 and 10.0
      size;

    if(norm < 1.5) {
      size = 1;
    } else if (norm < 3) {
      size = 2;
      // special case for 2.5, requires an extra decimal
      if (norm > 2.25) {
        size = 2.5;
        ++dec;
      }
    } else if(norm < 7.5) {
      size = 5;
    } else {
      size = 10;
    }

    size *= magn;

    // reduce starting decimals if not needed
    if(Math.floor(value) === value) { 
      dec = 0; 
    }

    var result: any = {};
    result.decimals = Math.max(0, dec);
    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

    return result;
  }
  
  get color() {
    
    var thresholdsStr = this._panelConfig.getValue('thresholds');
    var colors = this._panelConfig.getValue('colors');
    
    console.log(colors);
    var value = this._value;
    if(thresholdsStr === undefined) {
      return colors[0];
    }
    var thresholds = thresholdsStr.split(',').map(parseFloat);
    for (var i = thresholds.length; i > 0; i--) {
      if (value >= thresholds[i - 1]) {
        return colors[i];
      }
    }
    return colors[0];
  }
  
}



export class Mapper {

  private _panelConfig: PanelConfig;

  constructor(panelConfig: PanelConfig) {
    this._panelConfig = panelConfig;
  }

  mapMetricData(seriesList: any): ProgressItem[] {
    if(seriesList === undefined || seriesList.length == 0) {
      return [];
    }
    var kstat: KeyValue[] = [];
    if(this._panelConfig.getValue('statNameOptionValue') === 'total' && seriesList.length == 1) {
      kstat = this._mapKeysTotal(seriesList);
    } else {
      kstat = this._mapNumeric(seriesList);
    }

    let progressType = this._panelConfig.getValue('statProgressType');

    if(this._panelConfig.getValue('statProgressType') === 'shared') {
      let total = 0;
      for(let i = 0; i < kstat.length; i++) {
        total += kstat[i][1];
      }
      for(let i = 0; i < kstat.length; i++) {
        kstat[i][1] = 100 * kstat[i][1] / total;
      }
    }

    if(this._panelConfig.getValue('statProgressType') === 'max Value') {
      let max = 0;
      for(let i = 0; i < kstat.length; i++) {
        max = Math.max(kstat[i][1], max);
      }
      for(let i = 0; i < kstat.length; i++) {
        kstat[i][1] = 100 * kstat[i][1] / max;
      }
    }

    return _.map(kstat, k => new ProgressItem(this._panelConfig, k));

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

  _mapNumeric(seriesList): KeyValue[] {
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
        vn = 0;
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
      res.push([k, this._flatSeries(kv[k])]);
    }

    return res;

  }

  _flatSeries(values: number[]): number {

    if(values.length === 0) {
      return 0;
    }

    var t = this._panelConfig.getValue('statNameOptionValue');

    if(t === 'total') {
      return _.sum(values);
    }

    if(t === 'max') {
      return _.max(values) as number;
    }

    if(t === 'min') {
      return _.min(values) as number;
    }

    if(t === 'current') {
      return values[values.length - 1];
    }

    return 0;
  }

}
