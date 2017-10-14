import { PanelConfig } from './panel-config';

import * as _ from 'lodash';

export type KeyValue = [string, number];

export class Mapper {

  private _panelConfig: PanelConfig;

  constructor(panelConfig: PanelConfig) {
    this._panelConfig = panelConfig;
  }

  mapMetricData(seriesList: any): KeyValue[] {
    if(seriesList.length == 0) {
      return [];
    }
    var kstat: KeyValue[] = [];
    if(this._panelConfig.getValue('statNameOptionValue') === 'total' && seriesList.length == 1) {
      kstat =  this._mapKeysTotal(seriesList);
    } else {
      kstat = this._mapNumeric(seriesList);
    }

    let progressType = this._panelConfig.getValue('statProgressType');

    if(this._panelConfig.getValue('statProgressType') === 'shared') {
      let total = 0;
      for(let i = 0; i < kstat.length; i++) {а
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

    return kstat;

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
