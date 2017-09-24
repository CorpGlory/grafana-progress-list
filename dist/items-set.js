System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, ItemsSet;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            ItemsSet = (function () {
                function ItemsSet() {
                    this._map = {};
                }
                ItemsSet.prototype.setItemStates = function (models) {
                    var _this = this;
                    var keys = lodash_1.default(this._map).keys().map(function (k) { return (+k); }).value();
                    lodash_1.default.each(models, function (m) {
                        lodash_1.default.remove(keys, m.id);
                    });
                    lodash_1.default.each(keys, function (k) {
                        delete _this._map[k];
                    });
                    return models;
                };
                return ItemsSet;
            }());
            exports_1("ItemsSet", ItemsSet);
        }
    };
});
//# sourceMappingURL=items-set.js.map