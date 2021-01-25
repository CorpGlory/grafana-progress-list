import { ProgressBar } from './progress_bar';
import { PanelConfig, StatType } from './panel_config';


import * as _ from 'lodash';


type KeyValue = [string, number];


export class Mapper {

  private _panelConfig: PanelConfig;
  private _templateSrv: any;

  constructor(panelConfig: PanelConfig, templateSrv: any) {
    this._panelConfig = panelConfig;
    this._templateSrv = templateSrv;
  }

  mapMetricData(seriesList: any): ProgressBar[] {
    const statType: StatType = this._panelConfig.getValue('statNameOptionValue');
    const statProgressType = this._panelConfig.getValue('statProgressType');
    const statProgressMaxValue = this._panelConfig.getValue('statProgressMaxValue');
    const alias = this._panelConfig.getValue('alias');
    const nullMapping = this._panelConfig.getValue('nullMapping');

    if(seriesList === undefined || seriesList.length == 0) {
      return [];
    }

    if(seriesList[0].columns === undefined) {
      throw new Error('"Time Series" queries are not supported, please make sure to select "Table" and query at least 2 metrics');
    }

    let keys = seriesList[0].columns.map(col => col.text);

    const keyColumn = this._panelConfig.getValue('keyColumn');
    let keyIndex = 0;
    if(keyColumn !== '') {
      keyIndex = keys.findIndex(key => key === keyColumn);
    }

    let skipIndexes: number[] = [keyIndex];
    const skipColumns = this._panelConfig.getValue('skipColumns');
    skipColumns.forEach(column => {
      const index = keys.findIndex(key => key === column);
      if(index >= 0) {
        skipIndexes.push(index);
      }
    });
    
    const firstRowMaxes =  seriesList[0].rows.map(
      row => _.sum(
        row.filter((value, idx) => !_.includes(skipIndexes, idx))
      )
    );
    const maxValue = _.max(firstRowMaxes);
    const filteredKeys = keys.filter((key, idx) => !_.includes(skipIndexes, idx));

    // TODO: it's wrong, we return a bad type here
    return seriesList[0].rows.map(
      row => new ProgressBar(
        this._panelConfig,
        row[keyIndex],
        filteredKeys,
        row.filter((value, idx) => !_.includes(skipIndexes, idx)),
        maxValue as number
      )
    );

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
