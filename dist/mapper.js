System.register(["./item-model", "./module-config", "lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var item_model_1, module_config_1, lodash_1, Mapper, DEFAULT_MAPPING_FUN, DEFAULT_MAPPING_SOURCE;
    return {
        setters: [
            function (item_model_1_1) {
                item_model_1 = item_model_1_1;
            },
            function (module_config_1_1) {
                module_config_1 = module_config_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            Mapper = (function () {
                function Mapper() {
                    var configValue = module_config_1.ModuleConfig.getInstance().getValue('mappingFunctionSource');
                    this._mappingFunctionSource = configValue ? configValue : DEFAULT_MAPPING_SOURCE;
                    this.recompileMappingFunction();
                }
                Object.defineProperty(Mapper.prototype, "mappingFunctionSource", {
                    get: function () {
                        return this._mappingFunctionSource;
                    },
                    set: function (text) {
                        module_config_1.ModuleConfig.getInstance().setValue('mappingFunctionSource', text);
                        this._mappingFunctionSource = text;
                        this.recompileMappingFunction();
                    },
                    enumerable: true,
                    configurable: true
                });
                Mapper.prototype.mapMetricData = function (seriesList) {
                    if (!this._mappingFunction) {
                        throw new Error('Mapping function doesn`t exist');
                    }
                    var rawRes = this._mappingFunction(seriesList);
                    return lodash_1.default.map(rawRes, item_model_1.ItemModel.buildFromObject);
                };
                Mapper.prototype.recompileMappingFunction = function () {
                    this._mappingFunction = eval("(" + this._mappingFunctionSource + ")");
                };
                return Mapper;
            }());
            exports_1("Mapper", Mapper);
            DEFAULT_MAPPING_FUN = function (seriesListItem) {
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
            };
            DEFAULT_MAPPING_SOURCE = (DEFAULT_MAPPING_FUN + '$')
                .replace('function DEFAULT_MAPPING(', 'function(')
                .replace(new RegExp('        ', 'g'), '  ')
                .replace('      }$', '}');
        }
    };
});
//# sourceMappingURL=mapper.js.map