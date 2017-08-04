/// <reference path="./item-model.ts" />
/// <reference path="./module-config.ts" />


import { ItemModel, ItemState } from './item-model';
import { ModuleConfig } from './module-config';


export class Mapper {
  
  private _mappingFunctionSource: string;
  private _mappingFunction: any;
  
  constructor() {
    var configValue = ModuleConfig.getInstance().getValue('mappingFunctionSource');
    this._mappingFunctionSource = configValue ? configValue : DEFAULT_MAPPING_SOURCE;
  }

  get mappingFunctionSource(): string {
    return this._mappingFunctionSource;
  }

  set mappingFunctionSource(text: string) {
    ModuleConfig.getInstance().setValue('mappingFunctionSource', text);
    this._mappingFunctionSource = text;
  }
  
  mapMetricData(seriesList: any): [ItemModel] {
    return [new ItemModel(1, ItemState.PROGRESS)];
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
      status: "waiting"
    },
    {
      id: 2,
      status: "progress",
      progress: 23.23
    },
    {
      id: 3,
      status: "progress",
      progress: 67.8
    }
  ];
}

const DEFAULT_MAPPING_SOURCE = (DEFAULT_MAPPING_FUN + '$')
  .replace('function DEFAULT_MAPPING(', 'function(')
  .replace(new RegExp('        ', 'g'), '  ')
  .replace('      }$', '}');
