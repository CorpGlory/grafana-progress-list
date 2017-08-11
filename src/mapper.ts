/// <reference path="./item-model.ts" />
/// <reference path="./module-config.ts" />


import { ItemModel, ItemState } from './item-model';
import { ModuleConfig } from './module-config';

import _ from 'lodash';


export class Mapper {

  private _mappingFunctionSource: string;
  private _mappingFunction: any;

  constructor() {
    var configValue = ModuleConfig.getInstance().getValue('mappingFunctionSource');
    this._mappingFunctionSource = configValue ? configValue : DEFAULT_MAPPING_SOURCE;
    this.recompileMappingFunction();
  }

  get mappingFunctionSource(): string {
    return this._mappingFunctionSource;
  }

  set mappingFunctionSource(text: string) {
    ModuleConfig.getInstance().setValue('mappingFunctionSource', text);
    this._mappingFunctionSource = text;
    this.recompileMappingFunction();
  }
  
  mapMetricData(seriesList: any): ItemModel[] {
    if(!this._mappingFunction) {
      throw new Error('Mapping function doesn`t exist');
    }
    var rawRes = this._mappingFunction(seriesList) as any[];
    return _.map(rawRes, ItemModel.buildFromObject);
  }
  
  private recompileMappingFunction() {
    this._mappingFunction = eval(`(${this._mappingFunctionSource})`);
  }

}

const DEFAULT_MAPPING_FUN = function(seriesListItem) {
  /*
  Should return:
  [{
    id: (number),
    status: (string),
    ... other options ...
  }]
  */

  return [
    {
      id: 1,
      state: "waiting",
      name: "Stage 1"
    },
    {
      id: 2,
      state: "progress",
      progress: 23.23,
      name: "Stage 2"
    },
    {
      id: 3,
      state: "progress",
      progress: 67.8,
      name: "Stage 3"
    }
  ];
}

const DEFAULT_MAPPING_SOURCE = (DEFAULT_MAPPING_FUN + '$')
  .replace('function DEFAULT_MAPPING(', 'function(')
  .replace(new RegExp('        ', 'g'), '  ')
  .replace('      }$', '}');
