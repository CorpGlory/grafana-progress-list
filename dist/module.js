define(["app/core/core","app/plugins/sdk","lodash"], function(__WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__, __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__, __WEBPACK_EXTERNAL_MODULE_lodash__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./directives/progress.ts":
/*!********************************!*\
  !*** ./directives/progress.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst core_1 = __webpack_require__(/*! grafana/app/core/core */ \"grafana/app/core/core\");\nvar directiveInited = false;\nfunction initProgress(panelConfig, directiveName = \"progress\") {\n    if (directiveInited) {\n        return;\n    }\n    directiveInited = true;\n    core_1.coreModule\n        .directive(directiveName, function () {\n        return {\n            templateUrl: panelConfig.pluginDirName + 'directives/progress.html',\n            restrict: 'E',\n            scope: {\n                item: \"=\"\n            }\n        };\n    });\n}\nexports.initProgress = initProgress;\n\n\n//# sourceURL=webpack:///./directives/progress.ts?");

/***/ }),

/***/ "./mapper.ts":
/*!*******************!*\
  !*** ./mapper.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst _ = __webpack_require__(/*! lodash */ \"lodash\");\nclass ProgressItem {\n    constructor(panelConfig, key, value, maxValue) {\n        this._panelConfig = panelConfig;\n        this._key = key;\n        this._value = value;\n        this._maxValue = maxValue;\n    }\n    get title() {\n        return this._key;\n    }\n    get progress() {\n        return 100 * this._value / this._maxValue;\n    }\n    get value() {\n        return this._value;\n    }\n    get formattedValue() {\n        var value = this._value;\n        var res = this._panelConfig.getValue('prefix');\n        res += this._getFormattedFloat();\n        res += this._panelConfig.getValue('postfix');\n        return res;\n    }\n    _getFormattedFloat() {\n        var value = this._panelConfig.getValue('valueLabelType') === 'percentage' ?\n            this.progress : this.value;\n        var dm = this._getDecimalsForValue().decimals;\n        if (dm === 0) {\n            return Math.round(value).toString();\n        }\n        var fv = value;\n        for (var i = 0; i < dm; i++) {\n            fv *= 10;\n        }\n        ;\n        var fvs = Math.round(fv).toString();\n        return fvs.substr(0, fvs.length - dm) + '.' + fvs.substr(fvs.length - dm);\n    }\n    _getDecimalsForValue() {\n        var value = this._value;\n        // based on https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts\n        if (_.isNumber(this._panelConfig.getValue('decimals'))) {\n            return {\n                decimals: this._panelConfig.getValue('decimals'),\n                scaledDecimals: null\n            };\n        }\n        var delta = value / 2;\n        var dec = -Math.floor(Math.log(delta) / Math.LN10);\n        var magn = Math.pow(10, -dec), norm = delta / magn, // norm is between 1.0 and 10.0\n        size;\n        if (norm < 1.5) {\n            size = 1;\n        }\n        else if (norm < 3) {\n            size = 2;\n            // special case for 2.5, requires an extra decimal\n            if (norm > 2.25) {\n                size = 2.5;\n                ++dec;\n            }\n        }\n        else if (norm < 7.5) {\n            size = 5;\n        }\n        else {\n            size = 10;\n        }\n        size *= magn;\n        // reduce starting decimals if not needed\n        if (Math.floor(value) === value) {\n            dec = 0;\n        }\n        var result = {};\n        result.decimals = Math.max(0, dec);\n        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;\n        return result;\n    }\n    get color() {\n        var colorType = this._panelConfig.getValue('coloringType');\n        if (colorType === 'auto') {\n            return 'auto';\n        }\n        if (colorType === 'thresholds') {\n            var thresholdsStr = this._panelConfig.getValue('thresholds');\n            var colors = this._panelConfig.getValue('colors');\n            var value = this.progress;\n            if (thresholdsStr === undefined) {\n                return colors[0];\n            }\n            var thresholds = thresholdsStr.split(',').map(parseFloat);\n            for (var i = thresholds.length; i > 0; i--) {\n                if (value >= thresholds[i - 1]) {\n                    return colors[i];\n                }\n            }\n            return colors[0];\n        }\n        if (colorType === 'key mapping') {\n            var colorKeyMappings = this._panelConfig.getValue('colorKeyMappings');\n            var keyColorMapping = _.find(colorKeyMappings, k => k.key === this._key);\n            if (keyColorMapping === undefined) {\n                return this._panelConfig.getValue('colorsKeyMappingDefault');\n            }\n            return keyColorMapping.color;\n        }\n        throw new Error('Unknown color type ' + colorType);\n    }\n}\nexports.ProgressItem = ProgressItem;\nclass Mapper {\n    constructor(panelConfig) {\n        this._panelConfig = panelConfig;\n    }\n    mapMetricData(seriesList) {\n        if (seriesList === undefined || seriesList.length == 0) {\n            return [];\n        }\n        var kstat = [];\n        if (this._panelConfig.getValue('statNameOptionValue') === 'total' && seriesList.length == 1) {\n            kstat = this._mapKeysTotal(seriesList);\n        }\n        else {\n            kstat = this._mapNumeric(seriesList);\n        }\n        let progressType = this._panelConfig.getValue('statProgressType');\n        var maxValue = -1;\n        if (this._panelConfig.getValue('statProgressType') === 'shared') {\n            let total = 0;\n            for (let i = 0; i < kstat.length; i++) {\n                total += kstat[i][1];\n            }\n            maxValue = total;\n        }\n        if (this._panelConfig.getValue('statProgressType') === 'max value') {\n            let max = -Infinity;\n            if (this._panelConfig.getValue('statProgressMaxValue') !== null) {\n                max = this._panelConfig.getValue('statProgressMaxValue');\n            }\n            else {\n                for (let i = 0; i < kstat.length; i++) {\n                    max = Math.max(kstat[i][1], max);\n                }\n            }\n            maxValue = max;\n        }\n        return _.map(kstat, k => new ProgressItem(this._panelConfig, k[0], k[1], maxValue));\n    }\n    _mapKeysTotal(seriesList) {\n        if (seriesList.length !== 1) {\n            throw new Error('Expecting list of keys: got more than one timeseries');\n        }\n        var kv = {};\n        var datapointsLength = seriesList[0].datapoints.length;\n        for (let i = 0; i < datapointsLength; i++) {\n            let k = seriesList[0].datapoints[i][0].toString();\n            if (kv[k] === undefined) {\n                kv[k] = 0;\n            }\n            kv[k]++;\n        }\n        var res = [];\n        for (let k in kv) {\n            res.push([k, kv[k]]);\n        }\n        return res;\n    }\n    _mapNumeric(seriesList) {\n        if (seriesList.length != 2) {\n            throw new Error('Expecting timeseries in format (key, value). You can use keys only in total mode');\n        }\n        if (seriesList[0].datapoints.length !== seriesList[1].datapoints.length) {\n            throw new Error('Timeseries has different length');\n        }\n        var kv = {};\n        var datapointsLength = seriesList[0].datapoints.length;\n        var nullMapping = this._panelConfig.getValue('nullMapping');\n        for (let i = 0; i < datapointsLength; i++) {\n            let k = seriesList[0].datapoints[i][0].toString();\n            let v = seriesList[1].datapoints[i][0];\n            let vn = parseFloat(v);\n            if (v === null) {\n                if (nullMapping === undefined || nullMapping === null) {\n                    throw new Error('Got null value. You set null value mapping in Options -> Mapping -> Null');\n                }\n                console.log('nullMapping ->' + nullMapping);\n                vn = nullMapping;\n            }\n            if (isNaN(vn)) {\n                throw new Error('Got non-numberic value: ' + v);\n            }\n            if (kv[k] === undefined) {\n                kv[k] = [];\n            }\n            kv[k].push(vn);\n        }\n        var res = [];\n        for (let k in kv) {\n            res.push([k, this._flatSeries(kv[k])]);\n        }\n        return res;\n    }\n    _flatSeries(values) {\n        if (values.length === 0) {\n            return 0;\n        }\n        var t = this._panelConfig.getValue('statNameOptionValue');\n        if (t === 'total') {\n            return _.sum(values);\n        }\n        if (t === 'max') {\n            return _.max(values);\n        }\n        if (t === 'min') {\n            return _.min(values);\n        }\n        if (t === 'current') {\n            return values[values.length - 1];\n        }\n        return 0;\n    }\n}\nexports.Mapper = Mapper;\n\n\n//# sourceURL=webpack:///./mapper.ts?");

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst panel_config_1 = __webpack_require__(/*! ./panel-config */ \"./panel-config.ts\");\nconst mapper_1 = __webpack_require__(/*! ./mapper */ \"./mapper.ts\");\nconst sdk_1 = __webpack_require__(/*! grafana/app/plugins/sdk */ \"grafana/app/plugins/sdk\");\nconst progress_1 = __webpack_require__(/*! ./directives/progress */ \"./directives/progress.ts\");\nconst _ = __webpack_require__(/*! lodash */ \"lodash\");\nconst DEFAULTS = {\n    statNameOptionValue: 'current',\n    statProgressType: 'shared',\n    statProgressMaxValue: null,\n    coloringType: 'none',\n    sortingOrder: 'none',\n    valueLabelType: 'percentage',\n    prefix: '',\n    postfix: '',\n    thresholds: '10, 30',\n    // https://github.com/grafana/grafana/blob/v4.1.1/public/app/plugins/panel/singlestat/module.ts#L57\n    colors: [\"rgba(245, 54, 54, 0.9)\", \"rgba(237, 129, 40, 0.89)\", \"rgba(50, 172, 45, 0.97)\"],\n    colorsKeyMappingDefault: \"rgba(245, 54, 54, 0.9)\",\n    colorKeyMappings: [],\n    nullMapping: undefined\n};\nclass Ctrl extends sdk_1.MetricsPanelCtrl {\n    constructor($scope, $injector) {\n        super($scope, $injector);\n        this.statNameOptions = ['current', 'min', 'max', 'total'];\n        this.statProgressTypeOptions = ['max value', 'shared'];\n        this.coloringTypeOptions = ['none', 'thresholds', 'key mapping'];\n        this.sortingOrderOptions = ['none', 'increasing', 'decreasing'];\n        this.valueLabelTypeOptions = ['absolute', 'percentage'];\n        _.defaults(this.panel, DEFAULTS);\n        this._panelConfig = new panel_config_1.PanelConfig(this.panel);\n        this._initStyles();\n        progress_1.initProgress(this._panelConfig, 'progressListPluginProgress');\n        this.mapper = new mapper_1.Mapper(this._panelConfig);\n        this.items = [];\n        this.events.on('init-edit-mode', this._onInitEditMode.bind(this));\n        this.events.on('data-received', this._onDataReceived.bind(this));\n        this.events.on('render', this._onRender.bind(this));\n    }\n    link(scope, element) {\n        this._element = element;\n    }\n    _initStyles() {\n        // small hack to load base styles\n        sdk_1.loadPluginCss({\n            light: this._panelConfig.pluginDirName + 'css/panel.base.css',\n            dark: this._panelConfig.pluginDirName + 'css/panel.base.css'\n        });\n        sdk_1.loadPluginCss({\n            light: this._panelConfig.pluginDirName + 'css/panel.light.css',\n            dark: this._panelConfig.pluginDirName + 'css/panel.dark.css'\n        });\n    }\n    _onRender() {\n        var items = this.mapper.mapMetricData(this._seriesList);\n        if (this._panelConfig.getValue('sortingOrder') === 'increasing') {\n            items = _.sortBy(items, i => i.progress);\n        }\n        if (this._panelConfig.getValue('sortingOrder') === 'decreasing') {\n            items = _.sortBy(items, i => -i.progress);\n        }\n        this.$scope.items = items;\n        this._element.find('.table-panel-scroll').css({\n            'height': `${this.height}px`,\n            'max-height': `${this.height}px`\n        });\n    }\n    _onDataReceived(seriesList) {\n        this._seriesList = seriesList;\n        this.render();\n    }\n    _onInitEditMode() {\n        var thisPartialPath = this._panelConfig.pluginDirName + 'partials/';\n        this.addEditorTab('Options', thisPartialPath + 'options.html', 2);\n    }\n    invertColorOrder() {\n        var tmp = this.panel.colors[0];\n        this.panel.colors[0] = this.panel.colors[2];\n        this.panel.colors[2] = tmp;\n        this.render();\n    }\n    addColorKeyMapping() {\n        this.panel.colorKeyMappings.push({\n            key: 'KEY_NAME',\n            color: \"rgba(50, 172, 45, 0.97)\"\n        });\n    }\n    removeColorKeyMapping(index) {\n        this.panel.colorKeyMappings.splice(index, 1);\n        this.render();\n    }\n    _dataError(err) {\n        this.$scope.data = [];\n        this.$scope.dataError = err;\n    }\n}\nCtrl.templateUrl = \"partials/template.html\";\nexports.PanelCtrl = Ctrl;\n\n\n//# sourceURL=webpack:///./module.ts?");

/***/ }),

/***/ "./panel-config.ts":
/*!*************************!*\
  !*** ./panel-config.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass PanelConfig {\n    constructor(panel) {\n        this._panel = panel;\n    }\n    getValue(key) {\n        return this._panel[key];\n    }\n    setValue(key, value) {\n        this._panel[key] = value;\n    }\n    get pluginDirName() {\n        if (!this._pluginDirName) {\n            var panels = window['grafanaBootData'].settings.panels;\n            var thisPanel = panels[this._panel.type];\n            // the system loader preprends publib to the url,\n            // add a .. to go back one level\n            this._pluginDirName = '../' + thisPanel.baseUrl + '/';\n        }\n        return this._pluginDirName;\n    }\n}\nexports.PanelConfig = PanelConfig;\n\n\n//# sourceURL=webpack:///./panel-config.ts?");

/***/ }),

/***/ "grafana/app/core/core":
/*!********************************!*\
  !*** external "app/core/core" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__;\n\n//# sourceURL=webpack:///external_%22app/core/core%22?");

/***/ }),

/***/ "grafana/app/plugins/sdk":
/*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;\n\n//# sourceURL=webpack:///external_%22app/plugins/sdk%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ })

/******/ })});;