export type ItemId = number;

export class ItemProgressModel {

  public static buildFromObject(obj): ItemProgressModel {
    if(!obj.id) {
      throw new Error('No id in object');
    }
    if(isNaN(obj.id)) {
      throw new Error('Type of id should be number');
    }
    
    obj.progress = +obj.progress;
    if(isNaN(obj.progress)) {
      throw new Error('Progress should be number');
    }
    
    var id: ItemId = +obj.id;
    var name = "NO_NAME";
    if(obj.name !== undefined) {
      name = obj.name;
    }
    
    return new ItemProgressModel(obj.id, obj.name, obj.progress);

  }

  private _id: ItemId;
  private _name: string;
  private _progress: number;

  constructor(id: ItemId, name: string, progress: number) {
    if(id === undefined) {
      throw new Error('Id is undefined');
    }

    this._id = id;
    this._name = name;
    this._progress = progress;
  }

  get id(): ItemId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
  
  get progress(): number {
    return this._progress;
  }

}
