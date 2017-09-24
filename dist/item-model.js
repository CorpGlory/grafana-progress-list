System.register([], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var ItemState, ItemModel, ItemProgressModel, ItemWaitingModel;
    return {
        setters: [],
        execute: function () {
            (function (ItemState) {
                ItemState[ItemState["WAITING"] = 0] = "WAITING";
                ItemState[ItemState["PROGRESS"] = 1] = "PROGRESS";
            })(ItemState || (ItemState = {}));
            exports_1("ItemState", ItemState);
            ItemModel = (function () {
                function ItemModel(id, state, name, options) {
                    if (id === undefined) {
                        throw new Error('Id is undefined');
                    }
                    if (state === undefined) {
                        throw new Error('State is undefined');
                    }
                    this._id = id;
                    this._state = state;
                    this._name = name;
                    this._options = options;
                }
                ItemModel.buildFromObject = function (obj) {
                    if (!obj.id) {
                        throw new Error('No id in object');
                    }
                    if (!obj.state) {
                        throw new Error('No state in object');
                    }
                    if (isNaN(obj.id)) {
                        throw new Error('Type of id should be number');
                    }
                    var stateStr = obj.state.toUpperCase();
                    if (ItemState[stateStr] === undefined) {
                        throw new Error('Can`t find state ' + obj.state);
                    }
                    var state = ItemState[stateStr];
                    var id = +obj.id;
                    var name = "NO_NAME";
                    if (obj.name !== undefined) {
                        name = obj.name;
                    }
                    try {
                        if (state === ItemState.PROGRESS) {
                            return new ItemProgressModel(id, name, obj);
                        }
                        if (state === ItemState.WAITING) {
                            return new ItemWaitingModel(id, name, obj);
                        }
                        return new ItemWaitingModel(id, name, obj);
                    }
                    catch (e) {
                        throw new Error(e.message + ' [' + id + ']');
                    }
                };
                Object.defineProperty(ItemModel.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ItemModel.prototype, "state", {
                    get: function () {
                        return this._state;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ItemModel.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ItemModel.prototype, "options", {
                    get: function () {
                        if (this._state === undefined) {
                            throw new Error('State is undefined');
                        }
                        return this._options;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ItemModel;
            }());
            exports_1("ItemModel", ItemModel);
            ItemProgressModel = (function (_super) {
                __extends(ItemProgressModel, _super);
                function ItemProgressModel(id, name, obj) {
                    var _this = _super.call(this, id, ItemState.PROGRESS, name, obj) || this;
                    if (obj.progress === undefined) {
                        throw new Error('Expecting progress in object');
                    }
                    if (isNaN(obj.progress)) {
                        throw new Error('Progress should be a number');
                    }
                    _this._progress = +obj.progress;
                    return _this;
                }
                Object.defineProperty(ItemProgressModel.prototype, "progress", {
                    get: function () {
                        return this._progress;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ItemProgressModel;
            }(ItemModel));
            exports_1("ItemProgressModel", ItemProgressModel);
            ItemWaitingModel = (function (_super) {
                __extends(ItemWaitingModel, _super);
                function ItemWaitingModel(id, name, obj) {
                    return _super.call(this, id, ItemState.WAITING, name, obj) || this;
                }
                return ItemWaitingModel;
            }(ItemModel));
            exports_1("ItemWaitingModel", ItemWaitingModel);
        }
    };
});
//# sourceMappingURL=item-model.js.map