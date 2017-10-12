import { ItemProgressModel, ItemId } from './item-progress-model';

import * as _ from 'lodash';


export class ItemsSet {

  private _map = {};

  constructor() {
  }
  
  setItemStates(models: ItemProgressModel[]): ItemProgressModel[] {
    // It's because I want to find killed items and track changes between states
    var keys = _(this._map).keys().map(k => ((+k) as ItemId)).value();
    _.each(models, m => {
      _.remove(keys, m.id);
    });
    _.each(keys, k => {
      delete this._map[k];
    });
    return models;
  }

}