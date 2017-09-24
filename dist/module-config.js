System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ModuleConfig;
    return {
        setters: [],
        execute: function () {
            ModuleConfig = (function () {
                function ModuleConfig(panel) {
                    this._panel = panel;
                }
                ModuleConfig.init = function (panel) {
                    if (ModuleConfig._instance) {
                        throw new Error("Error: Instantiation failed: Use ModuleConfig.getInstance() instead of new.");
                    }
                    ModuleConfig._instance = new ModuleConfig(panel);
                };
                ModuleConfig.getInstance = function () {
                    if (!ModuleConfig._instance) {
                        throw new Error("Error: ModuleConfig isn't created yet.");
                    }
                    return ModuleConfig._instance;
                };
                ModuleConfig.prototype.getValue = function (key) {
                    return this._panel[key];
                };
                ModuleConfig.prototype.setValue = function (key, value) {
                    this._panel[key] = value;
                };
                ModuleConfig._instance = undefined;
                return ModuleConfig;
            }());
            exports_1("ModuleConfig", ModuleConfig);
        }
    };
});
//# sourceMappingURL=module-config.js.map