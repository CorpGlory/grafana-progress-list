import { ProgressBar } from './progress_bar';
import { PanelConfig, StatType } from './panel_config';


import * as _ from 'lodash';


type KeyValue = [string, number];
type RowValue = string | number;


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
    console.log('all series list', seriesList);
    // if(seriesList[0].columns === undefined) {
    //   throw new Error('"Time Series" queries are not supported, please make sure to select "Table" and query at least 2 metrics');
    // }

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

    const seriesRows = seriesList[0].rows;
    const firstRowMaxes = seriesRows.map(
      row => _.sum(
        row.filter((value, idx) => !_.includes(skipIndexes, idx))
      )
    );
    // TODO: maxValue is wrong for total stat type
    const maxValue = _.max(firstRowMaxes);
    // filteredKeys -> filteredValueKeys?
    const filteredKeys = keys.filter((key, idx) => !_.includes(skipIndexes, idx));
    console.log('filteredKeys', filteredKeys)
    const mappedRows = this._mapRowsByKey(seriesRows, keyIndex, statType);
    console.log('mappedRows', mappedRows);
    // console.log('keyIndex', keyIndex, this._mapRowsByKey(seriesRows, keyIndex));

    // TODO: it's wrong, we return a bad type here
    return mappedRows.map(
      row => new ProgressBar(
        this._panelConfig,
        row[0], // row[0] for mappedRow
        filteredKeys,
        [row[1]], // [row[1]] for mappedRow
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

  private _mapRowsByKey(rows: RowValue[][], keyIndex: number, statType: StatType): [string, number][] {
    // map rows to aggregate data by stat type, return list of [key, value]
    // TODO: throw new Error('Expecting timeseries in format (key, value).');
    if(rows.length === 0) {
      throw new Error('Rows are empty');
    }
    // mb its better to call uniqTitles?
    const uniqKeys = this._getUniqKeysFromRows(rows, keyIndex);
    if(uniqKeys.length === 0) {
      throw new Error('There are no keys in series rows');
    }
    const aggregatedRows = uniqKeys.map(key => {
      const values = this._getRowsValuesForKey(rows, keyIndex, key);
      const value = this._aggregateValues(values, statType);
      return [key, value];
    });
    return aggregatedRows as [string, number][];
  }

  private _getRowsValuesForKey(rows: RowValue[][], keyIndex: number, key: RowValue): number[] {
    // get all values for passed title
    const filteredRows = rows.filter(row => row[keyIndex] === key);
    // TODO: why last? add value index
    // TODO: map null values
    const values = filteredRows.map(row => _.last(row) as number);
    return values;
  }

  private _getUniqKeysFromRows(rows: RowValue[][], keyIndex: number): string[] {
    const allKeys = rows.map(row => row[keyIndex] as string);
    return _.uniq(allKeys);
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
      res.push([k, this._aggregateValues(kv[k], statType)]);
    }

    return res;
  }

  _mapTargetToDatapoints(seriesList, statType: StatType): KeyValue[] {
    return seriesList.map(serie => [
      serie.target,
      this._aggregateValues(serie.datapoints.map(datapoint => datapoint[0]), statType)
    ]);
  }

  _aggregateValues(values: number[], statType: StatType): number {
    if(values.length === 0) {
      throw new Error('Got empty values to aggregate');
    }
    switch(statType) {
      case StatType.TOTAL:
        return _.sum(values);
      case StatType.MAX:
        return _.max(values) as number;
      case StatType.MIN:
        return _.min(values) as number;
      case StatType.CURRENT:
        return _.last(values) as number;
      default:
        throw new Error(`Unknown stat type: ${statType}`);
    }
  }
}
