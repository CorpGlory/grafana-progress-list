/// <reference path="./item-model.ts" />


import { ItemModel, ItemState, ItemId } from './item-model';

import _ from 'lodash';


export class ItemsSet {

  private _map = {};

  constructor() {

  }
  
  setItemStates(models: ItemModel[]): ItemModel[] {
    // It's because I want to find killed items and track changes betwwen states
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