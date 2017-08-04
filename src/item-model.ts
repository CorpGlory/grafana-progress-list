
export type ItemId = number;

export enum ItemState {
  WAITING,
  PROGRESS
}

export class ItemModel {
  private _id: ItemId;
  private _state: ItemState;
  constructor(id: ItemId, state: ItemState) {
    this._id = id;
    this._state = state;
  }

  get id() {
    if(this._id === undefined) {
      throw new Error('Id is undefined');
    }
    return this._id;
  }

  get state() {
    if(this._state === undefined) {
      throw new Error('State is undefined');
    }
    return ItemState[this._state];
  }
}