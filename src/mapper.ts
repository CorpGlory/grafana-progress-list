import { ItemProgressModel } from './item-progress-model';
import { PanelConfig } from './panel-config';

import * as _ from 'lodash';


export class Mapper {

  private _panelConfig: PanelConfig;

  constructor(panelConfig: PanelConfig) {
    this._panelConfig = panelConfig;
  }

  mapMetricData(seriesList: any): ItemProgressModel[] {
    return [
      ItemProgressModel.buildFromObject({id: 1, name: "st1", progress: 35.1 }),
      ItemProgressModel.buildFromObject({id: 2, name: "st2", progress: 12.98 }),
      ItemProgressModel.buildFromObject({id: 3, name: "st3", progress: 57.5 })
    ];
  }

}
