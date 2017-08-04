
export type ItemId = number;

export enum ItemState {
  WAITING,
  PROGRESS
}

export abstract class ItemModel {

  public static buildFromObject(obj): ItemModel {
    if(!obj.id) {
      throw new Error('No id in object');
    }
    if(!obj.state) {
      throw new Error('No state in object');
    }
    if(isNaN(obj.id)) {
      throw new Error('Type of id should be number');
    }

    var stateStr = (obj.state as string).toUpperCase();
    if(ItemState[stateStr] === undefined) {
      throw new Error('Can`t find state ' + obj.state);
    }
    
    var state = ItemState[stateStr];
    var id: ItemId = +obj.id;
    
    try {
      if(state === ItemState.PROGRESS) {
        return new ItemProgressModel(id, obj);
      }
      if(state === ItemState.WAITING) {
        return new ItemWaitingModel(id, obj);
      }
      return new ItemWaitingModel(id, obj);
    } catch(e) {
      throw new Error(e.message + '[' + id + ']') 
    }
  }
  
  private _id: ItemId;
  private _state: ItemState;
  private _options: any;
  
  constructor(id: ItemId, state: ItemState, options: any) {
    this._id = id;
    this._state = state;
    this._options = options;
  }

  get id(): ItemId {
    if(this._id === undefined) {
      throw new Error('Id is undefined');
    }
    return this._id;
  }

  get state(): ItemState {
    if(this._state === undefined) {
      throw new Error('State is undefined');
    }
    return this._state;
  }
  
  get options(): any {
    if(this._state === undefined) {
      throw new Error('State is undefined');
    }
    return this._options;
  }
}

export class ItemProgressModel extends ItemModel {
  private _progress: number;
  constructor(id: ItemId, obj: any) {
    super(id, ItemState.PROGRESS, obj);
    if(obj.progress === undefined) {
      throw new Error('Expecting progress in object');
    }
    if(isNaN(obj.progress)) {
      throw new Error('Progress should be a number');
    }
    this._progress = +obj.progress;
  }
  get progress(): number {
    return this._progress;
  }
}

export class ItemWaitingModel extends ItemModel {
  constructor(id: ItemId, obj: any) {
    super(id, ItemState.WAITING, obj);
  }
}